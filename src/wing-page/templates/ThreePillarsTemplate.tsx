import * as React from "react";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./three-pillars.module.css";

const PILLAR_DETAILS = [
  {
    label: "KHA — SPIRIT — OBSERVER",
    items: [
      "Engine consultations — 16 symbolic-computational lenses",
      "Witness prompts — observing the observer",
      "Consciousness level tracking — depth metrics",
      "Pattern recognition across temporal, spatial, energetic data",
    ],
  },
  {
    label: "BA — BODY — EMBODIMENT",
    items: [
      ".init protocols — 16 micro-rituals across 4 spins",
      "Physical ritual objects — sacred burnables, orgonite, attars",
      "Breath ratios — inhale is input, exhale is output",
      "HRV biometrics — heart rate variability as coherence measure",
    ],
  },
  {
    label: "LA — FRICTION — FORM",
    items: [
      "Biorhythm-synchronized delivery — content arrives when you're ready",
      "Progressive initiation — 4 spins from Entry to Independence",
      "Three-Wave Cycle — physical, emotional, intellectual timing",
      "The difficulty is the practice. The practice is the point.",
    ],
  },
];

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function ThreePillarsTemplate({ wing, imageUrl, onClose }: Props) {
  const [expandedPillar, setExpandedPillar] = React.useState<number | null>(null);

  const togglePillar = (index: number) => {
    setExpandedPillar((prev) => (prev === index ? null : index));
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      togglePillar(index);
    }
  };

  // We have exactly 3 specs which map beautifully to our 3 Pillars
  const pillars = wing.specs.map((spec) => spec.value);

  return (
    <div className={styles.triptychContainer}>
      <h1 className="sr-only">{wing.title.replace("\n", " ")}</h1>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          {wing.number} {"//"} {wing.title.replace("\n", " ")}
        </div>
        <button type="button" onClick={onClose} className={styles.closeBtn}>
          RETURN
        </button>
      </header>

      {/* SVG Trinity Connection Lines at the top */}
      <svg className={styles.trinityLines} viewBox="0 0 100 20" preserveAspectRatio="none">
        <title>Trinity connection lines linking the three pillars</title>
        <path
          d="M 16.6 20 L 16.6 5 L 83.3 5 L 83.3 20"
          fill="none"
          stroke="var(--color-sacred-gold)"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <path d="M 50 5 L 50 20" fill="none" stroke="var(--color-sacred-gold)" strokeWidth="0.5" opacity="0.3" />
        <circle cx="16.6" cy="20" r="1.5" fill="var(--color-sacred-gold)" />
        <circle cx="50" cy="20" r="1.5" fill="var(--color-sacred-gold)" />
        <circle cx="83.3" cy="20" r="1.5" fill="var(--color-sacred-gold)" />
      </svg>

      <div className={styles.pillarsWrapper}>
        {/* PILLAR 1: Kha (Spirit) */}
        {/* biome-ignore lint/a11y/useSemanticElements: Pillar is a composite disclosure widget, not a simple button */}
        <div
          className={styles.pillar}
          onClick={() => togglePillar(0)}
          onKeyDown={(e) => handleKeyDown(e, 0)}
          role="button"
          tabIndex={0}
          aria-expanded={expandedPillar === 0}
          aria-label={`Kha pillar — ${pillars[0] ?? "Spirit"} — click to ${expandedPillar === 0 ? "collapse" : "expand"}`}
        >
          <div className={styles.pillarNum}>I</div>
          <h2 className={styles.pillarTitle}>{pillars[0]}</h2>

          <div className={styles.pillarArt}>
            <ProgressiveImage src="/images/pillars/pillar-vedic-v1.png" alt="Vedic Intelligence - Sri Yantra and Jyotisha" className={styles.pillarImage} />
          </div>

          <div className={styles.verticalText}>
            <p>KHA (SPIRIT)</p>
          </div>

          <div className={styles.featureCross}>
            <h3>Observer</h3>
            <p>Sees the pattern. Engine consultations, witness prompts, consciousness level tracking.</p>
          </div>

          {expandedPillar === 0 && (
            <div className={styles.pillarExpanded}>
              <div className={styles.pillarExpandLabel}>{PILLAR_DETAILS[0].label}</div>
              <ul className={styles.pillarExpandList}>
                {PILLAR_DETAILS[0].items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* PILLAR 2: Ba (Body) */}
        {/* biome-ignore lint/a11y/useSemanticElements: Pillar is a composite disclosure widget, not a simple button */}
        <div
          className={styles.pillar}
          onClick={() => togglePillar(1)}
          onKeyDown={(e) => handleKeyDown(e, 1)}
          role="button"
          tabIndex={0}
          aria-expanded={expandedPillar === 1}
          aria-label={`Ba pillar — ${pillars[1] ?? "Body"} — click to ${expandedPillar === 1 ? "collapse" : "expand"}`}
        >
          <div className={styles.pillarNum}>II</div>
          <h2 className={styles.pillarTitle}>{pillars[1]}</h2>

          <div className={styles.centerArt}>
            <ProgressiveImage src={imageUrl} alt={wing.title} className={styles.triptychImage} />
          </div>

          <div className={styles.starkThesis}>{wing.description}</div>

          <div className={styles.featureCross}>
            <h3>Embodiment</h3>
            <p>Walks the pattern. .init protocols, physical ritual objects, breath ratios, HRV biometrics.</p>
          </div>

          {expandedPillar === 1 && (
            <div className={styles.pillarExpanded}>
              <div className={styles.pillarExpandLabel}>{PILLAR_DETAILS[1].label}</div>
              <ul className={styles.pillarExpandList}>
                {PILLAR_DETAILS[1].items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <button type="button" className={styles.exploreBtn} onClick={onClose}>
            {wing.cta}
          </button>
        </div>

        {/* PILLAR 3: La (Inertia) */}
        {/* biome-ignore lint/a11y/useSemanticElements: Pillar is a composite disclosure widget, not a simple button */}
        <div
          className={styles.pillar}
          onClick={() => togglePillar(2)}
          onKeyDown={(e) => handleKeyDown(e, 2)}
          role="button"
          tabIndex={0}
          aria-expanded={expandedPillar === 2}
          aria-label={`La pillar — ${pillars[2] ?? "Friction"} — click to ${expandedPillar === 2 ? "collapse" : "expand"}`}
        >
          <div className={styles.pillarNum}>III</div>
          <h2 className={styles.pillarTitle}>{pillars[2]}</h2>

          <div className={styles.pillarArt}>
            <ProgressiveImage src="/images/pillars/pillar-sonic-v1.png" alt="Biofield and Sonic - Raga frequencies" className={styles.pillarImage} />
          </div>

          <div className={styles.verticalText}>
            <p>KHA-BA-LA FRAMEWORK</p>
          </div>

          <div className={styles.featureCross} style={{ marginTop: "auto" }}>
            <h3>Friction</h3>
            <p>Gives the pattern form. Biorhythm-synchronized delivery, progressive initiation.</p>
          </div>

          {expandedPillar === 2 && (
            <div className={styles.pillarExpanded}>
              <div className={styles.pillarExpandLabel}>{PILLAR_DETAILS[2].label}</div>
              <ul className={styles.pillarExpandList}>
                {PILLAR_DETAILS[2].items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ThreePillarsTemplate;
