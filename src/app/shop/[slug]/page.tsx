import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct, photoSrc, priceLabel, products, type Product } from "@/lib/products";
import { SHIPPING_FLAT_RATE } from "@/lib/shipping";
import { absoluteUrl, productImageUrl, productUrl, SITE_NAME, SITE_URL } from "@/lib/site";
import JsonLd from "@/components/JsonLd";
import IsopodIllustration from "@/components/IsopodIllustration";
import ProductGallery from "@/components/ProductGallery";
import AddToCartPanel from "@/components/AddToCartPanel";
import ProductCard from "@/components/ProductCard";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  const title = product.inStock
    ? `${product.name}s for Sale (${product.scientificName.split(" '")[0]})`
    : `${product.name} (${product.scientificName}): Join the Waitlist`;
  const description = product.inStock
    ? `Buy live ${product.name}s, ${priceLabel(product)}. ${product.tagline} Captive bred, shipped insulated with a live arrival guarantee.`
    : `${product.tagline} Join the RolyPods waitlist to be emailed when captive-bred ${product.name}s are ready to ship.`;
  return {
    title,
    description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: { type: "website", title, description, url: `/shop/${product.slug}` },
  };
}

function productJsonLd(product: Product) {
  const url = productUrl(product);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name: product.name,
        alternateName: product.scientificName,
        description: product.description,
        image: product.photos?.length
          ? product.photos.map((p) => absoluteUrl(photoSrc(p.file)))
          : productImageUrl(product),
        url,
        sku: product.slug,
        category: "Live Animals > Invertebrates > Isopods",
        brand: { "@type": "Brand", name: SITE_NAME },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Scientific name", value: product.scientificName },
          ...(product.packSize
            ? [{ "@type": "PropertyValue", name: "Isopods per container", value: product.packSize }]
            : []),
          { "@type": "PropertyValue", name: "Difficulty", value: product.difficulty },
          { "@type": "PropertyValue", name: "Adult size", value: product.size },
          { "@type": "PropertyValue", name: "Temperature", value: product.temperature },
          { "@type": "PropertyValue", name: "Humidity", value: product.humidity },
        ],
        offers: {
          "@type": "Offer",
          url,
          priceCurrency: "USD",
          price: product.price.toFixed(2),
          availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@id": `${SITE_URL}/#org` },
          shippingDetails: {
            "@type": "OfferShippingDetails",
            shippingRate: { "@type": "MonetaryAmount", value: SHIPPING_FLAT_RATE.toFixed(2), currency: "USD" },
            shippingDestination: { "@type": "DefinedRegion", addressCountry: "US" },
            deliveryTime: {
              "@type": "ShippingDeliveryTime",
              handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 5, unitCode: "DAY" },
              transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
            },
          },
          hasMerchantReturnPolicy: {
            "@type": "MerchantReturnPolicy",
            applicableCountry: "US",
            returnPolicyCategory: "https://schema.org/MerchantReturnNotPermitted",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Shop", item: absoluteUrl("/shop") },
          { "@type": "ListItem", position: 2, name: product.name, item: url },
        ],
      },
      ...(product.faqs?.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: product.faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
        : []),
    ],
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.inStock) - Number(a.inStock) || Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, 3);

  const specs: [string, string][] = [
    ["Difficulty", product.difficulty],
    ["Adult size", product.size],
    ["Temperature", product.temperature],
    ["Humidity", product.humidity],
    ["Diet", product.diet],
    ["Availability", product.inStock ? "Shipping now" : "Waitlist only"],
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd data={productJsonLd(product)} />
      <nav className="mb-6 text-sm text-bark/60 dark:text-cream-dark/60">
        <Link href="/shop" className="hover:text-moss">Shop</Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        {product.photos?.length ? (
          <ProductGallery photos={product.photos} />
        ) : (
          <div className="h-fit overflow-hidden rounded-2xl border border-bark/10 bg-cream-dark dark:border-cream-dark/10">
            <IsopodIllustration
              colors={product.colors}
              pattern={product.pattern}
              className="w-full"
              label={`Illustration of a ${product.name} (${product.scientificName})`}
            />
          </div>
        )}

        <div>
          <span className="rounded-full bg-bark/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-bark dark:bg-cream-dark/10 dark:text-cream-dark">
            {product.category === "designer" ? "Designer morph" : "Common species"}
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-bark dark:text-cream sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-1 italic text-bark/60 dark:text-cream-dark/70">
            {product.scientificName}
          </p>
          <p className="mt-4 text-lg text-bark/80 dark:text-cream-dark/90">
            {product.tagline}
          </p>

          <div className="mt-5 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-moss">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-sm text-bark/60 dark:text-cream-dark/60">
              / {product.unit}
            </span>
          </div>

          <div className="mt-6">
            <AddToCartPanel product={product} />
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl border border-bark/10 p-4 text-sm dark:border-cream-dark/10">
            {specs.map(([label, value]) => (
              <div key={label}>
                <dt className="text-bark/50 dark:text-cream-dark/50">{label}</dt>
                <dd className="font-medium text-bark dark:text-cream">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="font-serif text-xl font-bold text-bark dark:text-cream">
            About this species
          </h2>
          <p className="mt-3 leading-relaxed text-bark/80 dark:text-cream-dark/90">
            {product.description}
          </p>

          <h2 className="mt-8 font-serif text-xl font-bold text-bark dark:text-cream">
            Care notes
          </h2>
          <ul className="mt-3 space-y-2">
            {product.careNotes.map((note) => (
              <li key={note} className="flex gap-2 text-bark/80 dark:text-cream-dark/90">
                <span className="text-moss">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>

          {product.faqs && product.faqs.length > 0 && (
            <>
              <h2 className="mt-8 font-serif text-xl font-bold text-bark dark:text-cream">
                {product.name} FAQ
              </h2>
              <dl className="mt-3 space-y-4">
                {product.faqs.map((f) => (
                  <div key={f.q}>
                    <dt className="font-semibold text-bark dark:text-cream">{f.q}</dt>
                    <dd className="mt-1 text-bark/80 dark:text-cream-dark/90">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </div>

        <div className="h-fit rounded-xl border border-moss/30 bg-moss/5 p-5 dark:bg-moss/10">
          <h2 className="font-serif text-lg font-bold text-bark dark:text-cream">
            Shipping &amp; live arrival
          </h2>
          <p className="mt-2 text-sm text-bark/80 dark:text-cream-dark/90">
            Every order ships in an insulated box with heat or cold packs as
            needed for your local weather, plus moist substrate and air holes
            for the trip. If anything arrives deceased, we replace it or
            refund it, no questions asked.
          </p>
          <Link
            href="/shipping"
            className="mt-3 inline-block text-sm font-semibold text-moss underline"
          >
            Read our full shipping policy →
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="font-serif text-2xl font-bold text-bark dark:text-cream">
            You might also like
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
