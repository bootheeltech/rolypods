// Shared helpers for the Cloudflare Pages Functions in /functions.
// Prices always come from src/lib/products.ts on the server; the browser only sends slugs and quantities.

import { getProduct, isPurchasable, products } from "../src/lib/products";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "../src/lib/shipping";

export interface Env {
  DB: D1Database;
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  SITE_URL: string;
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

export function shippingCentsFor(subtotalCents: number) {
  return subtotalCents >= toCents(FREE_SHIPPING_THRESHOLD) ? 0 : toCents(SHIPPING_FLAT_RATE);
}

/** SQL fragment: units of ?slug held by paid orders and unexpired pending orders. Binds: slug, now. */
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

// ---------- Stripe (REST over fetch; no SDK needed on Workers) ----------

type FormValue = string | number | boolean | undefined | null | FormObject | FormValue[];
interface FormObject {
  [key: string]: FormValue;
}

/** Encodes nested objects the way Stripe expects: a[b][0][c]=v */
export function stripeForm(obj: FormObject, prefix = "", out = new URLSearchParams()) {
  for (const [key, value] of Object.entries(obj)) {
    const name = prefix ? `${prefix}[${key}]` : key;
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (v !== null && typeof v === "object") stripeForm(v as FormObject, `${name}[${i}]`, out);
        else if (v !== undefined && v !== null) out.append(`${name}[${i}]`, String(v));
      });
    } else if (typeof value === "object") {
      stripeForm(value, name, out);
    } else {
      out.append(name, String(value));
    }
  }
  return out;
}

export async function stripe<T = Record<string, unknown>>(
  env: Env,
  method: "GET" | "POST",
  path: string,
  body?: FormObject,
  idempotencyKey?: string
): Promise<T> {
  if (!env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not configured");
  const headers: Record<string, string> = {
    authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
    "stripe-version": "2025-03-31.basil",
  };
  if (body) headers["content-type"] = "application/x-www-form-urlencoded";
  if (idempotencyKey) headers["idempotency-key"] = idempotencyKey;
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers,
    body: body ? stripeForm(body).toString() : undefined,
  });
  const data = (await res.json()) as T & { error?: { message?: string } };
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${data.error?.message ?? "unknown error"}`);
  return data;
}

export interface StripeCheckoutSession {
  id: string;
  url: string | null;
  status: "open" | "complete" | "expired";
  payment_status: "paid" | "unpaid" | "no_payment_required";
  client_reference_id: string | null;
  payment_intent: string | null;
  amount_total: number | null;
  customer_details: {
    email: string | null;
    name: string | null;
    phone: string | null;
    address: Record<string, string | null> | null;
  } | null;
  collected_information?: {
    shipping_details?: { name: string; address: Record<string, string | null> } | null;
  } | null;
  shipping_details?: { name: string; address: Record<string, string | null> } | null;
}

/** Marks an order paid from a completed Checkout Session. Safe to call more than once. */
export async function markOrderPaid(db: D1Database, session: StripeCheckoutSession) {
  if (session.payment_status !== "paid" || !session.client_reference_id) return false;
  const shipping = session.collected_information?.shipping_details ?? session.shipping_details ?? null;
  const result = await db
    .prepare(
      `UPDATE orders SET
         status = 'paid', paid_at = datetime('now'),
         stripe_payment_intent = ?2, email = ?3, customer_name = ?4, phone = ?5,
         shipping_name = ?6, shipping_address = ?7, total_cents = ?8
       WHERE id = ?1 AND status != 'paid'`
    )
    .bind(
      session.client_reference_id,
      session.payment_intent,
      session.customer_details?.email ?? null,
      session.customer_details?.name ?? null,
      session.customer_details?.phone ?? null,
      shipping?.name ?? null,
      shipping ? JSON.stringify(shipping.address) : null,
      session.amount_total
    )
    .run();
  return result.meta.changes > 0;
}

// ---------- Webhook signature (Stripe-Signature: t=...,v1=...) ----------

export async function verifyStripeSignature(payload: string, header: string | null, secret: string) {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(
    header.split(",").map((kv) => {
      const i = kv.indexOf("=");
      return [kv.slice(0, i), kv.slice(i + 1)];
    })
  );
  const signatures = header
    .split(",")
    .filter((kv) => kv.startsWith("v1="))
    .map((kv) => kv.slice(3));
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(nowSeconds() - timestamp) > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = Array.from(new Uint8Array(mac), (b) => b.toString(16).padStart(2, "0")).join("");
  return signatures.some((sig) => timingSafeEqual(sig, expected));
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
