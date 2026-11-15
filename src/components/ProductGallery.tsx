"use client";

import { useState } from "react";
import { photoSrc, type Product } from "@/lib/products";

/** Main photo with clickable thumbnails. Only used for products that have photos. */
export default function ProductGallery({ photos }: { photos: NonNullable<Product["photos"]> }) {
  const [index, setIndex] = useState(0);
  const current = photos[index];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-bark/10 bg-cream-dark dark:border-cream-dark/10">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export, pre-sized images */}
        <img
          src={photoSrc(current.file)}
          alt={current.alt}
          width={1600}
          height={1600}
          className="aspect-square w-full object-cover"
        />
      </div>
      {photos.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {photos.map((p, i) => (
            <button
              key={p.file}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}: ${p.alt}`}
              aria-pressed={i === index}
              className={`overflow-hidden rounded-xl border-2 transition ${
                i === index ? "border-moss" : "border-transparent opacity-75 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoSrc(p.file, "sm")} alt="" width={640} height={640} loading="lazy" className="aspect-square w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
