"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useLiveStock } from "@/lib/useLiveStock";
import type { Product } from "@/lib/products";
import WaitlistForm from "./WaitlistForm";

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addItem, items } = useCart();
  const router = useRouter();
  const stock = useLiveStock();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  if (!product.inStock) {
    return (
      <WaitlistForm
        slug={product.slug}
        heading="Coming soon"
        blurb={`${product.name}s aren't available yet. Leave your email and you'll be first to know when our colony is ready to ship.`}
      />
    );
  }

  if (stock === null) {
    return <div className="h-12 animate-pulse rounded-full bg-bark/10" aria-label="Checking stock" />;
  }

  const available = stock[product.slug] ?? 0;
  const inCart = items.find((i) => i.slug === product.slug)?.quantity ?? 0;
  const canAdd = Math.max(0, available - inCart);

  if (available === 0) {
    return (
      <WaitlistForm
        slug={product.slug}
        heading="Sold out for now"
        blurb="This batch is gone. Join the waitlist and we'll email you the moment the next group is ready."
      />
    );
  }

  const qty = Math.min(quantity, Math.max(1, canAdd));

  function handleAdd() {
    addItem(product.slug, qty);
    setJustAdded(true);
    setQuantity(1);
    setTimeout(() => setJustAdded(false), 1800);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-moss">
        {available <= 20 ? `Only ${available} left in this batch` : `${available} available, ready to ship`}
        {inCart > 0 && <span className="text-bark/60 dark:text-cream-dark/70"> · {inCart} in your cart</span>}
      </p>
      {canAdd === 0 ? (
        <button
          type="button"
          onClick={() => router.push("/cart")}
          className="w-full rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark"
        >
          You have the rest of this batch in your cart. Go to cart
        </button>
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center justify-center rounded-full border border-bark/20 dark:border-cream-dark/30">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, qty - 1))}
              className="px-4 py-2 text-lg text-bark dark:text-cream"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[2ch] text-center text-sm font-semibold text-bark dark:text-cream">{qty}</span>
            <button
              type="button"
              onClick={() => setQuantity(Math.min(canAdd, qty + 1))}
              className="px-4 py-2 text-lg text-bark dark:text-cream"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark"
          >
            {justAdded ? "Added to cart ✓" : `Add to Cart · $${(product.price * qty).toFixed(2)}`}
          </button>
          <button
            type="button"
            onClick={() => {
              addItem(product.slug, qty);
              router.push("/cart");
            }}
            className="rounded-full border border-moss px-6 py-3 text-sm font-semibold text-moss transition hover:bg-moss hover:text-white"
          >
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}
