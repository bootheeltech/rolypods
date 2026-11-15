import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about an isopod order, a species, or bulk cleanup crew pricing? Contact RolyPods at support@rolypods.com.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
