export type Category = "common" | "designer";

export interface Product {
  slug: string;
  name: string;
  scientificName: string;
  category: Category;
  price: number;
  unit: string; // e.g. "each", "group of 5"
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  size: string;
  temperature: string;
  humidity: string;
  diet: string;
  tagline: string;
  description: string;
  careNotes: string[];
  colors: [string, string, string]; // body base, band/pattern, spots — used by the placeholder illustration
  pattern: "plain" | "banded" | "spotted" | "marbled";
  inStock: boolean;
  stockCount: number;
}

export const products: Product[] = [
  {
    slug: "dairy-cow-isopod",
    name: "Dairy Cow Isopod",
    scientificName: "Porcellio scaber 'Dalmatian'",
    category: "common",
    price: 8,
    unit: "each",
    difficulty: "Beginner",
    size: "15-18mm",
    temperature: "65-75°F",
    humidity: "60-70%",
    diet: "Leaf litter, decaying wood, occasional protein",
    tagline: "The gateway isopod — hardy, prolific, and adorable black-and-white spots.",
    description:
      "The Dairy Cow is the classic starter isopod: a Porcellio scaber morph famous for its bold black-and-white spotting. Tough as nails, tolerant of a range of humidity and temperature swings, and a fast breeder — perfect for a first colony or a cleanup crew in a bioactive vivarium.",
    careNotes: [
      "Thrives in a mixed substrate of coco fiber, leaf litter, and rotting hardwood.",
      "Tolerates drier conditions better than most isopods — great for beginners.",
      "Breeds readily; expect a booming colony within a few months.",
      "Excellent cleanup crew for bioactive terrariums and reptile enclosures.",
    ],
    colors: ["#3a3a3a", "#f4f1e8", "#2a2a2a"],
    pattern: "spotted",
    inStock: true,
    stockCount: 42,
  },
  {
    slug: "powder-blue-isopod",
    name: "Powder Blue Isopod",
    scientificName: "Porcellionides pruinosus 'Powder Blue'",
    category: "common",
    price: 10,
    unit: "each",
    difficulty: "Beginner",
    size: "10-14mm",
    temperature: "70-80°F",
    humidity: "50-70%",
    diet: "Leaf litter, cork bark, fish flake or fish food for protein",
    tagline: "A dusty, powder-blue sheen and a taste for warmer setups.",
    description:
      "Powder Blues are fast-moving, heat-tolerant isopods with a beautiful chalky-blue dusting over a slate body. They breed quickly and do well in warmer bioactive setups where other species slow down, making them a favorite cleanup crew for tropical vivariums.",
    careNotes: [
      "Prefers warmer temps than most common isopods — great for tropical bioactive builds.",
      "Fast reproducer; a small starter colony can multiply quickly.",
      "Give plenty of cork bark and leaf litter to graze on and hide under.",
      "Good climbers — keep enclosures sealed at the top.",
    ],
    colors: ["#7a8fa6", "#c9d6e3", "#5c6f82"],
    pattern: "plain",
    inStock: true,
    stockCount: 60,
  },
  {
    slug: "montenegro-isopod",
    name: "Montenegro Isopod",
    scientificName: "Armadillidium klugii 'Montenegro'",
    category: "designer",
    price: 22,
    unit: "each",
    difficulty: "Intermediate",
    size: "18-22mm",
    temperature: "68-75°F",
    humidity: "70-80%",
    diet: "Leaf litter, decaying hardwood, calcium supplement",
    tagline: "Deep orange body with a jet black head and tail plate — a true showpiece.",
    description:
      "One of the most striking Armadillidium species available, the Montenegro sports a rich orange body bookended by contrasting black plates. A true 'roly poly' that curls into a perfect ball when startled. Slightly slower to breed than common species, which keeps them a sought-after designer morph.",
    careNotes: [
      "Needs consistently high humidity — mist regularly and keep substrate moist but not soggy.",
      "Rolls into a tight ball ('conglobation') when disturbed — handle gently and infrequently.",
      "Benefits from a cuttlebone or other calcium source for healthy molts.",
      "Slower breeder than common species — patience pays off with a striking colony.",
    ],
    colors: ["#c96a2b", "#1c1c1c", "#e08a3f"],
    pattern: "banded",
    inStock: true,
    stockCount: 14,
  },
  {
    slug: "rubber-ducky-isopod",
    name: "Rubber Ducky Isopod",
    scientificName: "Cubaris sp. 'Rubber Ducky'",
    category: "designer",
    price: 28,
    unit: "each",
    difficulty: "Intermediate",
    size: "12-16mm",
    temperature: "72-80°F",
    humidity: "75-85%",
    diet: "Leaf litter, decaying wood, occasional protein",
    tagline: "Bright yellow-orange Cubaris that pops against any dark substrate.",
    description:
      "A vividly colored Cubaris morph named for its rubber-duck-yellow coloration. Cubaris isopods are known for tighter huddling behavior and a preference for high humidity with excellent airflow underneath. A favorite among collectors for their color alone.",
    careNotes: [
      "Wants it humid but not stagnant — good ventilation prevents mold and mite issues.",
      "Loves to cluster under bark and in cork tubes during the day.",
      "Slower to establish than Armadillidium or Porcellio — start with a small isolated culture.",
      "Avoid overly wet substrate; aim for damp with a drier zone available.",
    ],
    colors: ["#e8b923", "#8a5a1f", "#f4d35e"],
    pattern: "marbled",
    inStock: true,
    stockCount: 9,
  },
  {
    slug: "zebra-isopod",
    name: "Zebra Isopod",
    scientificName: "Armadillidium maculatum 'Zebra'",
    category: "designer",
    price: 16,
    unit: "each",
    difficulty: "Intermediate",
    size: "18-20mm",
    temperature: "68-76°F",
    humidity: "60-75%",
    diet: "Leaf litter, decaying hardwood, calcium supplement",
    tagline: "Bold white stripes over a dark body — a designer classic.",
    description:
      "The Zebra isopod is one of the most recognizable designer morphs, prized for its crisp white banding over a near-black body. A great step-up species once you've had success with common Porcellio or Armadillidium — active, personable, and a fantastic 'roll into a ball' display species.",
    careNotes: [
      "Appreciates a mineral-rich substrate; add crushed cuttlebone or eggshell.",
      "Moderate humidity with a drier basking side works well.",
      "Breeding slows in low temperatures — keep above 68°F for consistent reproduction.",
      "Great in mixed bioactive setups alongside common Porcellio species.",
    ],
    colors: ["#1a1a1a", "#f2f2f2", "#3a3a3a"],
    pattern: "banded",
    inStock: true,
    stockCount: 20,
  },
  {
    slug: "spanish-orange-isopod",
    name: "Spanish Orange Isopod",
    scientificName: "Porcellio scaber 'Orange'",
    category: "common",
    price: 9,
    unit: "each",
    difficulty: "Beginner",
    size: "15-18mm",
    temperature: "65-75°F",
    humidity: "55-70%",
    diet: "Leaf litter, decaying wood, occasional protein",
    tagline: "A punchy solid-orange Porcellio scaber that breeds like a common but looks like a designer.",
    description:
      "All the toughness of a standard Porcellio scaber with a rich solid-orange color that stands out beautifully against dark substrate. A great budget-friendly way to add color to a colony without sacrificing hardiness or breeding speed.",
    careNotes: [
      "Same easy-care requirements as standard Porcellio scaber.",
      "Handles a range of humidity levels — very forgiving for new keepers.",
      "Fast, reliable breeder — good producer for cleanup crew stock.",
      "Color intensifies with a varied diet including leaf litter and hardwood bark.",
    ],
    colors: ["#d9701f", "#f0a75a", "#b5591a"],
    pattern: "plain",
    inStock: true,
    stockCount: 55,
  },
  {
    slug: "clown-isopod",
    name: "Clown Isopod",
    scientificName: "Armadillidium klugii 'Clown'",
    category: "designer",
    price: 24,
    unit: "each",
    difficulty: "Intermediate",
    size: "18-22mm",
    temperature: "68-75°F",
    humidity: "70-80%",
    diet: "Leaf litter, decaying hardwood, calcium supplement",
    tagline: "Playful white, orange, and black patchwork — no two look quite the same.",
    description:
      "A high-contrast Armadillidium klugii morph with irregular white, orange, and black patches. Every individual has a slightly different pattern, making a colony genuinely fun to watch grow. Care mirrors other klugii morphs — humid, cool-to-moderate temps, and patience while the colony establishes.",
    careNotes: [
      "Keep humidity high and stable; avoid drying out between mistings.",
      "Provide plenty of cork bark and leaf litter for cover.",
      "Add a calcium source to support healthy molting and reproduction.",
      "Slower growing colony — best for keepers wanting a long-term project.",
    ],
    colors: ["#e8e4d8", "#d9701f", "#1c1c1c"],
    pattern: "marbled",
    inStock: true,
    stockCount: 11,
  },
  {
    slug: "giant-canyon-isopod",
    name: "Giant Canyon Isopod",
    scientificName: "Porcellio hoffmannseggi",
    category: "designer",
    price: 20,
    unit: "each",
    difficulty: "Intermediate",
    size: "20-25mm",
    temperature: "72-82°F",
    humidity: "40-60%",
    diet: "Leaf litter, decaying wood, mineral-rich substrate",
    tagline: "One of the largest common isopods you can keep — a desert-adapted giant.",
    description:
      "A large, fast, desert-adapted species that wants it drier and warmer than typical tropical isopods. Their size alone makes them a standout display species, and their arid-adapted care needs make for an interesting change of pace from humidity-loving morphs.",
    careNotes: [
      "Needs a drier substrate than most isopods — avoid excess moisture.",
      "Provide a mineral-rich, slightly sandy substrate mix.",
      "Runs fast and is more skittish than round isopods like Armadillidium.",
      "Great in arid bioactive builds alongside desert plants.",
    ],
    colors: ["#9c8365", "#c9b28f", "#6e5a42"],
    pattern: "plain",
    inStock: true,
    stockCount: 17,
  },
  {
    slug: "purple-isopod",
    name: "Purple Isopod",
    scientificName: "Porcellionides pruinosus 'Purple'",
    category: "designer",
    price: 26,
    unit: "each",
    difficulty: "Intermediate",
    size: "10-14mm",
    temperature: "72-80°F",
    humidity: "55-70%",
    diet: "Leaf litter, cork bark, fish flake or fish food for protein",
    tagline: "A rare violet dusting over the classic fast-breeding pruinosus body.",
    description:
      "All the speed and heat tolerance of Porcellionides pruinosus, dressed in a rare violet-purple dusting. Fast breeders that do well in warmer tropical setups, making them a great way to add a splash of color to an established bioactive tank.",
    careNotes: [
      "Warm and moderately humid — matches care of standard pruinosus morphs.",
      "Fast breeding cycle once established.",
      "Good climbers; keep enclosures secure.",
      "Color is most vivid on well-fed, mature adults.",
    ],
    colors: ["#7a4fa3", "#b98fd6", "#5a3579"],
    pattern: "plain",
    inStock: true,
    stockCount: 8,
  },
  {
    slug: "pillbug-classic",
    name: "Classic Pillbug",
    scientificName: "Armadillidium vulgare",
    category: "common",
    price: 6,
    unit: "each",
    difficulty: "Beginner",
    size: "15-18mm",
    temperature: "65-78°F",
    humidity: "50-70%",
    diet: "Leaf litter, decaying wood, occasional protein",
    tagline: "The original roly poly — the most beginner-friendly isopod on the planet.",
    description:
      "The species most people grew up flipping over in the backyard. Extremely hardy, tolerant of a wide humidity and temperature range, and a reliable breeder. The perfect first isopod for kids, classrooms, or anyone dipping a toe into the hobby.",
    careNotes: [
      "Extremely forgiving of humidity and temperature swings.",
      "Great starter species for kids and classrooms.",
      "Breeds readily in almost any reasonable bioactive setup.",
      "Rolls into a tight ball when threatened — a favorite party trick.",
    ],
    colors: ["#5a5a52", "#7a7a6e", "#3a3a34"],
    pattern: "plain",
    inStock: true,
    stockCount: 80,
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
