import { photoSrc, type Product } from "@/lib/products";
import IsopodIllustration from "./IsopodIllustration";

/** First real photo of a product if it has one, otherwise the drawn illustration. */
export default function ProductImage({
  product,
  className = "",
  size = "sm",
  priority = false,
}: {
  product: Product;
  className?: string;
  size?: "sm" | "lg";
  priority?: boolean;
}) {
  const photo = product.photos?.[0];
  if (!photo) {
    return <IsopodIllustration colors={product.colors} pattern={product.pattern} className={className} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-sized by scripts/import-photos.mjs
    <img
      src={photoSrc(photo.file, size)}
      alt={photo.alt}
      width={size === "sm" ? 640 : 1600}
      height={size === "sm" ? 640 : 1600}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={`aspect-square object-cover ${className}`}
    />
  );
}
