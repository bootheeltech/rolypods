"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getProduct } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD, shippingFor } from "@/lib/shipping";
import { fetchStock, useLiveStock } from "@/lib/useLiveStock";
import ProductImage from "@/components/ProductImage";

export default function CartPage() {
  const { items, setQuantity, removeItem, subtotal } = useCart();
  const stock = useLiveStock();

  // Coming back from Stripe without paying: release the held stock right away.
  useEffect(() => {
    const orderId = new URLSearchParams(window.location.search).get("canceled");
    if (!orderId) return;
    fetch("/api/checkout/cancel", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ orderId }),
    })
      .catch(() => undefined)
      .finally(() => {
        fetchStock(true);
        window.history.replaceState(null, "", "/cart");
      });
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream">
          Your cart is empty
        </h1>
        <p className="mt-3 text-bark/70 dark:text-cream-dark/80">
          Looks like your colony could use some new members.
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

  const shipping = shippingFor(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream">
        Your Cart
      </h1>

      <div className="mt-8 flex flex-col gap-4">
        {items.map((item) => {
          const product = getProduct(item.slug);
          if (!product) return null;
          return (
            <div
              key={item.slug}
              className="flex items-center gap-4 rounded-xl border border-bark/10 p-4 dark:border-cream-dark/10"
            >
              <Link
                href={`/shop/${product.slug}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-dark"
              >
                <ProductImage product={product} className="h-full w-full" />
              </Link>
              <div className="flex-1">
                <Link href={`/shop/${product.slug}`} className="font-serif font-semibold text-bark hover:text-moss dark:text-cream">
                  {product.name}
                </Link>
                <p className="text-xs italic text-bark/50 dark:text-cream-dark/60">
                  {product.scientificName}
                </p>
                <p className="mt-1 text-sm text-bark/70 dark:text-cream-dark/80">
                  ${product.price.toFixed(2)} / {product.unit}
                </p>
              </div>
              <div className="flex items-center rounded-full border border-bark/20 dark:border-cream-dark/30">
                <button
                  type="button"
                  onClick={() => setQuantity(item.slug, item.quantity - 1)}
                  className="px-3 py-1.5 text-bark dark:text-cream"
                  aria-label={`Decrease quantity of ${product.name}`}
                >
                  −
                </button>
                <span className="min-w-[2ch] text-center text-sm font-semibold text-bark dark:text-cream">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(item.slug, Math.min(stock?.[item.slug] ?? product.stockCount, item.quantity + 1))
                  }
                  className="px-3 py-1.5 text-bark dark:text-cream"
                  aria-label={`Increase quantity of ${product.name}`}
                >
                  +
                </button>
              </div>
              <div className="w-20 text-right font-semibold text-bark dark:text-cream">
                ${(product.price * item.quantity).toFixed(2)}
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.slug)}
                className="text-sm text-blush hover:underline"
                aria-label={`Remove ${product.name} from cart`}
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 ml-auto max-w-sm rounded-xl border border-bark/10 p-5 dark:border-cream-dark/10">
        <div className="flex justify-between text-sm text-bark/70 dark:text-cream-dark/80">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex justify-between text-sm text-bark/70 dark:text-cream-dark/80">
          <span>Shipping</span>
          <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
        </div>
        {shipping > 0 && (
          <p className="mt-1 text-xs text-moss">
            Add ${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping.
          </p>
        )}
        <div className="mt-3 flex justify-between border-t border-bark/10 pt-3 font-semibold text-bark dark:border-cream-dark/10 dark:text-cream">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Link
          href="/checkout"
          className="mt-4 block rounded-full bg-moss px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-moss-dark"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
