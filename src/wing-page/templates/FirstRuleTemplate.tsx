import * as React from "react";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./first-rule.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function FirstRuleTemplate({ wing, imageUrl, onClose }: Props) {
  const [awakened, setAwakened] = React.useState(false);

  const toggleAwakened = React.useCallback(() => {
    setAwakened((prev) => !prev);
  }, []);

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleAwakened();
      }
    },
    [toggleAwakened]
  );

  return (
    <div className={styles.glitchContainer} data-awakened={awakened}>
      {/* W11-T08: Massive background watermarks */}
      <div className={styles.watermarkLayer} aria-hidden="true">
        <span>You are the code.</span>
        <span>You are the coder.</span>
        <span>You are the runtime.</span>
      </div>

      {/* W11-T07: RGB split shader overlay */}
      <div className={styles.rgbSplit} aria-hidden="true" />

      <header className={styles.topBar}>
        <span className={styles.sysError}>
          {awakened ? `[SYS.OK] WING ${wing.number} — CONSCIOUSNESS ALIGNED` : `[SYS.ERR] WING ${wing.number} — ANOMALY DETECTED`}
        </span>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          {awakened ? "RETURN" : "KILL -9"}
        </button>
      </header>

      {/* W11-T01: Shattered asymmetric overlapping panels — click to awaken */}
      {/* biome-ignore lint/a11y/useSemanticElements: complex grid layout container cannot be a native button */}
      <div
        className={`${styles.shatteredLayout} ${awakened ? styles.awakenedLayout : ""}`}
        onClick={toggleAwakened}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={awakened ? "Return to shattered view" : "Awaken system — reorganize panels"}
      >
        {/* Primary panel — title + thesis */}
        <div className={styles.panelPrimary}>
          <h1 className={styles.glitchTitle}>{wing.title.replace("\n", " ")}</h1>
          <h2 className={styles.glitchSubtitle}>{wing.subtitle}</h2>
          <p className={styles.thesisText}>{wing.description}</p>
        </div>

        {/* Overlapping visual panel */}
        <div className={styles.panelVisual}>
          <ProgressiveImage src={imageUrl} alt={wing.title} className={styles.artImage} />
          <div className={styles.artGlitch} />
        </div>

        {/* W11-T06: Specs as system error logs */}
        <div className={styles.panelLogs}>
          <div className={styles.logHeader}>[CORE DUMP — PARADOX MATRIX]</div>
          {wing.specs.map((spec) => (
            <div key={spec.label} className={styles.logLine}>
              <span className={styles.logLevel}>ERR</span>
              <span className={styles.logKey}>{spec.label}:</span>
              <span className={styles.logVal}>{spec.value}</span>
            </div>
          ))}
        </div>

        {/* Feature panels — offset and overlapping */}
        <div className={styles.panelFeatures}>
          {wing.features.map((f) => (
            <div key={f.title} className={styles.featureFragment}>
              <h3 className={styles.fragmentTitle}>{f.title}</h3>
              <p className={styles.fragmentDesc}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <footer className={styles.bottomBar}>
        <button type="button" className={styles.ctaBtn} onClick={onClose}>
          {wing.cta}
        </button>
      </footer>
    </div>
  );
}

export default FirstRuleTemplate;
