// POST /api/checkout/cancel { orderId } -> customer came back from Stripe without paying.
// Expires the Stripe session and releases the reserved stock right away instead of waiting 30 minutes.
import { json, stripe, type Env } from "../../../server/lib";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { orderId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const orderId = String(body.orderId ?? "");
  const order = await env.DB.prepare("SELECT stripe_session_id, status FROM orders WHERE id = ?1")
    .bind(orderId)
    .first<{ stripe_session_id: string | null; status: string }>();
  if (!order || order.status !== "pending") return json({ ok: true });

  if (order.stripe_session_id) {
    try {
      await stripe(env, "POST", `/checkout/sessions/${order.stripe_session_id}/expire`);
    } catch {
      // Already completed or expired on Stripe's side. Leave the order for the webhook to settle.
      return json({ ok: true });
    }
  }
  await env.DB.prepare("UPDATE orders SET status = 'canceled' WHERE id = ?1 AND status = 'pending'").bind(orderId).run();
  return json({ ok: true });
};
