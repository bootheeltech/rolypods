"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/lib/products";
import { shippingFor } from "@/lib/shipping";
import { fetchStock } from "@/lib/useLiveStock";

export default function CheckoutPage() {
  const { items, subtotal, setQuantity } = useCart();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  async function handlePay(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items, agreed }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
        slug?: string;
        available?: number;
      };
      if (!res.ok || !data.url) {
        // Someone bought the last few while this cart sat open: trim the cart to what's left.
        if (res.status === 409 && data.slug && typeof data.available === "number") {
          setQuantity(data.slug, data.available);
          fetchStock(true);
        }
        throw new Error(data.error || "We couldn't start checkout. Please try again.");
      }
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't start checkout. Please try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream">Nothing to check out yet</h1>
        <p className="mt-3 text-bark/70 dark:text-cream-dark/80">Add a few isopods to your cart first.</p>
        {error && <p className="mt-3 text-sm text-blush-dark">{error}</p>}
        <Link
          href="/shop"
          className="mt-6 inline-block rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark"
        >
          Browse the Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream">Checkout</h1>
      <p className="mt-2 max-w-2xl text-sm text-bark/70 dark:text-cream-dark/80">
        You&apos;ll enter your shipping address and payment on the next screen, a secure checkout page hosted
        by Stripe. Cards, Apple Pay, and Google Pay are accepted. Your isopods are held for you for 30
        minutes while you finish.
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <form onSubmit={handlePay} className="space-y-6 lg:col-span-2">
          <fieldset className="space-y-3 rounded-xl border border-bark/10 p-5 dark:border-cream-dark/10">
            <legend className="px-1 font-serif text-lg font-bold text-bark dark:text-cream">
              Before you pay
            </legend>
            <ul className="space-y-2 text-sm text-bark/80 dark:text-cream-dark/90">
              <li className="flex gap-2">
                <span className="text-moss">•</span>
                <span>We ship Monday through Wednesday only, so your isopods never sit in a warehouse over a weekend.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-moss">•</span>
                <span>
                  If it&apos;s below 35°F or above 90°F along the route, we hold your order and email you a new ship
                  date. Heat packs go in every cold-weather box.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-moss">•</span>
                <span>Continental US addresses only. No PO boxes, Alaska, Hawaii, or Puerto Rico.</span>
              </li>
            </ul>
            <label className="flex items-start gap-2 pt-2 text-sm text-bark/80 dark:text-cream-dark/90">
              <input
                required
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1"
              />
              <span>
                I&apos;m 18 or older, someone will be available to bring the box inside on delivery day, and
                I&apos;ve read the{" "}
                <Link href="/shipping" className="underline">
                  shipping &amp; live arrival guarantee
                </Link>{" "}
                policy.
              </span>
            </label>
          </fieldset>

          {error && (
            <p role="alert" className="rounded-xl border border-blush/40 bg-blush/10 px-4 py-3 text-sm text-blush-dark">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!agreed || submitting}
            className="w-full rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? "Opening secure checkout..." : `Continue to secure payment · $${total.toFixed(2)}`}
          </button>
          <p className="text-center text-xs text-bark/50 dark:text-cream-dark/60">
            Payments are processed by Stripe. RolyPods never sees or stores your card number.
          </p>
        </form>

        <div className="h-fit rounded-xl border border-bark/10 p-5 dark:border-cream-dark/10">
          <h2 className="font-serif text-lg font-bold text-bark dark:text-cream">Order summary</h2>
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
              <span>Insulated shipping</span>
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
