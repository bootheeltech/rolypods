import { getProduct } from "@/lib/products";
import { OG_SIZE, renderOgImage } from "@/lib/ogImage";

export const dynamic = "force-static";
export const alt = "RolyPods: live isopods for sale, shipped across the continental US";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  const dairy = getProduct("dairy-cow-isopod")!;
  return renderOgImage({
    title: "Live isopods, shipped with care",
    subtitle: "Captive-bred Dairy Cow isopods with a live arrival guarantee.",
    badge: "Now shipping: Dairy Cows",
    colors: dairy.colors,
    pattern: dairy.pattern,
    photo: dairy.photos?.[0]?.file,
  });
}
