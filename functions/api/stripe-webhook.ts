// POST /api/stripe-webhook. Configure in Stripe for: checkout.session.completed, checkout.session.expired.
import { json, markOrderPaid, verifyStripeSignature, type Env, type StripeCheckoutSession } from "../../server/lib";

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const payload = await request.text();
  const valid = await verifyStripeSignature(payload, request.headers.get("stripe-signature"), env.STRIPE_WEBHOOK_SECRET);
  if (!valid) return json({ error: "Invalid signature" }, 400);

  const event = JSON.parse(payload) as { type: string; data: { object: StripeCheckoutSession } };
  const session = event.data.object;

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded":
      await markOrderPaid(env.DB, session);
      break;
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      if (session.client_reference_id) {
        await env.DB.prepare("UPDATE orders SET status = 'expired' WHERE id = ?1 AND status = 'pending'")
          .bind(session.client_reference_id)
          .run();
      }
      break;
  }
  return json({ received: true });
};
