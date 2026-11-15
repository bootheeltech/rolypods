// GET /api/order?session_id=cs_... -> order confirmation details for the success page.
// If the webhook has not landed yet, asks Stripe directly so the customer never sees a stale "pending".
import { json, markOrderPaid, stripe, type Env, type StripeCheckoutSession } from "../../server/lib";

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  email: string | null;
  total_cents: number | null;
  subtotal_cents: number;
  shipping_cents: number;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const sessionId = new URL(request.url).searchParams.get("session_id") ?? "";
  if (!sessionId.startsWith("cs_")) return json({ error: "Missing session." }, 400);

  const load = () =>
    env.DB.prepare(
      "SELECT id, order_number, status, email, total_cents, subtotal_cents, shipping_cents FROM orders WHERE stripe_session_id = ?1"
    )
      .bind(sessionId)
      .first<OrderRow>();

  let order = await load();
  if (!order) return json({ error: "Order not found." }, 404);

  if (order.status === "pending") {
    const session = await stripe<StripeCheckoutSession>(env, "GET", `/checkout/sessions/${sessionId}`);
    if (await markOrderPaid(env.DB, session)) order = (await load())!;
  }

  const { results: items } = await env.DB.prepare(
    "SELECT slug, quantity, unit_price_cents FROM order_items WHERE order_id = ?1"
  )
    .bind(order.id)
    .all<{ slug: string; quantity: number; unit_price_cents: number }>();

  return json({
    orderNumber: order.order_number,
    status: order.status,
    email: order.email,
    totalCents: order.total_cents ?? order.subtotal_cents + order.shipping_cents,
    items,
  });
};
