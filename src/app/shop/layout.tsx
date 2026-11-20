import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Isopods for Sale: Shop Live Isopods", template: "%s | RolyPods" },
  description:
    "Live, captive-bred isopods from RolyPods, shipped across the continental US with a live arrival guarantee. Join the waitlist for Dairy Cow (Porcellio laevis), Montenegro, Rubber Ducky, Zebra, Powder Blue and more.",
  alternates: { canonical: "/shop" },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
