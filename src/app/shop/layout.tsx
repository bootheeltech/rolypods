import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Isopods for Sale: Shop Live Isopods", template: "%s | RolyPods" },
  description:
    "Shop live, captive-bred isopods. Dairy Cow isopods (Porcellio laevis) ship now across the continental US with a live arrival guarantee; join the waitlist for Montenegro, Rubber Ducky, Zebra, Powder Blue and more.",
  alternates: { canonical: "/shop" },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
