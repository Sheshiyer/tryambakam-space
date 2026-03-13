export interface Product {
  id: string;
  category: string;
  engineConnection: string;
  description: string;
  materials: string;
  priceRange: string;
  imageUrl: string;
}

export const PRODUCTS: Product[] = [
  {
    id: "sacred-burnables",
    category: "Sacred Burnables",
    engineConnection: "Engine-specific blends — different engines, different scents",
    description:
      "Smoking blends and incense crafted to support specific engine consultations. Each blend corresponds to a compass direction and kosha layer.",
    materials: "Organic herbs, resins, sacred woods",
    priceRange: "$30–$80",
    imageUrl: "/images/products/product-sacred-burnables.png",
  },
  {
    id: "kopina-phasion",
    category: "Kopina / PHAS-ION",
    engineConnection: "Bioelectric Field engine integration",
    description:
      "Bioelectric sacral interface — a physical instrument for measuring and modulating the body's electromagnetic field during practice.",
    materials: "Bronze, ceramic, bioelectric sensors",
    priceRange: "$120–$245",
    imageUrl: "/images/products/product-kopina.png",
  },
  {
    id: "essential-oil-attars",
    category: "Essential Oil Attars",
    engineConnection: "Resonance Architecture",
    description:
      "Engine-matched frequency attars — each oil blend tuned to the acoustic frequency synthesis of a specific engine consultation.",
    materials: "Pure essential oils, traditional attar distillation",
    priceRange: "$45–$95",
    imageUrl: "/images/products/product-attars.png",
  },
  {
    id: "orgonite-pyramids",
    category: "Orgonite Pyramids",
    engineConnection: "Bioelectric Field",
    description:
      "Biofield harmonizers cast with the Tryambakam sigil. Designed to create a coherent electromagnetic environment for practice.",
    materials: "Orgonite resin, metal shavings, crystals, bronze sigil",
    priceRange: "$80–$165",
    imageUrl: "/images/products/product-orgonite.png",
  },
  {
    id: "crystal-arrays",
    category: "Crystal Arrays",
    engineConnection: "Geometric Resonance engine",
    description:
      "Geometric resonance tools arranged in sacred geometry patterns. Each array maps to the mathematical symmetries computed by the Geometric Resonance engine.",
    materials: "Natural crystals, dark wood base, brass fittings",
    priceRange: "$60–$145",
    imageUrl: "/images/products/product-crystals.png",
  },
  {
    id: "resonance-pendants",
    category: "Resonance Pendants",
    engineConnection: "Resonance Architecture",
    description:
      "Wearable frequency anchors — pendants cast with engine-specific sigil variations. Designed to maintain coherence between sessions.",
    materials: "Bronze, leather cord, engraved sigil",
    priceRange: "$55–$120",
    imageUrl: "/images/products/product-pendants.png",
  },
];
