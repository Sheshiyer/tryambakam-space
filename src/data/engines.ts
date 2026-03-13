export type CompassDirection = "N" | "E" | "S" | "W";
export type CompassLabel = "STABILIZE" | "HEAL" | "CREATE" | "MUTATE";
export type EngineCategory = "Rust Core" | "TS Bridge";
export type KoshaLayer = "Annamaya" | "Pranamaya" | "Manomaya" | "Vijnanamaya" | "Anandamaya";

export interface Engine {
  id: number;
  name: string;
  category: EngineCategory;
  whatItComputes: string;
  compassDirection: CompassDirection;
  compassLabel: CompassLabel;
  koshaLayer: KoshaLayer;
}

export const ENGINES: Engine[] = [
  {
    id: 1,
    name: "Temporal Grammar",
    category: "Rust Core",
    whatItComputes: "Five-fold calendar for auspicious timing (Panchanga)",
    compassDirection: "N",
    compassLabel: "STABILIZE",
    koshaLayer: "Annamaya",
  },
  {
    id: 2,
    name: "Chronofield",
    category: "Rust Core",
    whatItComputes: "120-year planetary period mapping — which chapter of your life is open",
    compassDirection: "E",
    compassLabel: "HEAL",
    koshaLayer: "Pranamaya",
  },
  {
    id: 3,
    name: "Energetic Authority",
    category: "Rust Core",
    whatItComputes: "Bodygraph mechanics — how your specific wiring makes choices",
    compassDirection: "S",
    compassLabel: "CREATE",
    koshaLayer: "Manomaya",
  },
  {
    id: 4,
    name: "Gift-Shadow Spectrum",
    category: "Rust Core",
    whatItComputes: "Shadow → Gift → Activated State developmental arc",
    compassDirection: "W",
    compassLabel: "MUTATE",
    koshaLayer: "Vijnanamaya",
  },
  {
    id: 5,
    name: "Numeric Architecture",
    category: "Rust Core",
    whatItComputes: "Archetypal number patterns encoded in birth data",
    compassDirection: "N",
    compassLabel: "STABILIZE",
    koshaLayer: "Annamaya",
  },
  {
    id: 6,
    name: "Three-Wave Cycle",
    category: "Rust Core",
    whatItComputes: "Physical / Emotional / Intellectual biorhythm mapping",
    compassDirection: "E",
    compassLabel: "HEAL",
    koshaLayer: "Pranamaya",
  },
  {
    id: 7,
    name: "Circadian Cartography",
    category: "Rust Core",
    whatItComputes: "Organ activation mapped to time-of-day",
    compassDirection: "S",
    compassLabel: "CREATE",
    koshaLayer: "Annamaya",
  },
  {
    id: 8,
    name: "Bioelectric Field",
    category: "Rust Core",
    whatItComputes: "Measurable electromagnetic patterns in the subtle body",
    compassDirection: "W",
    compassLabel: "MUTATE",
    koshaLayer: "Pranamaya",
  },
  {
    id: 9,
    name: "Physiognomic Mapping",
    category: "Rust Core",
    whatItComputes: "Facial feature correlation to organ health and life patterns",
    compassDirection: "N",
    compassLabel: "STABILIZE",
    koshaLayer: "Annamaya",
  },
  {
    id: 10,
    name: "Resonance Architecture",
    category: "Rust Core",
    whatItComputes: "Acoustic frequency synthesis — sound as computational substrate",
    compassDirection: "E",
    compassLabel: "HEAL",
    koshaLayer: "Anandamaya",
  },
  {
    id: 11,
    name: "Active Planetary Weather",
    category: "Rust Core",
    whatItComputes: "Current planetary positions relative to natal chart",
    compassDirection: "S",
    compassLabel: "CREATE",
    koshaLayer: "Vijnanamaya",
  },
  {
    id: 12,
    name: "Archetypal Mirror",
    category: "TS Bridge",
    whatItComputes: "78-card symbolic reflection for current state (Thoth-Crowley)",
    compassDirection: "W",
    compassLabel: "MUTATE",
    koshaLayer: "Vijnanamaya",
  },
  {
    id: 13,
    name: "Hexagram Navigation",
    category: "TS Bridge",
    whatItComputes: "64-state pattern recognition oracle",
    compassDirection: "N",
    compassLabel: "STABILIZE",
    koshaLayer: "Manomaya",
  },
  {
    id: 14,
    name: "Nine-Point Architecture",
    category: "TS Bridge",
    whatItComputes: "9-type fixation-to-essence movement",
    compassDirection: "E",
    compassLabel: "HEAL",
    koshaLayer: "Manomaya",
  },
  {
    id: 15,
    name: "Geometric Resonance",
    category: "TS Bridge",
    whatItComputes: "Mathematical symmetries underlying reality",
    compassDirection: "S",
    compassLabel: "CREATE",
    koshaLayer: "Anandamaya",
  },
  {
    id: 16,
    name: "Sigil Forge",
    category: "TS Bridge",
    whatItComputes: "Symbolic geometry creation engine",
    compassDirection: "W",
    compassLabel: "MUTATE",
    koshaLayer: "Anandamaya",
  },
];

export function getEngineById(id: number): Engine | undefined {
  return ENGINES.find((engine) => engine.id === id);
}
