"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/lib/products";

export default function AddToCartPanel({ product }: { product: Product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  function handleAdd() {
    addItem(product.slug, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  }

  if (!product.inStock) {
    return (
      <div className="rounded-xl border border-blush/30 bg-blush/10 px-4 py-3 text-sm font-medium text-blush-dark">
        Currently sold out — join our{" "}
        <a href="/contact" className="underline">
          waitlist
        </a>{" "}
        to be notified when this species is back in stock.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center rounded-full border border-bark/20 dark:border-cream-dark/30">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-4 py-2 text-lg text-bark dark:text-cream"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="min-w-[2ch] text-center text-sm font-semibold text-bark dark:text-cream">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
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
        {justAdded ? "Added to cart ✓" : `Add to Cart — $${(product.price * quantity).toFixed(2)}`}
      </button>
      <button
        type="button"
        onClick={() => {
          addItem(product.slug, quantity);
          router.push("/cart");
        }}
        className="rounded-full border border-moss px-6 py-3 text-sm font-semibold text-moss transition hover:bg-moss hover:text-white"
      >
        Buy Now
      </button>
    </div>
  );
}
