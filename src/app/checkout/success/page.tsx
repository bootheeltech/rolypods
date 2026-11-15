"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/lib/products";
import { fetchStock } from "@/lib/useLiveStock";

interface OrderInfo {
  orderNumber: string;
  status: string;
  email: string | null;
  totalCents: number;
  items: { slug: string; quantity: number; unit_price_cents: number }[];
}

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("order");
    const request = orderId
      ? fetch(`/api/order?id=${encodeURIComponent(orderId)}`, { cache: "no-store" })
      : Promise.reject(new Error("missing session"));
    request
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data: OrderInfo) => {
        setOrder(data);
        if (data.status === "paid") {
          clearCart();
          fetchStock(true);
        }
      })
      .catch(() => setFailed(true));
  }, [clearCart]);

  if (failed) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream">We couldn&apos;t load your order</h1>
        <p className="mt-3 text-bark/70 dark:text-cream-dark/80">
          If you completed payment, your receipt is on its way from PayPal and your order is safe. Questions? Email{" "}
          <a href="mailto:support@rolypods.com" className="underline">
            support@rolypods.com
          </a>
          .
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <p className="text-bark/70 dark:text-cream-dark/80">Confirming your order...</p>
      </div>
    );
  }

  const paid = order.status === "paid";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <span className="text-5xl" aria-hidden>
        🪲
      </span>
      <h1 className="mt-4 font-serif text-3xl font-bold text-bark dark:text-cream">
        {paid ? "Thank you! Your order is confirmed." : "Payment is still processing"}
      </h1>
      <p className="mt-3 text-bark/70 dark:text-cream-dark/80">
        Your order number is <strong className="text-moss">{order.orderNumber}</strong>.
        {paid && order.email && (
          <>
            {" "}
            PayPal is emailing your receipt to <strong>{order.email}</strong>.
          </>
        )}
      </p>

      <ul className="mx-auto mt-6 max-w-sm space-y-2 rounded-xl border border-bark/10 p-4 text-left text-sm dark:border-cream-dark/10">
        {order.items.map((i) => (
          <li key={i.slug} className="flex justify-between">
            <span>
              {getProduct(i.slug)?.name ?? i.slug} × {i.quantity}
            </span>
            <span>${((i.unit_price_cents * i.quantity) / 100).toFixed(2)}</span>
          </li>
        ))}
        <li className="flex justify-between border-t border-bark/10 pt-2 font-semibold dark:border-cream-dark/10">
          <span>Total paid</span>
          <span>${(order.totalCents / 100).toFixed(2)}</span>
        </li>
      </ul>

      <div className="mx-auto mt-6 max-w-lg rounded-xl border border-moss/30 bg-moss/5 p-5 text-left text-sm text-bark/80 dark:bg-moss/10 dark:text-cream-dark/90">
        <p className="font-semibold text-bark dark:text-cream">What happens next</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>We pack your isopods on the next shipping day (Monday through Wednesday).</li>
          <li>You get an email with USPS tracking when the box goes out.</li>
          <li>On delivery day, bring the box inside and open it within an hour.</li>
        </ol>
        <p className="mt-3">
          While you wait, read the{" "}
          <Link href="/shop/dairy-cow-isopod" className="underline">
            Dairy Cow care notes
          </Link>{" "}
          and get their enclosure set up.
        </p>
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-block rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
