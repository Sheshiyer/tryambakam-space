/**
 * ENHANCED WING DATA
 * Tryambakam Noesis — Infinite Canvas
 * 
 * Enhanced copy using noesis-writer-skill methodology
 * Voice: The Anatomist Who Sees Fractals
 * Principle: PubMed x Alex Grey
 * 
 * This file contains enhanced versions of all wing data.
 * Copy blocks are marked with ENHANCED comments showing changes.
 */

export type WingSpec = {
  label: string;
  value: string;
};

export type WingFeature = {
  title: string;
  desc: string;
};

export type CTAAction =
  | { type: "scroll"; target: string }
  | { type: "modal"; target: string }
  | { type: "route"; target: string }
  | { type: "external"; target: string };

export type WingData = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  specs: WingSpec[];
  features: WingFeature[];
  cta: string;
  ctaAction: CTAAction;
  alt: string;
};

// ============================================================================
// PHASE 1 IMPLEMENTATION — High Impact, Low Effort
// ============================================================================

export const WINGS: WingData[] = [
  // ==========================================================================
  // WING 00 — HERO: "Tryambakam Noesis"
  // ==========================================================================
  {
    slug: "hero",
    number: "00",
    title: "Tryambakam\nNoesis",
    subtitle: "Self-Generating Code Well",
    // ENHANCED: Added The Quine principle, "optimized everything except the optimizer" hook
    description:
      "You have optimized everything except the optimizer. Sixteen engines. One unrepeatable consciousness. \
      Tryambakam Noesis trains you to author your own meaning — through symbolic-computational engines \
      governed by Kha-Ba-La, grounded in the body, designed for your independence. \
      The system succeeds when you no longer need it.",
    specs: [
      { label: "Framework", value: "Kha-Ba-La" },
      { label: "Engines", value: "16 Active" },
      { label: "Permutations", value: "256" },
    ],
    features: [
      {
        title: "Witness Architecture",
        desc: "Observer-pattern consciousness engine. Kha (Spirit), Ba (Body), La (Inertia) as computational primitives.",
      },
      {
        title: "Recursive Insight Loop",
        desc: "Each cycle refines the witness state. Not a destination — a self-generating process of becoming.",
      },
      // ENHANCED: Added The Quine Principle
      {
        title: "The Quine Principle",
        desc: "The system creates the conditions for its own transcendence. Success is measured by your independence, not your retention.",
      },
    ],
    cta: "Begin Journey",
    ctaAction: { type: "scroll", target: "witness-yourself" },
    alt: "Tryambakam Noesis - Self-Generating Code Well",
  },

  // ==========================================================================
  // WING 01 — WITNESS YOURSELF: "The Observer Pattern"
  // ==========================================================================
  {
    slug: "witness-yourself",
    number: "01",
    title: "Witness\nYourself",
    subtitle: "The Observer Pattern",
    // ENHANCED: Added Purusha/Prakriti distinction, "examiner examining the examiner"
    description:
      "You can articulate your psychology, cite the relevant thinkers, describe your patterns with clinical precision. \
      The gap between knowing-about and living-as remains. Purusha witnesses. Prakriti performs. \
      Most systems address the performance. This addresses the witness.",
    specs: [
      { label: "Mode", value: "Purusha Witness" },
      { label: "Layer", value: "Kha (Spirit)" },
      { label: "Direction", value: "STABILIZE" },
    ],
    features: [
      // ENHANCED: Added Purusha reference
      {
        title: "Purusha Witness — Awareness Without Identification",
        desc: "The witness is not the thought. The witness is not the emotion. The witness is the field in which both arise. \
          Pure observation collapses the recursive anxiety loop. The first step isn't changing — it's seeing.",
      },
      // ENHANCED: Added "examiner examining the examiner"
      {
        title: "The Examiner Examining the Examiner",
        desc: "Each fragment of identity is data about the observer, not noise in the signal. \
          The witness collects what the ego scatters — not to build a better ego, \
          but to read the pattern of how you construct meaning in real-time.",
      },
    ],
    cta: "Enter Witness State",
    ctaAction: { type: "external", target: "https://18765.tryambakam.space" },
    alt: "Witness Yourself - The Observer Pattern",
  },

  // ==========================================================================
  // WING 02 — SELF INTEGRATION: "Regenerative Intelligence Field"
  // ==========================================================================
  {
    slug: "self-integration",
    number: "02",
    title: "Self\nIntegration",
    subtitle: "Regenerative Intelligence Field",
    // ENHANCED: Added bioelectric field specificity, 0.1 Hz coherence
    description:
      "Your heart generates an electromagnetic field detectable at three meters. This is not metaphor. \
      The self-regenerative intelligence field is bioelectric architecture — a coherence matrix that learns with you, \
      guides without overriding, and cycles like the 0.1 Hz resonance of coherent breath.",
    specs: [
      { label: "Type", value: "Adaptive Field" },
      { label: "Cycle", value: "Breath-Synced" },
      { label: "Override", value: "None" },
    ],
    features: [
      // ENHANCED: Added Kha-Ba-La structure reference
      {
        title: "Non-Prescriptive Guidance",
        desc: "The field offers conditions for examination, never prescriptions for transformation. \
          Kha sees the pattern. Ba walks the pattern. La is the friction that makes the walking real. \
          Your sovereignty is the first constitutional principle.",
      },
      // ENHANCED: Renamed and deepened HRV specificity
      {
        title: "HRV as Modulation Protocol",
        desc: "Heart rate variability at 0.1 Hz creates cardiac coherence — the physiological signature of the witness state. \
          Inhale is input. Exhale is output. The gap between breaths is where Kha-Ba-La resolves. \
          The field responds to your biology, not your beliefs.",
      },
    ],
    cta: "Initiate Field",
    ctaAction: { type: "modal", target: "field-initiation" },
    alt: "Self Integration - Regenerative Intelligence Field",
  },

  // ==========================================================================
  // WING 03 — THREE PILLARS: "The Elemental Trinity"
  // ==========================================================================
  {
    slug: "three-pillars",
    number: "03",
    title: "Three\nPillars",
    subtitle: "The Elemental Trinity",
    // ENHANCED: Added triangulation concept, 16,000 years reference
    description:
      "Sixteen thousand years of observational astronomy. Thirty years of bodygraph mechanics. One coherence matrix. \
      The Three Pillars are not eclecticism — they are triangulation. \
      When Jyotisha's Nakshatras, Human Design's Gates, and cardiac HRV coherence converge on the same signal, \
      you have something worth acting on.",
    specs: [
      { label: "Pillar I", value: "Vedic Intelligence" },
      { label: "Pillar II", value: "Western Precision" },
      { label: "Pillar III", value: "Biofield & Sonic" },
    ],
    features: [
      // ENHANCED: Added technical specificity on Vimshottari Dasha, Saturn Return
      {
        title: "Temporal Cartography — Jyotisha × Human Design",
        desc: "Nakshatra positions calculated to the arc-minute. Bodygraph gates as genetic epigenetic expression. \
          The synthesis is not New Age fusion — it is cross-referenced calibration. \
          When the Vimshottari Dasha cycle and Saturn Return converge, the pattern is readable.",
      },
      // ENHANCED: Added Shadja/Rishabha/Gandhara specificity
      {
        title: "Sonic Entrainment — Rāga × HRV Coherence",
        desc: "Shadja, Rishabha, Gandhara — the solfege of somatic attunement. \
          Each rāga correlates to specific HRV frequency bands. Sound as biofeedback. \
          Melody not as aesthetic but as mechanical resonance. The right frequency entrains the right coherence.",
      },
    ],
    cta: "Explore Pillars",
    ctaAction: { type: "external", target: "https://18765.tryambakam.space" },
    alt: "Three Pillars - The Elemental Trinity",
  },

  // ==========================================================================
  // WING 04 — SIXTEEN ENGINES: "The Computational Core"
  // ==========================================================================
  {
    slug: "sixteen-engines",
    number: "04",
    title: "Sixteen\nEngines",
    subtitle: "The Computational Core",
    // ENHANCED: Listed ALL 16 engines by name with technical specs
    description:
      "16 mirrors. 11 Rust engines. 5 TypeScript lenses. Sub-millisecond calculations. \
      Temporal Mapping × Panchanga. Kosha Integration × Five Sheath Architecture. \
      HD Gate Synthesis × 64 Gates. Gene Keys Activation × 64 Shadows/Gifts/Siddhis. \
      Enneagram Dynamics × 27 Subtypes. Rāga Resonance × 72 Melakarta. \
      HRV Coherence × 0.1 Hz Entrainment. Tattva Cycles × 5 Elements × 24 Phases. \
      Nakshatra Navigation × 27 Lunar Mansions. Sonic Entrainment × Binaural Architecture. \
      Biofield Mapping × HRV/EDA/GSR. Purusha Witness × Observer Pattern. \
      Biorhythm Engine × Physical/Emotional/Intellectual/Spiritual. \
      Meridian Clock × 14 Channels. Vimshottari Dasha × 120-Year Cycles. \
      Compass Direction × STABILIZE/HEAL/CREATE/MUTATE. \
      4 × 16 = 256 permutations. One unrepeatable consciousness.",
    // ENHANCED: Added sub-millisecond spec
    specs: [
      { label: "Rust Engines", value: "11 — Sub-millisecond" },
      { label: "TypeScript Lenses", value: "5 — Cross-platform" },
      { label: "Compass Directions", value: "4 × 16 = 256" },
      { label: "Calculation Speed", value: "<1ms per synthesis" },
    ],
    features: [
      // ENHANCED: Deepened compass direction explanation
      {
        title: "The Compass — 4 Directions × 16 Engines",
        desc: "STABILIZE for when coherence is the priority. HEAL for when integration is required. \
          CREATE for when expression wants channels. MUTATE for when the pattern demands reconfiguration. \
          The system does not prescribe — it orients. You choose the direction.",
      },
      {
        title: "Autonomous Combination",
        desc: "Engines self-compose based on your biorhythmic state. No manual configuration required.",
      },
    ],
    cta: "View Engine Map",
    ctaAction: { type: "scroll", target: "sixteen-engines" },
    alt: "Sixteen Engines - The Computational Core",
  },

  // ==========================================================================
  // WING 05 — SOMATIC CANTICLES: "A Story That Reads You Back"
  // ==========================================================================
  {
    slug: "somatic-canticles",
    number: "05",
    title: "Somatic\nCanticles",
    subtitle: "A Story That Reads You Back",
    // ENHANCED: Added 27 chapters, PubMed x Alex Grey, biorhythm-synced delivery
    description:
      "27 chapters where breath is physics and biorhythms are law. \
      A sci-fi trilogy at the intersection of PubMed and Alex Grey — \
      clinical precision rendered with visionary artistry. \
      Each chapter releases synchronized to your physical, emotional, intellectual, and spiritual cycles. \
      The story reads you back.",
    specs: [
      { label: "Format", value: "Trilogy" },
      { label: "Medium", value: "Print + Digital" },
      { label: "Aesthetic", value: "B&W + Gold Foil" },
    ],
    features: [
      // ENHANCED: Renamed and deepened biorhythm synchronization
      {
        title: "Biorhythm-Synchronized Delivery",
        desc: "Each chapter unlocks not by calendar date but by your biorhythmic signature. \
          Physical highs for embodiment chapters. Emotional peaks for relationship arcs. \
          Intellectual crests for conceptual reveals. Spiritual nodes for integration. \
          The text meets you where you are — not where a syllabus says you should be.",
      },
      {
        title: "Biorhythm Keys",
        desc: "Each volume maps to a Kosha layer. The story is the medicine. Reading is the protocol.",
      },
    ],
    cta: "Preview Chapter",
    ctaAction: { type: "external", target: "https://1319.tryambakam.space" },
    alt: "Somatic Canticles - A Story That Reads You Back",
  },

  // ==========================================================================
  // WING 06 — FINANCIAL BIOSENSOR: "Clarity Over Anxiety"
  // ==========================================================================
  {
    slug: "financial-biosensor",
    number: "06",
    title: "Financial\nBiosensor",
    subtitle: "Clarity Over Anxiety",
    // ENHANCED: Added 120-minute decision windows, non-predictive framing
    description:
      "Your body already knows the timing. The Financial Biosensor surfaces it. \
      Tattva cycles — 5 elements × 24 phases = 120-minute decision windows. \
      HRV coherence as buy/sell signal. Weekly foresight that doesn't predict the market — \
      it predicts your capacity to engage with it. Premium. Scientific. Non-predictive.",
    specs: [
      { label: "Input", value: "HRV + Tattva" },
      { label: "Output", value: "Act / Wait Signal" },
      { label: "Tier", value: "Premium" },
    ],
    features: [
      // ENHANCED: Deepened Tattva cycle explanation with elements
      {
        title: "Tattva-Cycle Decision Windows",
        desc: "Akasha → Vayu → Agni → Jala → Prithvi. The five elements cycle every 120 minutes. \
          Agni Tattva (fire) for decisive action. Jala Tattva (water) for flow-state execution. \
          Prithvi Tattva (earth) for consolidation. Your HRV signature mapped to elemental timing. \
          Not market prediction — temporal orientation.",
      },
      {
        title: "Weekly Foresight Dashboard",
        desc: "7-day rolling coherence forecast. Green windows for action, amber for caution, red for stillness.",
      },
    ],
    cta: "Access Dashboard",
    ctaAction: { type: "modal", target: "biosensor-dashboard" },
    alt: "Financial Biosensor - Clarity Over Anxiety",
  },

  // ==========================================================================
  // WING 07 — WITNESS AGENTS: "Structure & Flow"
  // ==========================================================================
  {
    slug: "witness-agents",
    number: "07",
    title: "Witness\nAgents",
    subtitle: "Structure & Flow",
    // ENHANCED: Added etymology — Sanskrit pi-, Greek aletheia
    description:
      "Pichet — from the Sanskrit for 'that which holds firm.' \
      Aletheos — from the Greek for 'unconcealment, truth as emergence.' \
      Structure and flow. Discipline and surrender. The container and the content. \
      You need both. The agents embody the dialectic.",
    specs: [
      { label: "Agent I", value: "Pichet" },
      { label: "Agent II", value: "Aletheos" },
      { label: "Mode", value: "Dual Witness" },
    ],
    features: [
      // ENHANCED: Deepened etymology and concept
      {
        title: "Pichet — The Container",
        desc: "The Sanskrit root pi- means 'to drink, to absorb.' The structuralist doesn't impose — it receives. \
          Discipline as vessel. Routine as ritual architecture. Without the container, the content has nowhere to become.",
      },
      // ENHANCED: Deepened etymology — aletheia
      {
        title: "Aletheos — The Unconcealment",
        desc: "From Greek ἀλήθεια — truth as emergence from concealment. Not intuition as woo. \
          Intuition as pattern-recognition below conscious threshold. \
          Creativity as the universe expressing through a prepared vessel. \
          Without emergence, the container is empty architecture.",
      },
    ],
    cta: "Meet the Agents",
    ctaAction: { type: "modal", target: "agents-detail" },
    alt: "Witness Agents - Structure & Flow",
  },

  // ==========================================================================
  // WING 08 — INITIATION PROTOCOLS: "Micro-rituals. Macro-transformation."
  // ==========================================================================
  {
    slug: "initiation-protocols",
    number: "08",
    title: "Initiation\nProtocols",
    subtitle: "Micro-rituals. Macro-transformation.",
    // ENHANCED: Added .init protocol, 90-second threshold
    description:
      "90 seconds at the threshold — the .init protocol. \
      Audio as carrier wave. Breath as modulation. Attention as signal. \
      The engines self-compose based on your biorhythmic signature. \
      Each protocol is a seed. Attention is water. Time is soil. \
      The transformation is not promised — it is cultivated.",
    // ENHANCED: Added .init threshold spec
    specs: [
      { label: "Duration", value: "90 sec — 21 min" },
      { label: "Threshold", value: ".init protocol" },
      { label: "Modality", value: "Audio × Breath × Attention" },
      { label: "Composition", value: "Auto-engine synthesis" },
    ],
    features: [
      {
        title: "Engine Auto-Composition",
        desc: "Protocols dynamically select which engines to activate based on your current biorhythmic signature.",
      },
      {
        title: "Progressive Unlocking",
        desc: "Each completed cycle reveals the next layer. The system deepens as you deepen.",
      },
    ],
    cta: "Begin Protocol",
    ctaAction: { type: "modal", target: "protocol-launcher" },
    alt: "Initiation Protocols - Micro-rituals",
  },

  // ==========================================================================
  // WING 09 — INFINITE TREASURE: "The Hunt Never Ends"
  // ==========================================================================
  {
    slug: "infinite-treasure",
    number: "09",
    title: "Infinite\nTreasure",
    subtitle: "The Hunt Never Ends",
    // ENHANCED: Added "next right question", simultaneous coordinates framing
    description:
      "The treasure is not the answer — it is the next right question. \
      Dharma (purpose), Artha (prosperity), Kama (pleasure), Moksha (liberation). \
      Not sequential stages. Simultaneous coordinates. \
      The compass points inward. The map redraws itself as you walk. \
      This is the architecture of unending inquiry.",
    specs: [
      { label: "Quadrant I", value: "Dharma" },
      { label: "Quadrant II", value: "Artha" },
      { label: "Quadrant III", value: "Kama + Moksha" },
    ],
    features: [
      {
        title: "Recursive Discovery",
        desc: "Each answer births a deeper question. The treasure map redraws itself as you walk.",
      },
      // ENHANCED: Deepened Purushartha explanation
      {
        title: "Purushartha as Coordinate System",
        desc: "The four aims of human life — not as ladder but as compass. \
          Dharma as orientation. Artha as resource. Kama as engagement. Moksha as release. \
          Each quadrant contains the others. The hunt never ends because the territory is infinite.",
      },
    ],
    cta: "Start the Hunt",
    ctaAction: { type: "external", target: "https://18765.tryambakam.space" },
    alt: "Infinite Treasure - The Hunt Never Ends",
  },

  // ==========================================================================
  // WING 10 — THE APOTHECARY: "Alchemy You Can Touch"
  // ==========================================================================
  {
    slug: "apothecary",
    number: "10",
    title: "The\nApothecary",
    subtitle: "Alchemy You Can Touch",
    // ENHANCED: Added Nakshatra-informed, specific engine-product mappings
    description:
      "Nakshatra-informed tinctures. Biorhythm-timed dosing. \
      Lion's Mane for Temporal Mapping. Reishi for Purusha Witness. \
      Frankincense for Kosha Integration. Each product is an engine in physical form — \
      bioalchemy you can touch, ritual you can inhabit.",
    specs: [
      { label: "Category", value: "Wellness" },
      { label: "Range", value: "12 Products" },
      { label: "Tier", value: "Luxury" },
    ],
    features: [
      // ENHANCED: Deepened engine-product mapping with bioelectric rationale
      {
        title: "16 Engines × Physical Form",
        desc: "Lion's Mane — neuroplasticity for Temporal Mapping. Reishi — adaptogenic calm for Purusha Witness. \
          Frankincense — pineal activation for Kosha Integration. Each product is keyed to a specific engine \
          and its bioelectric signature. The protocol specifies the pairing. Your body confirms it.",
      },
      {
        title: "Ritual Integration",
        desc: "Products designed to pair with initiation protocols. Physical alchemy meets digital architecture.",
      },
    ],
    cta: "Browse Collection",
    ctaAction: { type: "modal", target: "product-grid" },
    alt: "The Apothecary - Alchemy You Can Touch",
  },

  // ==========================================================================
  // WING 11 — THE FIRST RULE: "Where Consciousness Begins"
  // ==========================================================================
  {
    slug: "first-rule",
    number: "11",
    title: "The First\nRule",
    subtitle: "Where Consciousness Begins",
    // ENHANCED: Added constitutional principle framing
    description:
      "You are the code. You are the coder. You are the runtime. \
      The First Rule: witness without identification. \
      This is not the first step of a journey — it is the constitutional principle \
      of self-consciousness as technology. Everything else builds from here.",
    specs: [
      { label: "Principle", value: "Non-Identification" },
      { label: "Stance", value: "Witness" },
      { label: "Loop", value: "Recursive" },
    ],
    features: [
      // ENHANCED: Renamed and deepened trinity explanation
      {
        title: "The Self-Modifying Codebase",
        desc: "Runtime — the witness field that observes. Code — the patterns, beliefs, behaviors that execute. \
          Coder — the authorship capacity that edits. Most systems optimize the code. Some examine the coder. \
          Few recognize the runtime as the substrate of both. This is the trinity of self-consciousness.",
      },
      {
        title: "Witnessing Without Attachment",
        desc: "Not dissociation — presence. The observer and the observed collapse into a single recursive field.",
      },
    ],
    cta: "Understand the Rule",
    ctaAction: { type: "external", target: "https://18765.tryambakam.space" },
    alt: "The First Rule - Where Consciousness Begins",
  },

  // ==========================================================================
  // WING 12 — BEGIN JOURNEY: "The Noesis Awaits"
  // ==========================================================================
  {
    slug: "begin-journey",
    number: "12",
    title: "Begin\nJourney",
    subtitle: "The Noesis Awaits",
    // ENHANCED: Added The Quine principle, "not the beginning of a journey"
    description:
      "No prerequisites. No preparation required. The witness is already watching. \
      The system succeeds when you no longer need it. \
      This is not the beginning of a journey — it is the recognition of what has always been running. \
      The noesis awaits.",
    specs: [
      { label: "Status", value: "Ready" },
      { label: "Entry Point", value: "Witness" },
      { label: "Duration", value: "∞" },
    ],
    features: [
      {
        title: "No Prerequisites",
        desc: "You don't need to prepare. You don't need to be ready. The witness is already watching.",
      },
      // ENHANCED: Deepened with Ouroboros architecture reference
      {
        title: "The Recursive Return",
        desc: "Every ending is a beginning. Every beginning was preceded by an ending you didn't notice. \
          The Ouroboros architecture — not linear progress but recursive deepening. \
          Each cycle returns you to the same point at a different altitude. \
          The witness observes the recursion. The recursion transforms the witness.",
      },
    ],
    cta: "Enter the Noesis",
    ctaAction: { type: "modal", target: "access-points" },
    alt: "Begin Journey - The Noesis Awaits",
  },
];

