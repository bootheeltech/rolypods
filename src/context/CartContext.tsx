"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { isPurchasable, products } from "@/lib/products";

export interface CartItem {
  slug: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (slug: string, quantity?: number) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "rolypods-cart";
const EMPTY_ITEMS: CartItem[] = [];

// The cart's source of truth is localStorage itself; React only subscribes
// to it via useSyncExternalStore, so reads/writes never call setState from
// inside an effect (disallowed by the react-hooks/set-state-in-effect rule).
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cachedItems: CartItem[] = EMPTY_ITEMS;

function readItems(): CartItem[] {
  if (typeof window === "undefined") return EMPTY_ITEMS;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedItems;
  cachedRaw = raw;
  try {
    // Drop anything that is no longer sellable (e.g. carts saved before a species went waitlist-only).
    const parsed: CartItem[] = raw ? JSON.parse(raw) : EMPTY_ITEMS;
    cachedItems = parsed.filter((i) => isPurchasable(i.slug) && i.quantity > 0);
  } catch {
    cachedItems = EMPTY_ITEMS;
  }
  return cachedItems;
}

function writeItems(next: CartItem[]) {
  cachedItems = next;
  cachedRaw = JSON.stringify(next);
  window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getServerSnapshot() {
  return EMPTY_ITEMS;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, readItems, getServerSnapshot);

  const addItem = useCallback((slug: string, quantity = 1) => {
    const current = readItems();
    const existing = current.find((i) => i.slug === slug);
    const next = existing
      ? current.map((i) =>
          i.slug === slug ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...current, { slug, quantity }];
    writeItems(next);
  }, []);

  const removeItem = useCallback((slug: string) => {
    writeItems(readItems().filter((i) => i.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    const current = readItems();
    const next =
      quantity <= 0
        ? current.filter((i) => i.slug !== slug)
        : current.map((i) => (i.slug === slug ? { ...i, quantity } : i));
    writeItems(next);
  }, []);

  const clearCart = useCallback(() => writeItems(EMPTY_ITEMS), []);

  const totalCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce((sum, i) => {
        const product = products.find((p) => p.slug === i.slug);
        return sum + (product ? product.price * i.quantity : 0);
      }, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQuantity, clearCart, totalCount, subtotal }),
    [items, addItem, removeItem, setQuantity, clearCart, totalCount, subtotal]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
