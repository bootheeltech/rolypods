import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: absoluteUrl("/"), lastModified, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/shop"), lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({
      url: absoluteUrl(`/shop/${p.slug}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: p.inStock ? 0.9 : 0.6,
    })),
    { url: absoluteUrl("/care"), lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/shipping"), lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about"), lastModified, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/contact"), lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
