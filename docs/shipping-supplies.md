# Day-one shipping supplies: RolyPods launch

Goal: be able to pack and ship every order from the first 100 Dairy Cows within the first week, in November weather.

**Planning assumption:** orders average 5 to 10 isopods, so 100 isopods is roughly **10 to 20 shipments**. Buy for **25** so you have spares for replacements (live arrival claims) and mistakes. Prices are rough retail ranges; shop around (Amazon, Uline, Josh's Frogs supply, Pirate Ship for labels).

## 1. Must have before the first order

| Item | Qty for launch | Approx. cost | Notes |
|---|---|---|---|
| 8 oz deli cups with lids | 50 | $12-18 | Poke 6-10 pin holes in the lid (or buy pre-vented). One cup per order; use a 16 oz cup for 20+ isopods. |
| Long-fiber sphagnum moss | 1 bag | $12-15 | Dampen and wring out until barely moist. This is their humidity and cushioning in transit. |
| Leaf litter and a small piece of bark | from your colony | $0 | A pinch per cup gives them something to grip and hide under. No food is needed in transit. |
| Insulated shipping boxes (about 8x6x6, foam-lined) | 25 | $4-7 each | Foam-walled "insulated shipper" kits or a cardboard box with a foam or reflective bubble liner. Small is better: less air to heat. |
| Heat packs, 40-hour (UniHeat or similar shipping warmers) | 30-50 | $1.25-2 each | Essential for November through March. Keep sealed until use. Buy 72-hour packs if you ship to far zones. |
| Packing fill (crinkle paper, newspaper, or peanuts) | 1 bag | $10 | Fill the box so the cup can't shift. |
| Packing tape and tape gun | 1 | $15 | |
| "Live Animals" and "This Side Up / Protect from Heat and Cold" stickers | 1 roll | $8-12 | Not required by USPS for invertebrates, but helps handlers. A marker works in a pinch. |
| Postal scale | 1 | $20-30 | Needed for accurate labels. |
| Pirate Ship account | free | $0 | Commercial USPS Priority Mail rates, free pickup scheduling, tracking emails. Connect it to support@rolypods.com. |
| Printer paper and clear tape, **or** a 4x6 thermal label printer + labels | 1 | $0 or $130-200 + $20 | Paper works for launch. A thermal printer is worth it once you're shipping weekly. |

**Estimated day-one spend: about $175 to $275** without a thermal printer, $325 to $475 with one.

## 2. Nice to have

| Item | Approx. cost | Why |
|---|---|---|
| Printed care card / thank-you insert | $15-25 for 100 (or print at home) | Short Dairy Cow care basics plus "open within 1 hour, email photos within 4 hours if anything's wrong" and the support email. Cuts support emails. |
| Cold packs (phase-change "22°C" packs, not ice) | $1-2 each | Not needed until spring/summer. Plain ice packs freeze isopods; don't use them. |
| Soft paintbrush and a plastic spoon | $5 | Moving isopods without crushing them. |
| Sorting tubs (shoebox size) | $10-20 | Hold counted orders before packing day. |
| Indoor/outdoor thermometer, or a weather app with route forecasts | $0-15 | For the 35°F / 90°F weather-hold rule. |

## 3. How to pack a winter order

1. Count isopods into a vented deli cup with damp sphagnum and a pinch of leaf litter. Common hobby practice is to add 1 or 2 extras per order as a buffer; if you do that, remember it eats into the 100.
2. Put the cup in the insulated box, surround it with fill so it can't move.
3. Activate the heat pack, wait a few minutes, and tape it to the **inside of the lid**, never touching the cup. Put a layer of paper between the pack and the cup side.
4. Don't seal the foam lid airtight: heat packs need a little oxygen to keep working. Leave the foam lid resting in place and close the outer cardboard box normally.
5. Label "Live Animals", print the Priority Mail label from Pirate Ship, and ship **Monday to Wednesday** only.
6. Mark the order shipped with the tracking number (command in `docs/claude-project.md`) and email the customer.

## 4. Check the math on shipping

Your site charges **$12.50** flat (free over $75). Real cost per box is roughly:

| | Low | High |
|---|---|---|
| USPS Priority Mail label, small box, ~1 lb (Pirate Ship commercial rate, varies by zone) | $8 | $14 |
| Insulated box | $4 | $7 |
| Heat pack | $1.25 | $2 |
| Cup, moss, fill, tape | $1 | $1.50 |
| **Total** | **$14.25** | **$24.50** |

That means you likely **lose $2 to $12 on every shipped order**, and much more on free-shipping orders over $75. Before launch, consider raising shipping to about $15.99 (or $14.99 plus a "winter heat pack" line) and moving the free-shipping threshold to $100. Both values live in `src/lib/shipping.ts`; changing them updates the cart, checkout, Stripe, and structured data together.

## 5. Rules and paperwork

- **USPS mailability:** isopods qualify under Publication 52 section 526.6 (small, harmless, cold-blooded animals and nonpoisonous insects). They must arrive in good condition within normal transit time, need no food, water, or attention in transit, and not leak or smell. Packaging must meet section 522.
- **Sales tax:** Missouri sales tax applies to in-state retail sales. Talk to your accountant about registering with the Missouri DOR and whether to turn on Stripe Tax before your first Missouri order. Checkout does not currently collect tax.
- **Stripe:** finish account verification (business details, bank account) **before** launch day so payouts aren't held. Describe the business plainly as "captive-bred live isopods (pet invertebrates)".
- **Address limits:** Stripe can only restrict to "US", so someone could still enter an Alaska, Hawaii, or PO box address. Check every order's address before packing and refund any you can't ship.
