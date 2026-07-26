"use client";

import { useMemo, useState } from "react";
import { products, type Category } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

type Filter = Category | "all";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All Species" },
  { value: "common", label: "Common" },
  { value: "designer", label: "Designer" },
];

export default function ShopPage() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(
    () => products.filter((p) => filter === "all" || p.category === filter),
    [filter]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="max-w-2xl">
        <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream sm:text-4xl">
          The Isopod Gallery
        </h1>
        <p className="mt-3 text-bark/70 dark:text-cream-dark/80">
          Every isopod is captive-bred here at RolyPods and shipped with our
          live arrival guarantee. Tap any species for full care specs, size,
          and temperament before you add it to your colony.
        </p>
      </div>

      <div className="mt-6 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              filter === f.value
                ? "border-moss bg-moss text-white"
                : "border-bark/15 text-bark/70 hover:border-moss hover:text-moss dark:border-cream-dark/20 dark:text-cream-dark/80"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
