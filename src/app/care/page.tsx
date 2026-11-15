import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Isopod Care Guide: Substrate, Humidity, Feeding & Breeding",
  description: "General isopod care: substrate, humidity, temperature, feeding, and using isopods as a bioactive cleanup crew.",
  alternates: { canonical: "/care" },
};

const SECTIONS = [
  {
    title: "Enclosure & substrate",
    body: [
      "Most isopods do well in a mix of coco fiber or organic topsoil, sphagnum moss, leaf litter, and decaying hardwood (avoid softwoods like pine and cedar; the resins are toxic to isopods). A 2-3 inch substrate depth gives them room to burrow.",
      "A simple starter setup: a plastic tub or glass enclosure with ventilation holes, 2-3 inches of substrate, a layer of leaf litter on top, and a few pieces of cork bark or egg crate for hiding spots.",
    ],
  },
  {
    title: "Humidity & moisture",
    body: [
      "Isopods breathe through gill-like structures and need humidity to survive. Most species want somewhere between 50-85% depending on species (check each product page for specifics).",
      "Keep one side of the enclosure damp and one side drier so isopods can choose their preferred zone. Mist with dechlorinated water every few days, more often for high-humidity species like Cubaris.",
      "Good ventilation matters just as much as humidity. Stagnant, waterlogged substrate breeds mold and mites.",
    ],
  },
  {
    title: "Temperature",
    body: [
      "Room temperature (68-75°F) is fine for most common species. Designer and tropical species often prefer slightly warmer conditions (72-82°F); see individual care specs on each listing.",
      "Avoid placing enclosures near direct sunlight or heat vents, which can dry out or overheat the colony quickly.",
    ],
  },
  {
    title: "Feeding",
    body: [
      "Isopods are detritivores: they eat decaying leaf litter, rotting wood, and other organic matter. Supplement with fish flakes, fish food pellets, or vegetable scraps (carrots, squash) a couple of times a week.",
      "Add a calcium source (crushed cuttlebone, eggshell, or a commercial calcium supplement) to support healthy molting and shell strength, especially for Armadillidium species.",
      "Remove uneaten protein/veggie scraps after a day or two to prevent mold.",
    ],
  },
  {
    title: "Breeding & colony growth",
    body: [
      "Isopods reproduce readily in a stable, well-fed enclosure. Females carry fertilized eggs in a marsupium (brood pouch) and release tiny white 'mancae' (juveniles) after several weeks.",
      "Avoid disturbing the substrate too often. Babies are tiny and easily lost in a stressed-out colony. Patience is the biggest factor in growing a healthy population.",
      "A colony started with 10-20 isopods can realistically grow into the hundreds within 6-12 months under good conditions.",
    ],
  },
  {
    title: "Using isopods as a cleanup crew",
    body: [
      "Isopods are a staple 'cleanup crew' addition to bioactive reptile, amphibian, and invertebrate enclosures. They break down waste, uneaten food, and shed skin, helping keep substrate healthy.",
      "Match species to your main enclosure's climate: drier/warmer terrariums pair well with Porcellio scaber or hoffmannseggi, while humid tropical setups do better with Cubaris or Porcellionides pruinosus.",
      "Introduce a small starter colony a few weeks before adding your main animal so the isopods have time to establish.",
    ],
  },
];

export default function CarePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream sm:text-4xl">
        Isopod Care Guide
      </h1>
      <p className="mt-3 text-bark/70 dark:text-cream-dark/80">
        General care that applies across most species we sell. Each product
        page also lists specific temperature, humidity, and difficulty
        details for that isopod.
      </p>

      <div className="mt-8 space-y-8">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="font-serif text-xl font-bold text-bark dark:text-cream">
              {section.title}
            </h2>
            <div className="mt-2 space-y-3 text-bark/80 dark:text-cream-dark/90">
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
