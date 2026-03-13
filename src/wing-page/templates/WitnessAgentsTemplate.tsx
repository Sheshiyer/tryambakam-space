import * as React from "react";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./witness-agents.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

/* ── Kha / Ba expanded content for dual-lane hover ── */

const PICHET_DETAILS = {
  archetype: "KHA (Spirit) — The Structuralist",
  capabilities: [
    "Pattern Recognition — identifies symbolic-computational lenses across 16 engines",
    "Symbolic Architecture — constructs meaning from birth data, planetary positions, and archetypal numbers",
    "Consciousness Level Tracking — witnesses the observer observing",
  ],
  stance: "Sees the pattern. Measures it. Maps it. Never distorts it.",
} as const;

const ALETHEOS_DETAILS = {
  archetype: "BA (Body) — The Emergent",
  capabilities: [
    "Embodied Witness — the body as reading instrument, not just data source",
    "Somatic Truth — what the flesh knows before the mind categorizes",
    "Field Resonance — bioelectric patterns in the subtle body",
  ],
  stance: "Walks the pattern. Feels it. Becomes it. Never intellectualizes it.",
} as const;

export function WitnessAgentsTemplate({ wing, imageUrl, onClose }: Props) {
  const [activePane, setActivePane] = React.useState<"none" | "pichet" | "aletheos">("none");

  const pichet = wing.features[0];
  const aletheos = wing.features[1];

  return (
    <div className={styles.dualContainer} data-active={activePane}>
      {/* Visually-hidden h1 for correct heading hierarchy (pane h2s come after) */}
      <h1 className="sr-only">{wing.title.replace("\n", " ")}</h1>

      {/* Top overlay bar */}
      <header className={styles.topOverlay}>
        <span className={styles.wingLabel}>
          {wing.number} — {wing.subtitle}
        </span>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          ESC
        </button>
      </header>

      {/* W07-T01: Left/Right dual-lane architecture */}
      <div className={styles.splitPane}>
        {/* Pichet — Structure (Left) */}
        <div
          className={styles.panePichet}
          onMouseEnter={() => setActivePane("pichet")}
          onMouseLeave={() => setActivePane("none")}
          onFocus={() => setActivePane("pichet")}
          onBlur={() => setActivePane("none")}
          role="region"
          aria-label="Pichet — The Structuralist"
        >
          {/* W07-T04: Rigid grid matrix background */}
          <div className={styles.gridMatrix} aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => (
              <div key={`grid-${i.toString()}`} className={styles.gridCell} />
            ))}
          </div>

          <div className={styles.paneContent}>
            <div className={styles.agentPortrait}>
              <ProgressiveImage src="/images/agents/agent-pichet.png" alt="Pichet - The Structuralist" className={styles.portraitImage} />
            </div>
            <h2 className={styles.pichetTitle}>{pichet?.title}</h2>
            <p className={styles.pichetDesc}>{pichet?.desc}</p>
            <div className={styles.specRow}>
              <span className={styles.specKey}>{wing.specs[0]?.label}</span>
              <span className={styles.specVal}>{wing.specs[0]?.value}</span>
            </div>

            {activePane === "pichet" && (
              <div className={styles.expandedContent}>
                <span className={styles.archetypeLabel}>{PICHET_DETAILS.archetype}</span>
                <ul className={`${styles.capList} ${styles.capListIndigo}`}>
                  {PICHET_DETAILS.capabilities.map((cap) => (
                    <li key={cap}>{cap}</li>
                  ))}
                </ul>
                <p className={styles.stance}>{PICHET_DETAILS.stance}</p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.centerGutter}>
          {/* W07-T07: Interference shader at centerline */}
          <div className={styles.interference} />

          <svg className={styles.ringMotif} viewBox="0 0 60 120" fill="none">
            <title>Interlocking rings representing dual witness mode</title>
            <circle cx="30" cy="40" r="20" stroke="var(--color-flow-indigo, #0b50fb)" strokeWidth="1" opacity="0.6" />
            <circle cx="30" cy="80" r="20" stroke="var(--color-witness-violet, #7c3aed)" strokeWidth="1" opacity="0.6" />
            {/* Overlap area */}
            <line x1="30" y1="0" x2="30" y2="120" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </svg>

          <span className={styles.gutterSpec}>
            {wing.specs[2]?.label}: {wing.specs[2]?.value}
          </span>
        </div>

        {/* Aletheos — Flow (Right) */}
        <div
          className={styles.paneAletheos}
          onMouseEnter={() => setActivePane("aletheos")}
          onMouseLeave={() => setActivePane("none")}
          onFocus={() => setActivePane("aletheos")}
          onBlur={() => setActivePane("none")}
          role="region"
          aria-label="Aletheos — The Emergent"
        >
          {/* W07-T04: Organic bezier curves */}
          <svg className={styles.flowCurves} viewBox="0 0 400 600" preserveAspectRatio="none" aria-hidden="true">
            <title>Organic flow curves</title>
            <path
              d="M 0 0 C 200 100, 100 300, 400 400 C 200 500, 300 550, 0 600"
              fill="none"
              stroke="var(--color-witness-violet, #7c3aed)"
              strokeWidth="0.5"
              opacity="0.15"
            />
            <path
              d="M 50 0 C 250 150, 50 350, 350 500 C 150 550, 250 580, 50 600"
              fill="none"
              stroke="var(--color-witness-violet, #7c3aed)"
              strokeWidth="0.5"
              opacity="0.1"
            />
          </svg>

          <div className={styles.paneContent}>
            <div className={styles.agentPortrait}>
              <ProgressiveImage src="/images/agents/agent-aletheos.png" alt="Aletheos - The Emergent" className={styles.portraitImage} />
            </div>
            <h2 className={styles.aletheosTitle}>{aletheos?.title}</h2>
            <p className={styles.aletheosDesc}>{aletheos?.desc}</p>
            <div className={styles.specRow}>
              <span className={styles.specKey}>{wing.specs[1]?.label}</span>
              <span className={styles.specVal}>{wing.specs[1]?.value}</span>
            </div>

            {activePane === "aletheos" && (
              <div className={styles.expandedContent}>
                <span className={styles.archetypeLabel}>{ALETHEOS_DETAILS.archetype}</span>
                <ul className={`${styles.capList} ${styles.capListViolet}`}>
                  {ALETHEOS_DETAILS.capabilities.map((cap) => (
                    <li key={cap}>{cap}</li>
                  ))}
                </ul>
                <p className={styles.stance}>{ALETHEOS_DETAILS.stance}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Shared thesis + artwork + CTA */}
      <footer className={styles.bottomBar}>
        <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.footerArt} />
        <div className={styles.footerContent}>
          <h2 className={styles.mainTitle}>{wing.title.replace("\n", " ")}</h2>
          <p className={styles.thesis}>{wing.description}</p>
          <button type="button" className={styles.ctaBtn} onClick={onClose}>
            {wing.cta}
          </button>
        </div>
      </footer>
    </div>
  );
}

export default WitnessAgentsTemplate;
