"use client";

import { useEffect, useState } from "react";
import { products } from "@/lib/products";

export type StockMap = Record<string, number>;

// Built-in fallback for `next dev` (no Pages Functions) or if the API is unreachable.
const STATIC_STOCK: StockMap = Object.fromEntries(products.map((p) => [p.slug, p.inStock ? p.stockCount : 0]));

let inflight: Promise<StockMap> | null = null;

export function fetchStock(force = false): Promise<StockMap> {
  if (!inflight || force) {
    inflight = fetch("/api/stock", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((d: { stock: StockMap }) => d.stock)
      .catch(() => STATIC_STOCK);
  }
  return inflight;
}

/** Live remaining stock per slug. null while loading. */
export function useLiveStock(): StockMap | null {
  const [stock, setStock] = useState<StockMap | null>(null);
  useEffect(() => {
    let alive = true;
    fetchStock().then((s) => alive && setStock(s));
    return () => {
      alive = false;
    };
  }, []);
  return stock;
}
