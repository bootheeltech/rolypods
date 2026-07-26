import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-bark/10 bg-bark text-cream-dark">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl font-bold text-cream">
            RolyPods<span className="text-blush">.</span>
          </p>
          <p className="mt-2 text-sm text-cream-dark/80">
            Ethically bred common &amp; designer isopods, shipped nationwide with
            a live arrival guarantee.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cream">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/shop" className="hover:text-blush">Shop All Species</Link></li>
            <li><Link href="/care" className="hover:text-blush">Care Guide</Link></li>
            <li><Link href="/shipping" className="hover:text-blush">Shipping &amp; Live Arrival Guarantee</Link></li>
            <li><Link href="/about" className="hover:text-blush">About RolyPods</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cream">
            Get in touch
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href="mailto:support@rolypods.com" className="hover:text-blush">
                support@rolypods.com
              </a>
            </li>
            <li><Link href="/contact" className="hover:text-blush">Contact form</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream-dark/10 px-4 py-4 text-center text-xs text-cream-dark/60 sm:px-6">
        © {new Date().getFullYear()} RolyPods. All isopods ship live and legal within the continental US.
      </div>
    </footer>
  );
}
