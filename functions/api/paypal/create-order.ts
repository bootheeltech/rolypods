// POST /api/paypal/create-order { items: [{ slug, quantity }], agreed: true }
// Reserves stock, creates a PayPal order, returns { id (PayPal order id), orderId, orderNumber }.
import {
  availableStock,
  getProduct,
  isPurchasable,
  json,
  money,
  newOrderNumber,
  nowSeconds,
  paypal,
  reserveItemStatement,
  shippingCentsFor,
  toCents,
  type Env,
  type PayPalOrder,
} from "../../../server/lib";

const RESERVATION_SECONDS = 30 * 60;
const MAX_PER_LINE = 1000;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { items?: { slug?: string; quantity?: number }[]; agreed?: boolean };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (body.agreed !== true) {
    return json({ error: "Please accept the live animal shipping agreement." }, 400);
  }

  // Merge duplicates and validate against the server-side catalog.
  const merged = new Map<string, number>();
  for (const item of body.items ?? []) {
    const slug = String(item.slug ?? "");
    const qty = Math.floor(Number(item.quantity));
    if (!slug || !Number.isFinite(qty) || qty < 1 || qty > MAX_PER_LINE) {
      return json({ error: "Invalid cart item." }, 400);
    }
    if (!isPurchasable(slug)) {
      const name = getProduct(slug)?.name ?? "That species";
      return json({ error: `${name} is waitlist only right now. Remove it from your cart to continue.` }, 409);
    }
    merged.set(slug, (merged.get(slug) ?? 0) + qty);
  }
  if (merged.size === 0) return json({ error: "Your cart is empty." }, 400);

  const lines = [...merged].map(([slug, quantity]) => {
    const product = getProduct(slug)!;
    return { slug, quantity, product, unitCents: toCents(product.price) };
  });
  const subtotalCents = lines.reduce((sum, l) => sum + l.unitCents * l.quantity, 0);
  const shippingCents = shippingCentsFor(subtotalCents);
  const totalCents = subtotalCents + shippingCents;

  const orderId = crypto.randomUUID();
  const orderNumber = newOrderNumber();
  const db = env.DB;

  // 1) Order row + conditional stock reservations, in one transaction.
  const results = await db.batch([
    db
      .prepare(
        `INSERT INTO orders (id, order_number, status, payment_provider, subtotal_cents, shipping_cents, agreed_live_animal_terms_at, expires_at)
         VALUES (?1, ?2, 'pending', 'paypal', ?3, ?4, datetime('now'), ?5)`
      )
      .bind(orderId, orderNumber, subtotalCents, shippingCents, nowSeconds() + RESERVATION_SECONDS),
    ...lines.map((l) => reserveItemStatement(db, orderId, l.slug, l.quantity, l.unitCents)),
  ]);
  const shortLine = lines.find((_, i) => results[i + 1].meta.changes === 0);
  if (shortLine) {
    await db.prepare("UPDATE orders SET status = 'canceled' WHERE id = ?1").bind(orderId).run();
    const left = await availableStock(db, shortLine.slug);
    return json(
      {
        error:
          left > 0
            ? `Only ${left} ${shortLine.product.name}${left === 1 ? "" : "s"} left. Lower the quantity and try again.`
            : `${shortLine.product.name}s just sold out. Join the waitlist and we'll email you when more are ready.`,
        available: left,
        slug: shortLine.slug,
      },
      409
    );
  }

  // 2) PayPal order. PayPal collects the shipping address (its default for physical goods).
  try {
    const order = await paypal<PayPalOrder>(
      env,
      "POST",
      "/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: "default",
            custom_id: orderId,
            invoice_id: orderNumber,
            description: `RolyPods order ${orderNumber}: live captive-bred isopods`,
            soft_descriptor: "ROLYPODS",
            amount: {
              currency_code: "USD",
              value: money(totalCents),
              breakdown: {
                item_total: { currency_code: "USD", value: money(subtotalCents) },
                shipping: { currency_code: "USD", value: money(shippingCents) },
              },
            },
            items: lines.map((l) => ({
              name: l.product.name,
              description: l.product.scientificName.slice(0, 127),
              sku: l.slug,
              quantity: String(l.quantity),
              category: "PHYSICAL_GOODS",
              unit_amount: { currency_code: "USD", value: money(l.unitCents) },
            })),
          },
        ],
      },
      `create-${orderId}`
    );

    await db.prepare("UPDATE orders SET paypal_order_id = ?2 WHERE id = ?1").bind(orderId, order.id).run();
    return json({ id: order.id, orderId, orderNumber });
  } catch (err) {
    await db.prepare("UPDATE orders SET status = 'canceled' WHERE id = ?1").bind(orderId).run();
    console.error("paypal create-order failed", err);
    // 500, not 502: Cloudflare replaces 502 bodies with its own error page.
    return json({ error: "We couldn't start checkout. Please try again in a minute." }, 500);
  }
};
