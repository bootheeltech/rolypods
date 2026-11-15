import { getProduct, products } from "@/lib/products";
import { OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "RolyPods isopod";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug)!;
  return renderOgImage({
    title: p.name,
    subtitle: p.scientificName,
    badge: p.inStock ? `$${p.price.toFixed(2)} ${p.unit} · Shipping now` : "Join the waitlist",
    colors: p.colors,
    pattern: p.pattern,
    photo: p.photos?.[0]?.file,
  });
}
