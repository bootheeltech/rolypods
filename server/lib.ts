// Shared helpers for the Cloudflare Pages Functions in /functions.
// Prices always come from src/lib/products.ts on the server; the browser only sends slugs and quantities.

import { getProduct, isPurchasable, products } from "../src/lib/products";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "../src/lib/shipping";

export interface Env {
  DB: D1Database;
  /** PayPal REST app credentials (developer.paypal.com > Apps & Credentials). */
  PAYPAL_CLIENT_ID: string;
  PAYPAL_CLIENT_SECRET: string;
  /** "live" or "sandbox". Anything other than "live" uses the sandbox. */
  PAYPAL_ENV?: string;
}

export { getProduct, isPurchasable, products };

export function json(data: unknown, status = 200, headers: HeadersInit = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", ...headers },
  });
}

export function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

export function toCents(dollars: number) {
  return Math.round(dollars * 100);
}

/** 1250 -> "12.50" (PayPal wants decimal strings). */
export function money(cents: number) {
  return (cents / 100).toFixed(2);
}

export function shippingCentsFor(subtotalCents: number) {
  return subtotalCents >= toCents(FREE_SHIPPING_THRESHOLD) ? 0 : toCents(SHIPPING_FLAT_RATE);
}

/** SQL fragment: units of ?1 (slug) held by paid orders and unexpired pending orders. ?2 = now. */
const RESERVED_SQL = `
  SELECT COALESCE(SUM(oi.quantity), 0)
  FROM order_items oi JOIN orders o ON o.id = oi.order_id
  WHERE oi.slug = ?1 AND (o.status = 'paid' OR (o.status = 'pending' AND o.expires_at > ?2))`;

export async function availableStock(db: D1Database, slug: string): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COALESCE((SELECT quantity_total FROM inventory WHERE slug = ?1), 0) - (${RESERVED_SQL}) AS available`
    )
    .bind(slug, nowSeconds())
    .first<{ available: number }>();
  return Math.max(0, row?.available ?? 0);
}

/**
 * Inserts an order line only if enough stock is free at that instant.
 * D1 runs statements one at a time, so the check and insert cannot be split by another order.
 */
export function reserveItemStatement(
  db: D1Database,
  orderId: string,
  slug: string,
  quantity: number,
  unitPriceCents: number
) {
  return db
    .prepare(
      `INSERT INTO order_items (order_id, slug, quantity, unit_price_cents)
       SELECT ?3, ?1, ?4, ?5
       WHERE COALESCE((SELECT quantity_total FROM inventory WHERE slug = ?1), 0) - (${RESERVED_SQL}) >= ?4`
    )
    .bind(slug, nowSeconds(), orderId, quantity, unitPriceCents);
}

export function newOrderNumber() {
  // 8 chars from an unambiguous alphabet (no 0/O/1/I).
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return "RP-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shipping destinations we refuse before charging (live animals, continental US only). */
export const NON_CONTINENTAL_STATES = new Set(["AK", "HI", "PR", "GU", "VI", "AS", "MP", "AA", "AE", "AP"]);
export function looksLikePoBox(line: string) {
  return /\b(p\.?\s*o\.?\s*box|post\s+office\s+box)\b/i.test(line);
}

// ---------- PayPal Orders v2 (REST over fetch) ----------

function paypalBase(env: Env) {
  return env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";
}

let cachedToken: { value: string; expires: number; key: string } | null = null;

async function paypalToken(env: Env) {
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET) throw new Error("PayPal credentials are not configured");
  const key = `${env.PAYPAL_ENV}:${env.PAYPAL_CLIENT_ID}`;
  if (cachedToken && cachedToken.key === key && cachedToken.expires > Date.now() + 60_000) return cachedToken.value;
  const res = await fetch(`${paypalBase(env)}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      authorization: `Basic ${btoa(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`)}`,
      "content-type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number; error_description?: string };
  if (!res.ok || !data.access_token) throw new Error(`PayPal auth ${res.status}: ${data.error_description ?? "failed"}`);
  cachedToken = { value: data.access_token, expires: Date.now() + (data.expires_in ?? 300) * 1000, key };
  return data.access_token;
}

export class PayPalError extends Error {
  constructor(
    public status: number,
    public body: { name?: string; message?: string; details?: { issue?: string; description?: string }[] }
  ) {
    super(`PayPal ${status}: ${body.details?.[0]?.issue ?? body.name ?? "error"} ${body.message ?? ""}`.trim());
  }
  get issue() {
    return this.body.details?.[0]?.issue ?? this.body.name ?? "";
  }
}

export async function paypal<T = Record<string, unknown>>(
  env: Env,
  method: "GET" | "POST",
  path: string,
  body?: unknown,
  requestId?: string
): Promise<T> {
  const headers: Record<string, string> = {
    authorization: `Bearer ${await paypalToken(env)}`,
    "content-type": "application/json",
    prefer: "return=representation",
  };
  if (requestId) headers["paypal-request-id"] = requestId;
  const res = await fetch(`${paypalBase(env)}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as T;
  if (!res.ok) throw new PayPalError(res.status, data as PayPalError["body"]);
  return data;
}

export interface PayPalAddress {
  address_line_1?: string;
  address_line_2?: string;
  admin_area_2?: string; // city
  admin_area_1?: string; // state
  postal_code?: string;
  country_code?: string;
}

export interface PayPalOrder {
  id: string;
  status: "CREATED" | "SAVED" | "APPROVED" | "VOIDED" | "COMPLETED" | "PAYER_ACTION_REQUIRED";
  payer?: { email_address?: string; name?: { given_name?: string; surname?: string }; phone?: { phone_number?: { national_number?: string } } };
  purchase_units?: {
    custom_id?: string;
    shipping?: { name?: { full_name?: string }; address?: PayPalAddress };
    payments?: { captures?: { id: string; status: string; amount: { value: string; currency_code: string } }[] };
  }[];
}
