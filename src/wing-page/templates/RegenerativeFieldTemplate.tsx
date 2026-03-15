import * as React from "react";
import { dispatchCTA } from "../../utils/cta-actions";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./regenerative.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function RegenerativeFieldTemplate({ wing, imageUrl, onClose }: Props) {
  const handleCTA = React.useCallback(() => {
    dispatchCTA(wing.ctaAction, { openModal: () => onClose(), onClose });
  }, [wing.ctaAction, onClose]);
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div className={styles.regenContainer}>
      {/* Background radial geometry and gradient base */}
      <div className={styles.biofieldMap} />
      <div className={styles.concentricRing} style={{ width: "40vw", height: "40vw" }} />
      <div className={styles.concentricRing} style={{ width: "60vw", height: "60vw" }} />
      <div className={styles.concentricRing} style={{ width: "80vw", height: "80vw" }} />

      <header className={styles.header}>
        <div className={styles.phaseIndicator}>PHASE {wing.number}</div>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          END FIELD
        </button>
      </header>

      <main className={styles.coreField}>
        {/* Central visual core */}
        <div className={styles.imageCore}>
          <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.artImage} />
        </div>

        {/* Orbiting content structures based on nested divs */}
        <div className={styles.orbitData}>
          <h1 className={styles.fieldTitle}>
            {wing.title.split("\n").map((word, i) => (
              <span key={i} className={styles.titleWord}>
                {word}
              </span>
            ))}
          </h1>
          <h2 className={styles.fieldSubtitle}>{wing.subtitle}</h2>

          {/* biome-ignore lint/a11y/useSemanticElements: button cannot contain block-level p/svg/div children */}
          <div
            className={styles.thesisContainer}
            role="button"
            tabIndex={0}
            aria-expanded={expanded}
            aria-label={`${wing.title.replace("\n", " ")} — click to ${expanded ? "collapse" : "expand"} coherence triad`}
            onClick={() => setExpanded((prev) => !prev)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setExpanded((prev) => !prev);
              }
            }}
          >
            <p className={styles.thesisText}>{wing.description}</p>
            <svg className={styles.hrvWaveform} viewBox="0 0 200 40" preserveAspectRatio="none" aria-hidden="true">
              {/* Synthetic subtle HRV waveform */}
              <path
                d="M0,20 L30,20 L40,0 L50,40 L60,10 L70,20 L200,20"
                fill="none"
                stroke="var(--color-coherence-emerald)"
                strokeWidth="1"
              />
            </svg>
            <p className={styles.thesisText} style={{ opacity: 0.7 }}>
              {wing.features[0]?.desc ??
                "Your sovereignty is the first constitutional principle. Inhale is input. Exhale is output. The gap is processing."}
            </p>

            {expanded && (
              <div className={styles.coherenceExpanded}>
                <div className={styles.coherenceHeading}>COHERENCE TRIAD</div>

                <div className={`${styles.triadItem} ${styles.triadKha}`}>
                  <span className={`${styles.triadLabel} ${styles.triadLabelKha}`}>Kha — Observer Field</span>
                  The witness position. Engine consultations reveal patterns without distorting them. Consciousness tracking
                  measures the observer's depth.
                </div>

                <div className={`${styles.triadItem} ${styles.triadBa}`}>
                  <span className={`${styles.triadLabel} ${styles.triadLabelBa}`}>Ba — Body as Instrument</span>
                  The somatic interface. Breath ratios, HRV biometrics, and .init protocols make the body a precision instrument
                  for reading reality.
                </div>

                <div className={`${styles.triadItem} ${styles.triadLa}`}>
                  <span className={`${styles.triadLabel} ${styles.triadLabelLa}`}>La — Field Resistance</span>
                  The necessary friction. Biorhythm-synchronized delivery ensures you don't consume faster than you integrate. The
                  difficulty IS the practice.
                </div>

                <div className={styles.collapseHint}>Click to collapse</div>
              </div>
            )}
          </div>

          <div className={styles.specsBlock}>
            {wing.specs.map((spec) => (
              <div key={spec.label} className={styles.specItem}>
                <span className={styles.specLabel}>{spec.label}</span>
                <span className={styles.specValue}>{spec.value}</span>
              </div>
            ))}
          </div>

          <div className={styles.glassFeatureCards}>
            {wing.features.map((f) => (
              <div key={f.title} className={styles.glassCard}>
                <div className={styles.cardTitle}>{f.title}</div>
                <div className={styles.cardDesc}>{f.desc}</div>
              </div>
            ))}
          </div>

          <button type="button" className={styles.breathCta} onClick={handleCTA}>
            <span className={styles.ctaText}>{wing.cta}</span>
            <div className={styles.breathRings} />
          </button>
        </div>
      </main>
    </div>
  );
}

export default RegenerativeFieldTemplate;
