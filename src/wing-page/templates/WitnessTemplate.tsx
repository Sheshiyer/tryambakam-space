import * as React from "react";
import { dispatchCTA } from "../../utils/cta-actions";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./witness.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function WitnessTemplate({ wing, imageUrl, onClose }: Props) {
  const handleCTA = React.useCallback(() => {
    dispatchCTA(wing.ctaAction, { openModal: () => onClose(), onClose });
  }, [wing.ctaAction, onClose]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Used for parallax and scroll effects
    <div
      className={styles.witnessContainer}
      onScroll={handleScroll}
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Geometry Fragmented Vectors */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`${styles.egoFragment} ${isHovered ? styles.aligned : ""}`}
          style={{
            top: `${15 + i * 15}%`,
            left: `${(i % 2 === 0 ? 10 : 80) + i * 2}%`,
            transform: isHovered
              ? `translate(-50%, -50%) rotate(0deg)`
              : `translate(-50%, -50%) rotate(${i * 45}deg) scale(${1 + i * 0.2})`,
            opacity: isHovered ? 0.3 : 0.1,
          }}
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="var(--color-witness-violet)" strokeWidth="1" aria-hidden="true">
            <polygon points="50,10 90,90 10,90" />
            <circle cx="50" cy="65" r="15" />
          </svg>
        </div>
      ))}

      {/* Floating HUD Specs */}
      <div className={styles.hudSpecs}>
        {wing.specs.map((spec) => (
          <div key={spec.label} className={styles.hudCoord}>
            <span className={styles.hudLabel}>{spec.label}:</span>
            <span className={styles.hudValue}>{spec.value}</span>
          </div>
        ))}
      </div>

      <button type="button" onClick={onClose} className={styles.closeBtn}>
        ABORT WITNESS
      </button>

      {/* Central Observer Pattern grid */}
      <div className={styles.observerGrid}>
        <div className={styles.visualFrame}>
          <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.artworkImage} />
        </div>

        <div className={styles.contentFrame}>
          <h1 className={styles.title}>{wing.title}</h1>
          <div className={styles.subtitle}>{wing.subtitle}</div>

          {/* Scroll-driven Opacity Text */}
          <div
            className={styles.psychText}
            style={{
              opacity: Math.max(0.1, 1 - scrollY / 300),
              transform: `translateY(${scrollY * 0.1}px)`,
            }}
          >
            {wing.description}
          </div>

          <ul className={styles.features}>
            {wing.features.map((f, i) => (
              <li key={f.title} className={styles.featureBlock}>
                <h2 className={`${styles.featureTitle} ${i === 0 ? styles.ghostText : ""}`}>{f.title}</h2>
                {i === 1 ? <p className={styles.typewriter}>{f.desc}</p> : <p className={styles.featureDesc}>{f.desc}</p>}
              </li>
            ))}
          </ul>

          <button type="button" className={styles.ctaButton} onClick={handleCTA}>
            {wing.cta}
          </button>
        </div>
      </div>
    </div>
  );
}

export default WitnessTemplate;
