// GET /api/order?id=<order uuid> -> confirmation details for the success page.
// The uuid is random and only handed to the buyer's browser, so it works as a private link.
import { json, type Env } from "../../server/lib";

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
  const id = new URL(request.url).searchParams.get("id") ?? "";
  if (!/^[0-9a-f-]{36}$/.test(id)) return json({ error: "Missing order." }, 400);

  const order = await env.DB.prepare(
    "SELECT id, order_number, status, email, total_cents, subtotal_cents, shipping_cents FROM orders WHERE id = ?1"
  )
    .bind(id)
    .first<OrderRow>();
  if (!order) return json({ error: "Order not found." }, 404);

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
