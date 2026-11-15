// POST /api/checkout { items: [{ slug, quantity }], agreed: true }
// Reserves stock, creates a Stripe Checkout Session, returns { url } to redirect the customer to.
import {
  availableStock,
  getProduct,
  isPurchasable,
  json,
  newOrderNumber,
  nowSeconds,
  reserveItemStatement,
  shippingCentsFor,
  stripe,
  toCents,
  type Env,
  type StripeCheckoutSession,
} from "../../server/lib";

const STRIPE_SESSION_SECONDS = 31 * 60; // Stripe minimum is 30 minutes.
const RESERVATION_GRACE_SECONDS = 5 * 60; // Hold stock a little past Stripe's expiry so webhooks can land.
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

  const orderId = crypto.randomUUID();
  const orderNumber = newOrderNumber();
  const stripeExpiresAt = nowSeconds() + STRIPE_SESSION_SECONDS;
  const db = env.DB;

  // 1) Order row + conditional stock reservations, in one transaction.
  const results = await db.batch([
    db
      .prepare(
        `INSERT INTO orders (id, order_number, status, subtotal_cents, shipping_cents, agreed_live_animal_terms_at, expires_at)
         VALUES (?1, ?2, 'pending', ?3, ?4, datetime('now'), ?5)`
      )
      .bind(orderId, orderNumber, subtotalCents, shippingCents, stripeExpiresAt + RESERVATION_GRACE_SECONDS),
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

  // 2) Stripe Checkout Session.
  const site = (env.SITE_URL || new URL(request.url).origin).replace(/\/$/, "");
  try {
    const session = await stripe<StripeCheckoutSession>(
      env,
      "POST",
      "/checkout/sessions",
      {
        mode: "payment",
        client_reference_id: orderId,
        expires_at: stripeExpiresAt,
        success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${site}/cart?canceled=${orderId}`,
        payment_method_types: ["card"],
        billing_address_collection: "auto",
        shipping_address_collection: { allowed_countries: ["US"] },
        phone_number_collection: { enabled: true },
        line_items: lines.map((l) => ({
          quantity: l.quantity,
          price_data: {
            currency: "usd",
            unit_amount: l.unitCents,
            product_data: {
              name: l.product.name,
              description: `${l.product.scientificName}. Live, captive-bred isopods.`,
            },
          },
        })),
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              display_name:
                shippingCents === 0
                  ? "Free insulated live-animal shipping (USPS Priority)"
                  : "Insulated live-animal shipping (USPS Priority)",
              fixed_amount: { amount: shippingCents, currency: "usd" },
              delivery_estimate: {
                minimum: { unit: "business_day", value: 2 },
                maximum: { unit: "business_day", value: 6 },
              },
            },
          },
        ],
        custom_text: {
          shipping_address: {
            message: "We ship live isopods to the continental US only (no AK, HI, PR, or PO boxes).",
          },
          submit: {
            message:
              "Live animals ship Monday through Wednesday. If weather is unsafe on the route, we hold your order and email you.",
          },
        },
        metadata: { order_id: orderId, order_number: orderNumber },
        payment_intent_data: {
          description: `RolyPods order ${orderNumber}`,
          metadata: { order_id: orderId, order_number: orderNumber },
        },
      },
      orderId
    );

    await db.prepare("UPDATE orders SET stripe_session_id = ?2 WHERE id = ?1").bind(orderId, session.id).run();
    return json({ url: session.url, orderNumber });
  } catch (err) {
    await db.prepare("UPDATE orders SET status = 'canceled' WHERE id = ?1").bind(orderId).run();
    console.error("checkout session failed", err);
    return json({ error: "We couldn't start checkout. Please try again in a minute." }, 502);
  }
};
