import Link from "next/link";
import IsopodIllustration from "./IsopodIllustration";
import type { Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-bark/10 bg-white/60 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-cream-dark/10 dark:bg-cream-dark/5"
    >
      <div className="relative aspect-square overflow-hidden bg-cream-dark">
        <IsopodIllustration
          colors={product.colors}
          pattern={product.pattern}
          className="h-full w-full transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-bark/85 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream">
          {product.category === "designer" ? "Designer" : "Common"}
        </span>
        {!product.inStock && (
          <span className="absolute right-3 top-3 rounded-full bg-blush px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-serif text-lg font-semibold text-bark dark:text-cream">
          {product.name}
        </h3>
        <p className="text-xs italic text-bark/60 dark:text-cream-dark/70">
          {product.scientificName}
        </p>
        <p className="mt-1 line-clamp-2 text-sm text-bark/70 dark:text-cream-dark/80">
          {product.tagline}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-moss dark:text-moss">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-sm text-bark/60 dark:text-cream-dark/60">
            {product.unit}
          </span>
        </div>
      </div>
    </Link>
  );
}
