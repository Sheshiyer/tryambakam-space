import * as React from "react";
import { dispatchCTA } from "../../utils/cta-actions";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./infinite-treasure.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

const QUADRANT_COLORS = ["stabilize", "heal", "create", "mutate"] as const;
const QUADRANT_LABELS = ["Dharma", "Artha", "Kama", "Moksha"];

const QUADRANT_DETAILS: {
  direction: string;
  subtitle: string;
  bullets: string[];
}[] = [
  {
    direction: "N — STABILIZE",
    subtitle: "Duty & Foundation",
    bullets: [
      "Temporal Grammar — five-fold calendar for auspicious timing",
      "Birth chart architecture — life structure mapping",
      "Numeric Architecture — archetypal patterns in birth data",
    ],
  },
  {
    direction: "E — HEAL",
    subtitle: "Prosperity & Restoration",
    bullets: [
      "Chronofield — 120-year planetary period mapping",
      "Biorhythm healing — Three-Wave Cycle calibration",
      "Circadian Cartography — organ activation timing",
    ],
  },
  {
    direction: "S — CREATE",
    subtitle: "Desire & Manifestation",
    bullets: [
      "Sigil Forge — symbolic geometry creation",
      "Resonance Architecture — sound as computational substrate",
      "Geometric Resonance — mathematical symmetry tools",
    ],
  },
  {
    direction: "W — MUTATE",
    subtitle: "Liberation & Transformation",
    bullets: [
      "Gift-Shadow Spectrum — developmental arc mapping",
      "Active Planetary Weather — transit analysis",
      "Nine-Point Architecture — fixation-to-essence movement",
    ],
  },
];

export function InfiniteTreasureTemplate({ wing, imageUrl, onClose }: Props) {
  const handleCTA = React.useCallback(() => {
    dispatchCTA(wing.ctaAction, { openModal: () => onClose(), onClose });
  }, [wing.ctaAction, onClose]);
  const [zoomedQuadrant, setZoomedQuadrant] = React.useState<number | null>(null);

  const handleQuadrantClick = (index: number) => {
    setZoomedQuadrant((prev) => (prev === index ? null : index));
  };

  return (
    <div className={styles.treasureContainer}>
      {/* W09-T04: Central compass rose overlay */}
      <div className={styles.compassOverlay}>
        <svg className={styles.compassRose} viewBox="0 0 200 200" fill="none">
          <title>Compass rose mapping four quadrants</title>
          <circle cx="100" cy="100" r="60" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="30" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
          <line x1="100" y1="20" x2="100" y2="180" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          <line x1="20" y1="100" x2="180" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          {/* Cardinal points */}
          <polygon points="100,25 105,40 95,40" fill="rgba(255,255,255,0.08)" />
          <polygon points="175,100 160,105 160,95" fill="rgba(255,255,255,0.08)" />
          <polygon points="100,175 95,160 105,160" fill="rgba(255,255,255,0.08)" />
          <polygon points="25,100 40,95 40,105" fill="rgba(255,255,255,0.08)" />
          {/* Cardinal direction labels */}
          <text x="100" y="18" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="SF Mono, monospace">
            STABILIZE
          </text>
          <text x="188" y="103" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="SF Mono, monospace">
            HEAL
          </text>
          <text x="100" y="192" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="SF Mono, monospace">
            CREATE
          </text>
          <text x="14" y="103" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="6" fontFamily="SF Mono, monospace">
            MUTATE
          </text>
        </svg>

        {/* Artwork at compass center */}
        <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.compassArt} />
      </div>

      {/* W09-T07: Ambient distortion from center */}
      <div className={styles.ambientDistortion} />

      {/* Header */}
      <header className={styles.topBar}>
        <span className={styles.wingLabel}>
          {wing.number} — {wing.subtitle}
        </span>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          ESC
        </button>
      </header>

      {/* W09-T01: Four-Quadrant 2×2 grid */}
      <div className={styles.quadGrid}>
        {QUADRANT_LABELS.map((label, i) => (
          <button
            key={label}
            type="button"
            className={`${styles.quadrant} ${styles[QUADRANT_COLORS[i]]} ${zoomedQuadrant === i ? styles.expanded : ""}`}
            onClick={() => handleQuadrantClick(i)}
            aria-expanded={zoomedQuadrant === i}
          >
            <span className={styles.quadLabel}>{label}</span>
            <span className={styles.quadDirection}>{QUADRANT_DETAILS[i].direction}</span>
            {wing.specs[i] && (
              <span className={styles.quadSpec}>
                {wing.specs[i].label}: {wing.specs[i].value}
              </span>
            )}
            {zoomedQuadrant === i && (
              <div className={styles.drillDown}>
                <h4 className={styles.drillTitle}>{QUADRANT_DETAILS[i].subtitle}</h4>
                <ul className={styles.drillList}>
                  {QUADRANT_DETAILS[i].bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* W09-T06: Floating data boxes around 2×2 */}
      <div className={styles.floatingSpecs}>
        {wing.features.map((f) => (
          <div key={f.title} className={styles.floatingBox}>
            <strong>{f.title}</strong>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Bottom: thesis + CTA */}
      <footer className={styles.bottomThesis}>
        <h1 className={styles.mainTitle}>{wing.title.replace("\n", " ")}</h1>
        <p className={styles.thesis}>{wing.description}</p>
        <button type="button" className={styles.ctaBtn} onClick={handleCTA}>
          {wing.cta}
        </button>
      </footer>
    </div>
  );
}

export default InfiniteTreasureTemplate;