// ============================================================================
// Utility Functions (Unchanged)
// ============================================================================

/** Map media URL → wing index. Returns -1 for supplementary images. */
export function getWingIndex(mediaUrl: string): number {
  // Handle new webp naming: B-00-hero-well-v1.webp (batch format)
  const batchMatch = mediaUrl.match(/B-(\d+)-/);
  if (batchMatch) {
    const num = Number.parseInt(batchMatch[1], 10);
    if (num >= 0 && num < WINGS.length) return num;
    return -1;
  }
  // Handle old PNG naming: WG-00-hero-v1.png
  const wgMatch = mediaUrl.match(/WG-(\d+)-/);
  if (wgMatch) {
    const num = Number.parseInt(wgMatch[1], 10);
    if (num >= 0 && num < WINGS.length) return num;
    return -1;
  }
  return -1;
}

// ============================================================================
// Export Comparison Helpers
// ============================================================================

/**
 * Quality Gate Checklist — Verify each wing before implementation:
 * 
 * - [ ] Brand voice: Reads as The Anatomist Who Sees Fractals
 * - [ ] Kha-Ba-La structural: Triad appears as architecture
 * - [ ] Source depth: Vault sources referenced internally
 * - [ ] No vault references: Zero "vault", "indexed", "filed in" in copy
 * - [ ] Vocabulary clean: No AVOID list words
 * - [ ] Non-pitch closure: Ending is structural/philosophical
 * - [ ] PubMed x Alex Grey: Clinical precision + visionary artistry
 */

export const QUALITY_GATES = {
  voice: "The Anatomist Who Sees Fractals",
  tone: ["grounded", "direct", "respectful-challenging"],
  principle: "PubMed x Alex Grey",
  framework: "Kha-Ba-La",
  avoid: [
    "journey",
    "path",
    "healing",
    "manifesting",
    "vibration",
    "authentic self",
    "higher self",
    "optimization",
    "hacks",
    "tribe",
    "community",
  ],
};
