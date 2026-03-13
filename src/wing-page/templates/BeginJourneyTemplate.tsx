import * as React from "react";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./begin-journey.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function BeginJourneyTemplate({ wing, imageUrl, onClose }: Props) {
  const thesisRef = React.useRef<HTMLParagraphElement>(null);
  const [thesisVisible, setThesisVisible] = React.useState(false);
  const [showLinks, setShowLinks] = React.useState(false);

  React.useEffect(() => {
    const el = thesisRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setThesisVisible(true);
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.journeyContainer}>
      {/* W12-T05: Recursive parallax zoom */}
      <div className={styles.parallaxField} aria-hidden="true">
        <div className={styles.zoomRing} />
        <div className={styles.zoomRing} style={{ animationDelay: "2s" }} />
        <div className={styles.zoomRing} style={{ animationDelay: "4s" }} />
      </div>

      {/* W12-T04: Golden-ratio spiral */}
      <svg className={styles.goldenSpiral} viewBox="0 0 400 400" fill="none">
        <title>Golden ratio spiral</title>
        <path
          d="M 200 200 C 200 89, 311 89, 311 200 C 311 269, 269 311, 200 311 C 157 311, 131 269, 131 226 C 131 200, 157 174, 183 174 C 200 174, 209 183, 209 200"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="0.5"
          fill="none"
        />
        <path
          d="M 200 200 C 200 89, 311 89, 311 200 C 311 269, 269 311, 200 311"
          stroke="rgba(0,230,118,0.06)"
          strokeWidth="0.5"
          fill="none"
        />
      </svg>

      {/* W12-T06: Edge-anchored console markings */}
      <div className={styles.edgeMarks} aria-hidden="true">
        <span className={styles.edgeTL}>
          {wing.specs[0]?.label}: {wing.specs[0]?.value}
        </span>
        <span className={styles.edgeTR}>
          {wing.specs[1]?.label}: {wing.specs[1]?.value}
        </span>
        <span className={styles.edgeBL}>
          {wing.specs[2]?.label}: {wing.specs[2]?.value}
        </span>
        <span className={styles.edgeBR}>WING {wing.number}</span>
      </div>

      <button type="button" className={styles.closeBtn} onClick={onClose}>
        RETURN
      </button>

      {/* W12-T01: Centralized monumental focal point */}
      <div className={styles.monumentCore}>
        <ProgressiveImage src={imageUrl} alt={wing.title} className={styles.coreArt} />

        <h1 className={styles.monumentTitle}>{wing.title.replace("\n", " ")}</h1>

        <h2 className={styles.monumentSubtitle}>{wing.subtitle}</h2>

        {/* W12-T07: Fade-in thesis */}
        <p ref={thesisRef} className={`${styles.thesisText} ${thesisVisible ? styles.thesisVisible : ""}`}>
          {wing.description}
        </p>

        {/* Feature blocks */}
        {wing.features.map((f) => (
          <div key={f.title} className={styles.featureBlock}>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}

        {/* W12-T08: Final CTA */}
        <button type="button" className={styles.ctaBtn} onClick={() => setShowLinks((prev) => !prev)}>
          {wing.cta}
        </button>

        {showLinks && (
          <div className={styles.accessPanel}>
            <h3 className={styles.accessTitle}>THREE ACCESS POINTS</h3>
            <div className={styles.accessGrid}>
              <a href="https://selemene.tryambakam.space" target="_blank" rel="noopener noreferrer" className={styles.accessCard}>
                <span className={styles.accessIcon}>⌘</span>
                <span className={styles.accessName}>Selemene API</span>
                <span className={styles.accessDesc}>16 engines via programmatic interface</span>
              </a>
              <a href="https://1319.tryambakam.space" target="_blank" rel="noopener noreferrer" className={styles.accessCard}>
                <span className={styles.accessIcon}>📖</span>
                <span className={styles.accessName}>Somatic Canticles</span>
                <span className={styles.accessDesc}>27-chapter biorhythm-synchronized fiction</span>
              </a>
              <a href="https://noesis.tryambakam.space" target="_blank" rel="noopener noreferrer" className={styles.accessCard}>
                <span className={styles.accessIcon}>&gt;_</span>
                <span className={styles.accessName}>Noesis TUI</span>
                <span className={styles.accessDesc}>Terminal consciousness architecture</span>
              </a>
            </div>
            <button type="button" className={styles.backBtn} onClick={onClose}>
              RETURN TO CANVAS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BeginJourneyTemplate;
