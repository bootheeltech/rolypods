import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind RolyPods, a small-batch isopod breeding operation shipping common and designer isopods nationwide.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream sm:text-4xl">
        About RolyPods
      </h1>

      <div className="mt-6 space-y-4 text-bark/80 dark:text-cream-dark/90">
        <p>
          RolyPods started the way a lot of isopod addictions do: one tub of
          Dairy Cow isopods for a bioactive terrarium turned into a dozen
          tubs, then a spare room, then a genuine breeding operation. What
          began as a hobby is now a small-batch business dedicated to
          breeding healthy, well-cared-for isopods and getting them safely to
          keepers all over the country.
        </p>
        <p>
          Every isopod we sell is captive-bred in-house. None of our stock
          is wild-collected. We keep colony sizes manageable so we can pay
          close attention to humidity, diet, and genetic diversity, rather
          than mass-producing at the expense of animal welfare.
        </p>
        <p>
          And yes, the name is a little wink. &quot;Only for Fans of
          Isopods.&quot; We figured a hobby this weird deserved branding that
          didn&apos;t take itself too seriously.
        </p>
        <p>
          Whether you&apos;re here for a $6 starter culture of Classic
          Pillbugs or a rare designer morph for your display collection, we
          treat every order, and every isopod, with the same care.
        </p>
      </div>

      <div className="mt-8 rounded-xl border border-bark/10 p-5 dark:border-cream-dark/10">
        <p className="text-bark/80 dark:text-cream-dark/90">
          Questions about a species, an order, or bulk cleanup crew pricing?
          We&apos;d love to hear from you.
        </p>
        <Link
          href="/contact"
          className="mt-3 inline-block rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark"
        >
          Get in touch
        </Link>
      </div>
    </div>
  );
}
