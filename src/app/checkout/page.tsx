"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/lib/products";

const SHIPPING_FLAT_RATE = 12.5;
const FREE_SHIPPING_THRESHOLD = 75;

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const generated = `RP-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(generated);
    setSubmitted(true);
    clearCart();
  }

  if (items.length === 0 && !submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream">
          Nothing to check out yet
        </h1>
        <p className="mt-3 text-bark/70 dark:text-cream-dark/80">
          Add a few isopods to your cart first.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark"
        >
          Browse the Gallery
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <span className="text-5xl">🪲</span>
        <h1 className="mt-4 font-serif text-3xl font-bold text-bark dark:text-cream">
          Order request received!
        </h1>
        <p className="mt-3 text-bark/70 dark:text-cream-dark/80">
          Your order reference is <strong className="text-moss">{orderNumber}</strong>.
          This is a demo checkout — no payment has been charged. We&apos;ll
          follow up by email with an invoice and shipping timeline, or reach
          out any time at{" "}
          <a href="mailto:support@rolypods.com" className="underline">
            support@rolypods.com
          </a>
          .
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream">
        Checkout
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-bark/70 dark:text-cream-dark/80">
        This is a preview checkout — placing an order below will not charge a
        card. It simulates submitting your order request so you can see the
        full flow.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2">
          <fieldset className="space-y-4 rounded-xl border border-bark/10 p-5 dark:border-cream-dark/10">
            <legend className="px-1 font-serif text-lg font-bold text-bark dark:text-cream">
              Contact
            </legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="text-bark/70 dark:text-cream-dark/80">Full name</span>
                <input required type="text" className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30" />
              </label>
              <label className="block text-sm">
                <span className="text-bark/70 dark:text-cream-dark/80">Email</span>
                <input required type="email" className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30" />
              </label>
            </div>
            <label className="block text-sm">
              <span className="text-bark/70 dark:text-cream-dark/80">Phone (for delivery-day contact)</span>
              <input required type="tel" className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30" />
            </label>
          </fieldset>

          <fieldset className="space-y-4 rounded-xl border border-bark/10 p-5 dark:border-cream-dark/10">
            <legend className="px-1 font-serif text-lg font-bold text-bark dark:text-cream">
              Shipping address
            </legend>
            <label className="block text-sm">
              <span className="text-bark/70 dark:text-cream-dark/80">Street address</span>
              <input required type="text" className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30" />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block text-sm">
                <span className="text-bark/70 dark:text-cream-dark/80">City</span>
                <input required type="text" className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30" />
              </label>
              <label className="block text-sm">
                <span className="text-bark/70 dark:text-cream-dark/80">State</span>
                <input required type="text" className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30" />
              </label>
              <label className="block text-sm">
                <span className="text-bark/70 dark:text-cream-dark/80">ZIP code</span>
                <input required type="text" className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30" />
              </label>
            </div>
            <label className="block text-sm">
              <span className="text-bark/70 dark:text-cream-dark/80">Delivery notes (porch instructions, etc.)</span>
              <textarea rows={3} className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30" />
            </label>
          </fieldset>

          <fieldset className="space-y-3 rounded-xl border border-bark/10 p-5 dark:border-cream-dark/10">
            <legend className="px-1 font-serif text-lg font-bold text-bark dark:text-cream">
              Live animal shipping agreement
            </legend>
            <label className="flex items-start gap-2 text-sm text-bark/80 dark:text-cream-dark/90">
              <input
                required
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1"
              />
              <span>
                I confirm I am 18 or older, someone will be available to
                receive this shipment on its delivery day, and I&apos;ve read
                the{" "}
                <Link href="/shipping" className="underline">
                  shipping &amp; live arrival guarantee
                </Link>{" "}
                policy.
              </span>
            </label>
          </fieldset>

          <button
            type="submit"
            disabled={!ageConfirmed}
            className="w-full rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            Place Order — ${total.toFixed(2)}
          </button>
        </form>

        <div className="h-fit rounded-xl border border-bark/10 p-5 dark:border-cream-dark/10">
          <h2 className="font-serif text-lg font-bold text-bark dark:text-cream">
            Order summary
          </h2>
          <ul className="mt-4 space-y-3">
            {items.map((item) => {
              const product = getProduct(item.slug);
              if (!product) return null;
              return (
                <li key={item.slug} className="flex justify-between text-sm">
                  <span className="text-bark/80 dark:text-cream-dark/90">
                    {product.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-bark dark:text-cream">
                    ${(product.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 space-y-1 border-t border-bark/10 pt-3 text-sm dark:border-cream-dark/10">
            <div className="flex justify-between text-bark/70 dark:text-cream-dark/80">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-bark/70 dark:text-cream-dark/80">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between pt-1 font-semibold text-bark dark:text-cream">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
