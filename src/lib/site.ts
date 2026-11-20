import { products, type Product } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/shipping";

export const SITE_URL = "https://rolypods.com";
export const SITE_NAME = "RolyPods";
export const SITE_TAGLINE = "Only for Fans of Isopods.";
export const SUPPORT_EMAIL = "support@rolypods.com";
export const SITE_DESCRIPTION =
  "Live, captive-bred isopods from a small US breeder, shipped in insulated boxes across the continental US with a live arrival guarantee. Waitlists are open for Dairy Cow isopods (Porcellio laevis), Montenegro, Rubber Ducky, Zebra and more.";

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}

export function productUrl(p: Product) {
  return absoluteUrl(`/shop/${p.slug}`);
}

export function productImageUrl(p: Product) {
  return absoluteUrl(`/shop/${p.slug}/opengraph-image`);
}

/** Shared Q&A used on the shipping page, in JSON-LD, and in llms.txt. */
export const SHIPPING_FAQS: { q: string; a: string }[] = [
  {
    q: "Where does RolyPods ship?",
    a: "We ship live isopods to addresses in the continental United States only. We do not ship to Alaska, Hawaii, Puerto Rico, PO boxes, or outside the US.",
  },
  {
    q: "How much is shipping?",
    a: `Shipping is a flat $${SHIPPING_FLAT_RATE.toFixed(2)} per order in an insulated box by USPS Priority Mail, and free on orders of $${FREE_SHIPPING_THRESHOLD} or more.`,
  },
  {
    q: "What days do you ship?",
    a: "Orders ship Monday through Wednesday only so they never sit in a mail facility over a weekend. You get a tracking number by email when your box goes out.",
  },
  {
    q: "Do you ship in cold or hot weather?",
    a: "Yes, with heat packs in winter and cold packs in summer. If temperatures along the route are forecast below 35°F or above 90°F, we hold the order and email you a new ship date.",
  },
  {
    q: "What is the live arrival guarantee?",
    a: `If any isopods arrive dead, email photos to ${SUPPORT_EMAIL} within 4 hours of delivery with your order number and we will replace them or refund them, your choice.`,
  },
  {
    q: "Can I return isopods?",
    a: "Because they are live animals, isopods cannot be returned. Problems on arrival are covered by the live arrival guarantee.",
  },
];

export function inStockProducts() {
  return products.filter((p) => p.inStock);
}
