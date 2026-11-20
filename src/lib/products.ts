export type Category = "common" | "designer";

export interface Product {
  slug: string;
  name: string;
  scientificName: string;
  category: Category;
  price: number;
  unit: string; // e.g. "each", "container of 25"
  /** Isopods per container when sold by the container. Stock and quantities count containers. */
  packSize?: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  size: string;
  temperature: string;
  humidity: string;
  diet: string;
  tagline: string;
  description: string;
  careNotes: string[];
  /** Optional species Q&A, shown on the product page and emitted as FAQPage structured data. */
  faqs?: { q: string; a: string }[];
  /** Real photos in public/photos (base filename, no extension). First one is the main image. */
  photos?: { file: string; alt: string }[];
  colors: [string, string, string]; // body base, band/pattern, spots; used by the placeholder illustration
  pattern: "plain" | "banded" | "spotted" | "marbled";
  /** true = sellable through checkout. false = waitlist only. */
  inStock: boolean;
  /** Starting inventory. Live remaining stock comes from the database via /api/stock. */
  stockCount: number;
}

export const products: Product[] = [
  {
    slug: "dairy-cow-isopod",
    name: "Dairy Cow Isopod",
    scientificName: "Porcellio laevis 'Dairy Cow'",
    category: "common",
    price: 19.99,
    unit: "container of 25",
    packSize: 25,
    difficulty: "Beginner",
    size: "Up to 20mm",
    temperature: "70-85°F",
    humidity: "60-75% with a drier side",
    diet: "Leaf litter, rotting hardwood, plus regular protein (fish flakes, dried shrimp)",
    tagline: "Big, fast, black-and-white spotted isopods that breed like crazy. The perfect first colony.",
    description:
      "Dairy Cow isopods are a color morph of Porcellio laevis, one of the largest and fastest-breeding isopods in the hobby. Their bold white-and-black patchwork looks just like a Holstein, and they are tough enough for first-time keepers. They handle warm rooms, eat almost anything, and make an excellent cleanup crew for bioactive reptile enclosures. They do not roll into a ball; they run, and they are fun to watch.",
    careNotes: [
      "Use a mix of coco fiber or topsoil, leaf litter, and rotting hardwood, about 2 to 3 inches deep.",
      "Keep one side damp and one side drier, with good ventilation. Laevis do not like stagnant, soggy tubs.",
      "Feed protein every few days (fish flakes, dried shrimp, insect pellets). Protein-starved colonies may pick on molting isopods.",
      "Warmth speeds breeding. Around 75-80°F, a starter group can turn into a busy colony within a few months.",
      "Big appetite and fast movers, so they shine as cleanup crew in larger bioactive enclosures.",
    ],
    faqs: [
      {
        q: "What is a Dairy Cow isopod?",
        a: "A Dairy Cow isopod is a black-and-white color morph of Porcellio laevis, a large, fast-breeding terrestrial isopod. The patchy white and dark markings look like a Holstein cow, which is where the name comes from.",
      },
      {
        q: "Are Dairy Cow isopods good for beginners?",
        a: "Yes. They tolerate a wide range of temperature and humidity, eat almost anything, and breed quickly, which makes them one of the easiest isopods for a first colony.",
      },
      {
        q: "How many Dairy Cow isopods should I start with?",
        a: "One container of 25 is a strong starter colony. It gives you a healthy mix of males and females, so the group starts breeding within a few weeks to a couple of months. Two containers get a large bioactive enclosure going faster.",
      },
      {
        q: "What comes in a container?",
        a: "25 live Dairy Cow isopods, captive bred by RolyPods, packed in a vented cup with damp moss and leaf litter for the trip, inside an insulated shipping box.",
      },
      {
        q: "Can Dairy Cow isopods be a cleanup crew?",
        a: "Yes. They are popular cleanup crew for bioactive enclosures with reptiles, amphibians, and tarantulas, especially larger and warmer setups. They are big and fast, so very small or delicate enclosures suit smaller species better.",
      },
      {
        q: "Do Dairy Cow isopods roll into a ball?",
        a: "No. Porcellio laevis cannot roll up like a pill bug. They run for cover instead, and they are fast.",
      },
      {
        q: "How big do Dairy Cow isopods get?",
        a: "Adults reach up to about 20mm (roughly three quarters of an inch), making them one of the larger common isopods in the hobby.",
      },
    ],
    photos: [
      { file: "dairy-cow-isopods-2-closeup", alt: "Close-up of Dairy Cow isopods (Porcellio laevis) showing white bodies with dark spots on cork bark" },
      { file: "dairy-cow-isopods-1-group", alt: "A group of RolyPods Dairy Cow isopods on a piece of cork bark held in hand" },
      { file: "dairy-cow-isopods-3-habitat", alt: "Dairy Cow isopods in their enclosure with cork bark, moss, and substrate" },
    ],
    colors: ["#efe9dc", "#2a2a2a", "#232323"],
    pattern: "spotted",
    inStock: false,
    stockCount: 4,
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
      "Prefers warmer temps than most common isopods: great for tropical bioactive builds.",
      "Fast reproducer; a small starter colony can multiply quickly.",
      "Give plenty of cork bark and leaf litter to graze on and hide under.",
      "Good climbers, so keep enclosures sealed at the top.",
    ],
    colors: ["#7a8fa6", "#c9d6e3", "#5c6f82"],
    pattern: "plain",
    inStock: false,
    stockCount: 0,
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
    tagline: "Deep orange body with a jet black head and tail plate: a true showpiece.",
    description:
      "One of the most striking Armadillidium species available, the Montenegro sports a rich orange body bookended by contrasting black plates. A true 'roly poly' that curls into a perfect ball when startled. Slightly slower to breed than common species, which keeps them a sought-after designer morph.",
    careNotes: [
      "Needs consistently high humidity. Mist regularly and keep substrate moist but not soggy.",
      "Rolls into a tight ball ('conglobation') when disturbed. Handle gently and infrequently.",
      "Benefits from a cuttlebone or other calcium source for healthy molts.",
      "Slower breeder than common species, but patience pays off with a striking colony.",
    ],
    colors: ["#c96a2b", "#1c1c1c", "#e08a3f"],
    pattern: "banded",
    inStock: false,
    stockCount: 0,
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
      "Wants it humid but not stagnant; good ventilation prevents mold and mite issues.",
      "Loves to cluster under bark and in cork tubes during the day.",
      "Slower to establish than Armadillidium or Porcellio. Start with a small isolated culture.",
      "Avoid overly wet substrate; aim for damp with a drier zone available.",
    ],
    colors: ["#e8b923", "#8a5a1f", "#f4d35e"],
    pattern: "marbled",
    inStock: false,
    stockCount: 0,
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
    tagline: "Bold white stripes over a dark body: a designer classic.",
    description:
      "The Zebra isopod is one of the most recognizable designer morphs, prized for its crisp white banding over a near-black body. A great step-up species once you've had success with common Porcellio or Armadillidium: active, personable, and a fantastic 'roll into a ball' display species.",
    careNotes: [
      "Appreciates a mineral-rich substrate; add crushed cuttlebone or eggshell.",
      "Moderate humidity with a drier basking side works well.",
      "Breeding slows in low temperatures; keep above 68°F for consistent reproduction.",
      "Great in mixed bioactive setups alongside common Porcellio species.",
    ],
    colors: ["#1a1a1a", "#f2f2f2", "#3a3a3a"],
    pattern: "banded",
    inStock: false,
    stockCount: 0,
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
      "Handles a range of humidity levels: very forgiving for new keepers.",
      "Fast, reliable breeder: good producer for cleanup crew stock.",
      "Color intensifies with a varied diet including leaf litter and hardwood bark.",
    ],
    colors: ["#d9701f", "#f0a75a", "#b5591a"],
    pattern: "plain",
    inStock: false,
    stockCount: 0,
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
    tagline: "Playful white, orange, and black patchwork: no two look quite the same.",
    description:
      "A high-contrast Armadillidium klugii morph with irregular white, orange, and black patches. Every individual has a slightly different pattern, making a colony genuinely fun to watch grow. Care mirrors other klugii morphs: humid, cool-to-moderate temps, and patience while the colony establishes.",
    careNotes: [
      "Keep humidity high and stable; avoid drying out between mistings.",
      "Provide plenty of cork bark and leaf litter for cover.",
      "Add a calcium source to support healthy molting and reproduction.",
      "Slower growing colony, best for keepers wanting a long-term project.",
    ],
    colors: ["#e8e4d8", "#d9701f", "#1c1c1c"],
    pattern: "marbled",
    inStock: false,
    stockCount: 0,
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
    tagline: "One of the largest common isopods you can keep: a desert-adapted giant.",
    description:
      "A large, fast, desert-adapted species that wants it drier and warmer than typical tropical isopods. Their size alone makes them a standout display species, and their arid-adapted care needs make for an interesting change of pace from humidity-loving morphs.",
    careNotes: [
      "Needs a drier substrate than most isopods; avoid excess moisture.",
      "Provide a mineral-rich, slightly sandy substrate mix.",
      "Runs fast and is more skittish than round isopods like Armadillidium.",
      "Great in arid bioactive builds alongside desert plants.",
    ],
    colors: ["#9c8365", "#c9b28f", "#6e5a42"],
    pattern: "plain",
    inStock: false,
    stockCount: 0,
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
      "Warm and moderately humid: matches care of standard pruinosus morphs.",
      "Fast breeding cycle once established.",
      "Good climbers; keep enclosures secure.",
      "Color is most vivid on well-fed, mature adults.",
    ],
    colors: ["#7a4fa3", "#b98fd6", "#5a3579"],
    pattern: "plain",
    inStock: false,
    stockCount: 0,
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
    tagline: "The original roly poly: the most beginner-friendly isopod on the planet.",
    description:
      "The species most people grew up flipping over in the backyard. Extremely hardy, tolerant of a wide humidity and temperature range, and a reliable breeder. The perfect first isopod for kids, classrooms, or anyone dipping a toe into the hobby.",
    careNotes: [
      "Extremely forgiving of humidity and temperature swings.",
      "Great starter species for kids and classrooms.",
      "Breeds readily in almost any reasonable bioactive setup.",
      "Rolls into a tight ball when threatened: a favorite party trick.",
    ],
    colors: ["#5a5a52", "#7a7a6e", "#3a3a34"],
    pattern: "plain",
    inStock: false,
    stockCount: 0,
  },
];

/** Products that can be added to the cart and paid for. Everything else is waitlist only. */
export function isPurchasable(slug: string) {
  return products.some((p) => p.slug === slug && p.inStock);
}

/** "$19.99 per container of 25" / "$8.00 each" */
export function priceLabel(p: Product) {
  return `$${p.price.toFixed(2)} ${p.unit === "each" ? "each" : `per ${p.unit}`}`;
}

/** Display name for one cart line, e.g. "Dairy Cow Isopod (25-count container)". */
export function lineName(p: Product) {
  return p.packSize ? `${p.name} (${p.packSize}-count container)` : p.name;
}

export function photoSrc(file: string, size: "lg" | "sm" = "lg") {
  return `/photos/${file}${size === "sm" ? "-sm" : ""}.jpg`;
}

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}
