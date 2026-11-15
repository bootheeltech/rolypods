import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SHIPPING_FAQS } from "@/lib/site";

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SHIPPING_FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export const metadata: Metadata = {
  title: "Shipping & Live Arrival Guarantee",
  description: "How RolyPods packs and ships live isopods, our weather hold policy, and our live arrival guarantee & DOA claim process.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd data={FAQ_JSONLD} />
      <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream sm:text-4xl">
        Shipping &amp; Live Arrival Guarantee
      </h1>
      <p className="mt-3 text-bark/70 dark:text-cream-dark/80">
        Shipping live animals is a responsibility we take seriously. Here&apos;s
        exactly how we pack, ship, and guarantee every order.
      </p>

      <section className="mt-8">
        <h2 className="font-serif text-xl font-bold text-bark dark:text-cream">
          How we pack orders
        </h2>
        <ul className="mt-3 space-y-2 text-bark/80 dark:text-cream-dark/90">
          <li className="flex gap-2"><span className="text-moss">•</span><span>Isopods travel in breathable deli cups with moist substrate, springtails, and leaf litter for food and cushioning.</span></li>
          <li className="flex gap-2"><span className="text-moss">•</span><span>Cups are secured inside an insulated box with heat or cold packs, sized to the season and your local forecast.</span></li>
          <li className="flex gap-2"><span className="text-moss">•</span><span>Boxes are clearly marked &quot;Live Animals&quot; and shipped Priority or Express to minimize transit time.</span></li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl font-bold text-bark dark:text-cream">
          Shipping schedule & weather holds
        </h2>
        <p className="mt-2 text-bark/80 dark:text-cream-dark/90">
          We ship Monday through Wednesday only, so no order sits in a
          shipping facility over a weekend. Before every shipment, we check
          the forecast for both our location and yours. If temperatures along
          the route are forecast to be below 35°F or above 90°F, we&apos;ll
          hold your order and reach out to reschedule. This is for the
          animals&apos; safety, not a delay we take lightly.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl font-bold text-bark dark:text-cream">
          Delivery-day responsibilities
        </h2>
        <p className="mt-2 text-bark/80 dark:text-cream-dark/90">
          Live animal shipments need to be brought inside promptly. Please
          make sure someone is available to receive the package on its
          scheduled delivery day, or arrange to pick it up from your local
          carrier facility. We are not able to guarantee arrival if a package
          is left sitting in a mailbox or on a porch for an extended period
          in extreme heat or cold.
        </p>
      </section>

      <section className="mt-8 rounded-xl border border-moss/30 bg-moss/5 p-5 dark:bg-moss/10">
        <h2 className="font-serif text-xl font-bold text-bark dark:text-cream">
          Live arrival guarantee
        </h2>
        <p className="mt-2 text-bark/80 dark:text-cream-dark/90">
          Every order is covered by our live arrival guarantee. If any
          isopods arrive deceased, we&apos;ll replace them on your next order
          or issue a refund for the affected animals, your choice.
        </p>
        <p className="mt-3 font-medium text-bark dark:text-cream">
          To file a claim:
        </p>
        <ol className="mt-2 list-decimal space-y-2 pl-5 text-bark/80 dark:text-cream-dark/90">
          <li>Open the package and check it within 1 hour of delivery.</li>
          <li>
            Take clear photos of any deceased animals along with the
            shipping box and packing materials.
          </li>
          <li>
            Email the photos to{" "}
            <a href="mailto:support@rolypods.com" className="underline">
              support@rolypods.com
            </a>{" "}
            within 4 hours of delivery, with your order number.
          </li>
        </ol>
        <p className="mt-3 text-sm text-bark/60 dark:text-cream-dark/70">
          Claims submitted outside this window, or without photo
          documentation, can&apos;t be guaranteed, but reach out anyway and
          we&apos;ll do our best to make it right.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-xl font-bold text-bark dark:text-cream">
          Where we ship
        </h2>
        <p className="mt-2 text-bark/80 dark:text-cream-dark/90">
          We currently ship live isopods within the continental United
          States. If you&apos;re outside the continental US, please{" "}
          <Link href="/contact" className="underline">
            contact us
          </Link>{" "}
          before ordering to confirm we can safely ship to your area.
        </p>
      </section>
      <section className="mt-10">
        <h2 className="font-serif text-xl font-bold text-bark dark:text-cream">Shipping FAQ</h2>
        <dl className="mt-3 space-y-4">
          {SHIPPING_FAQS.map((f) => (
            <div key={f.q}>
              <dt className="font-semibold text-bark dark:text-cream">{f.q}</dt>
              <dd className="mt-1 text-bark/80 dark:text-cream-dark/90">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
