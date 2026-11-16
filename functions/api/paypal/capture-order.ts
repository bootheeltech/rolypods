// POST /api/paypal/capture-order { orderId } -> called after the buyer approves in the PayPal popup.
// Checks the reservation and the shipping address BEFORE charging, then captures and marks the order paid.
import {
  json,
  looksLikePoBox,
  NON_CONTINENTAL_STATES,
  paypal,
  PayPalError,
  nowSeconds,
  type Env,
  type PayPalOrder,
} from "../../../server/lib";

interface OrderRow {
  id: string;
  order_number: string;
  status: string;
  paypal_order_id: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  expires_at: number;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let body: { orderId?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  const db = env.DB;
  const order = await db
    .prepare(
      "SELECT id, order_number, status, paypal_order_id, subtotal_cents, shipping_cents, expires_at FROM orders WHERE id = ?1"
    )
    .bind(String(body.orderId ?? ""))
    .first<OrderRow>();
  if (!order || !order.paypal_order_id) return json({ error: "Order not found." }, 404);
  if (order.status === "paid") return json({ orderId: order.id, orderNumber: order.order_number, status: "paid" });

  const release = (reason: string, status = 409) =>
    db
      .prepare("UPDATE orders SET status = 'canceled', notes = ?2 WHERE id = ?1 AND status = 'pending'")
      .bind(order.id, reason)
      .run()
      .then(() => json({ error: reason }, status));

  if (order.status !== "pending" || order.expires_at < nowSeconds()) {
    return release("Your checkout timed out and the isopods were released. Please start checkout again.");
  }

  try {
    // 1) Look at the approved order's ship-to address before taking money.
    const approved = await paypal<PayPalOrder>(env, "GET", `/v2/checkout/orders/${order.paypal_order_id}`);
    if (approved.status !== "APPROVED") {
      // Buyer hasn't finished in PayPal yet; keep the hold so they can still complete it.
      return json({ error: "PayPal hasn't approved this payment yet. You have not been charged." }, 409);
    }
    const addr = approved.purchase_units?.[0]?.shipping?.address;
    if (!addr || addr.country_code !== "US" || NON_CONTINENTAL_STATES.has((addr.admin_area_1 ?? "").toUpperCase())) {
      return release(
        "We can only ship live isopods to the continental US (not Alaska, Hawaii, or US territories). You have not been charged."
      );
    }
    if (looksLikePoBox(`${addr.address_line_1 ?? ""} ${addr.address_line_2 ?? ""}`)) {
      return release("Live animals can't go to a PO box. Please use a street address. You have not been charged.");
    }

    // 2) Charge.
    const captured = await paypal<PayPalOrder>(
      env,
      "POST",
      `/v2/checkout/orders/${order.paypal_order_id}/capture`,
      {},
      `capture-${order.id}`
    );
    const unit = captured.purchase_units?.[0];
    const capture = unit?.payments?.captures?.[0];
    if (captured.status !== "COMPLETED" || !capture || !["COMPLETED", "PENDING"].includes(capture.status)) {
      return json({ error: "PayPal didn't complete the payment. You have not been charged." }, 402);
    }

    const shipping = unit?.shipping ?? approved.purchase_units?.[0]?.shipping;
    const payerName = [captured.payer?.name?.given_name, captured.payer?.name?.surname].filter(Boolean).join(" ");
    const totalCents = Math.round(Number(capture.amount.value) * 100);
    const expectedCents = order.subtotal_cents + order.shipping_cents;

    await db
      .prepare(
        `UPDATE orders SET
           status = 'paid', paid_at = datetime('now'), paypal_capture_id = ?2,
           email = ?3, customer_name = ?4, phone = ?5,
           shipping_name = ?6, shipping_address = ?7, total_cents = ?8, notes = ?9
         WHERE id = ?1`
      )
      .bind(
        order.id,
        capture.id,
        captured.payer?.email_address ?? null,
        payerName || null,
        captured.payer?.phone?.phone_number?.national_number ?? null,
        shipping?.name?.full_name ?? null,
        shipping?.address ? JSON.stringify(shipping.address) : null,
        totalCents,
        [
          capture.status === "PENDING" ? "PayPal capture PENDING: check PayPal before shipping." : null,
          totalCents !== expectedCents ? `Amount mismatch: expected ${expectedCents} cents.` : null,
        ]
          .filter(Boolean)
          .join(" ") || null
      )
      .run();

    return json({ orderId: order.id, orderNumber: order.order_number, status: "paid" });
  } catch (err) {
    console.error("paypal capture failed", err);
    if (err instanceof PayPalError && err.issue === "INSTRUMENT_DECLINED") {
      // The JS SDK restarts the flow so the buyer can pick another funding source.
      return json({ error: "Your payment method was declined. Please try another one.", restart: true }, 422);
    }
    if (err instanceof PayPalError && err.issue === "ORDER_ALREADY_CAPTURED") {
      return json({ orderId: order.id, orderNumber: order.order_number, status: "paid" });
    }
    return json({ error: "Something went wrong confirming your payment. If you were charged, we'll email you." }, 500);
  }
};
