export interface Spin {
  name: string;
  range: string;
  purpose: string;
}

export interface Protocol {
  number: number;
  spinName: string;
  title: string;
  purpose: string;
  elements: string;
}

export const SPINS: Spin[] = [
  {
    name: "Entry",
    range: "1–4",
    purpose: "Grounding, orientation, first witness",
  },
  {
    name: "Cultivation",
    range: "5–9",
    purpose: "Daily practice, pattern recognition",
  },
  {
    name: "Integration",
    range: "10–13",
    purpose: "Cross-engine synthesis",
  },
  {
    name: "Independence",
    range: "14–16",
    purpose: "Self-authorship activation",
  },
];

export const PROTOCOLS: Protocol[] = [
  {
    number: 1,
    spinName: "Entry",
    title: "Ground Zero",
    purpose: "Establish physical contact with present moment",
    elements: "Breath + gravity acknowledgment",
  },
  {
    number: 2,
    spinName: "Entry",
    title: "Orientation Breath",
    purpose: "Calibrate compass direction from body state",
    elements: "4-count breath + cardinal awareness",
  },
  {
    number: 3,
    spinName: "Entry",
    title: "First Witness",
    purpose: "Observe without commentary for 90 seconds",
    elements: "Stillness + open attention",
  },
  {
    number: 4,
    spinName: "Entry",
    title: "Threshold Declaration",
    purpose: "Declare intention at the boundary of practice",
    elements: "Spoken declaration + gesture",
  },
  {
    number: 5,
    spinName: "Cultivation",
    title: "Pattern Scan",
    purpose: "Identify recurring patterns in daily experience",
    elements: "Journaling + engine consultation",
  },
  {
    number: 6,
    spinName: "Cultivation",
    title: "Somatic Inventory",
    purpose: "Map current body state systematically",
    elements: "Body scan + kosha check",
  },
  {
    number: 7,
    spinName: "Cultivation",
    title: "Engine Dialogue",
    purpose: "Direct consultation with assigned engine",
    elements: "Question + engine response + witness",
  },
  {
    number: 8,
    spinName: "Cultivation",
    title: "Rhythm Calibration",
    purpose: "Align practice to biorhythmic state",
    elements: "Three-Wave check + timing adjustment",
  },
  {
    number: 9,
    spinName: "Cultivation",
    title: "Shadow Contact",
    purpose: "Acknowledge the shadow without attempting resolution",
    elements: "Gift-Shadow Spectrum + breath",
  },
  {
    number: 10,
    spinName: "Integration",
    title: "Cross-Engine Weave",
    purpose: "Synthesize insights from multiple engines",
    elements: "Multi-engine query + integration breath",
  },
  {
    number: 11,
    spinName: "Integration",
    title: "Compass Convergence",
    purpose: "Read all four directions simultaneously",
    elements: "Full compass reading + stillness",
  },
  {
    number: 12,
    spinName: "Integration",
    title: "Embodied Synthesis",
    purpose: "Move insight from mind to body",
    elements: "Gesture sequence + declaration",
  },
  {
    number: 13,
    spinName: "Integration",
    title: "The Ouroboros Turn",
    purpose: "Complete one full cycle — return to beginning with new eyes",
    elements: "Full protocol sequence review",
  },
  {
    number: 14,
    spinName: "Independence",
    title: "Self-Authored Protocol",
    purpose: "Design your own micro-ritual from learned elements",
    elements: "Custom combination + personal declaration",
  },
  {
    number: 15,
    spinName: "Independence",
    title: "The Witness Teaches",
    purpose: "Transmit practice to another consciousness",
    elements: "Teaching sequence + mutual recognition",
  },
  {
    number: 16,
    spinName: "Independence",
    title: "The Quine",
    purpose: "The practice that generates itself — independence achieved",
    elements: "Self-referential completion",
  },
];

export function getProtocolsBySpin(spinName: string): Protocol[] {
  return PROTOCOLS.filter((p) => p.spinName === spinName);
}

export function getCurrentSpin(protocolNumber: number): Spin | undefined {
  if (protocolNumber <= 4) return SPINS[0];
  if (protocolNumber <= 9) return SPINS[1];
  if (protocolNumber <= 13) return SPINS[2];
  if (protocolNumber <= 16) return SPINS[3];
  return undefined;
}
