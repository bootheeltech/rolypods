// /llms.txt: a plain-text summary of the store for AI assistants and answer engines (llmstxt.org format).
import { priceLabel, products } from "@/lib/products";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_FLAT_RATE } from "@/lib/shipping";
import { absoluteUrl, SHIPPING_FAQS, SITE_DESCRIPTION, SUPPORT_EMAIL } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const available = products.filter((p) => p.inStock);
  const waitlist = products.filter((p) => !p.inStock);
  const productLine = (p: (typeof products)[number]) =>
    `- [${p.name} (${p.scientificName})](${absoluteUrl(`/shop/${p.slug}`)}): ${
      p.inStock ? `${priceLabel(p)}, in stock.` : "waitlist only, not yet for sale."
    } ${p.difficulty}. Adult size ${p.size}, ${p.temperature}, humidity ${p.humidity}. ${p.tagline}`;

  const dairy = products.find((p) => p.slug === "dairy-cow-isopod");

  const body = `# RolyPods

> ${SITE_DESCRIPTION}

RolyPods (rolypods.com) is a small US isopod breeder that sells live, captive-bred isopods online and ships them in insulated boxes by USPS Priority Mail to the continental United States. Every order has a live arrival guarantee. Shipping is $${SHIPPING_FLAT_RATE.toFixed(2)} flat, free over $${FREE_SHIPPING_THRESHOLD}. Orders ship Monday through Wednesday. Payment is through PayPal: a PayPal account, Venmo, or a debit or credit card without a PayPal account. Contact: ${SUPPORT_EMAIL}.

## Available now

${available.map(productLine).join("\n")}

## Coming soon (waitlist)

${waitlist.map(productLine).join("\n")}

## Key pages

- [Shop all isopods](${absoluteUrl("/shop")})
- [Isopod care guide](${absoluteUrl("/care")}): substrate, humidity, temperature, feeding, breeding, cleanup crew use.
- [Shipping and live arrival guarantee](${absoluteUrl("/shipping")})
- [About RolyPods](${absoluteUrl("/about")})
- [Contact](${absoluteUrl("/contact")})
${
  dairy?.faqs
    ? `
## Dairy Cow isopod FAQ

${dairy.faqs.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}
`
    : ""
}
## Shipping FAQ

${SHIPPING_FAQS.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}
`;

  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
