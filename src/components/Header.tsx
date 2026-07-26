"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  { href: "/shop", label: "Shop" },
  { href: "/care", label: "Care Guide" },
  { href: "/shipping", label: "Shipping & Guarantee" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const { totalCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-bark/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80 dark:bg-background/95">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex flex-col leading-tight">
          <span className="font-serif text-2xl font-bold tracking-tight text-bark dark:text-cream">
            RolyPods<span className="text-blush">.</span>
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-moss dark:text-cream-dark">
            only for fans of isopods.
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-bark/80 transition hover:text-blush dark:text-cream-dark dark:hover:text-blush"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full border border-bark/15 px-3 py-2 text-sm font-medium text-bark transition hover:border-moss hover:text-moss dark:border-cream-dark/30 dark:text-cream"
          >
            <span aria-hidden>🛒</span>
            <span className="hidden sm:inline">Cart</span>
            {totalCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-blush text-xs font-bold text-white">
                {totalCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-md border border-bark/15 p-2 text-bark md:hidden dark:border-cream-dark/30 dark:text-cream"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span aria-hidden>{menuOpen ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-bark/10 px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-bark hover:bg-cream-dark dark:text-cream dark:hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
