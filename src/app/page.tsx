import Link from "next/link";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";
import WaitlistForm from "@/components/WaitlistForm";

const FEATURED_SLUGS = ["dairy-cow-isopod", "montenegro-isopod", "rubber-ducky-isopod", "zebra-isopod"];

const TRUST_POINTS = [
  { title: "Live Arrival Guarantee", body: "Every isopod arrives alive or we replace/refund it, no questions asked." },
  { title: "Captive Bred In-House", body: "Every colony is bred and raised on-site, never wild-collected." },
  { title: "Careful, Insulated Shipping", body: "Heat/cold packs and weather holds keep your order safe in transit." },
];

export default function Home() {
  const featured = FEATURED_SLUGS
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div>
      <section className="relative overflow-hidden border-b border-bark/10">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-block rounded-full bg-blush/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blush-dark">
              Now shipping: Dairy Cow isopods
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-bark dark:text-cream sm:text-5xl">
              Common &amp; designer isopods,
              <br /> bred with love, shipped with care.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-bark/70 dark:text-cream-dark/80">
              RolyPods is a small-batch isopod breeder shipping across the
              continental US. Our first batch of Dairy Cow isopods is ready
              now, and every order comes with a live arrival guarantee. More
              species are on the way: join the waitlist to hear first.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop/dairy-cow-isopod"
                className="rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark"
              >
                Shop Dairy Cows
              </Link>
              <Link
                href="/care"
                className="rounded-full border border-bark/20 px-6 py-3 text-sm font-semibold text-bark transition hover:border-moss hover:text-moss dark:border-cream-dark/30 dark:text-cream"
              >
                Read the Care Guide
              </Link>
            </div>
          </div>
          <div className="mx-auto grid max-w-sm grid-cols-2 gap-4">
            {featured.slice(0, 4).map((p) => (
              <div
                key={p.slug}
                className="overflow-hidden rounded-2xl border border-bark/10 bg-cream-dark shadow-sm dark:border-cream-dark/10"
              >
                <ProductImage product={p} className="w-full" priority={p.slug === "dairy-cow-isopod"} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          {TRUST_POINTS.map((point) => (
            <div key={point.title} className="rounded-xl border border-bark/10 p-5 dark:border-cream-dark/10">
              <h3 className="font-serif text-lg font-bold text-bark dark:text-cream">
                {point.title}
              </h3>
              <p className="mt-2 text-sm text-bark/70 dark:text-cream-dark/80">
                {point.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-bark dark:text-cream sm:text-3xl">
              The Lineup
            </h2>
            <p className="mt-1 text-bark/70 dark:text-cream-dark/80">
              Dairy Cows ship now. The rest are growing out in our colonies; join a waitlist to be first in line.
            </p>
          </div>
          <Link href="/shop" className="hidden text-sm font-semibold text-moss hover:underline sm:inline">
            View all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
        <div className="mt-6 sm:hidden">
          <Link href="/shop" className="text-sm font-semibold text-moss hover:underline">
            View all species →
          </Link>
        </div>
      </section>

      <section className="border-t border-bark/10 bg-moss/5 dark:bg-moss/10">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-bark dark:text-cream sm:text-3xl">
            Be first when new species drop.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-bark/70 dark:text-cream-dark/80">
            Montenegros, Rubber Duckies, Zebras and more are coming. Leave
            your email and we&apos;ll tell you before anyone else when a new
            batch is ready to ship.
          </p>
          <div className="mx-auto mt-6 max-w-lg text-left">
            <WaitlistForm slug="any" />
          </div>
        </div>
      </section>
    </div>
  );
}
