// POST /api/checkout/cancel { orderId } -> buyer closed PayPal or hit an error before paying.
// Releases the reserved stock right away instead of waiting for the 30-minute hold to lapse.
import { json, type Env } from "../../../server/lib";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { orderId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  await env.DB.prepare("UPDATE orders SET status = 'canceled' WHERE id = ?1 AND status = 'pending'")
    .bind(String(body.orderId ?? ""))
    .run();
  return json({ ok: true });
};
