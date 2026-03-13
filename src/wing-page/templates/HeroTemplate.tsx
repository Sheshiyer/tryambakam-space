import * as React from "react";
import { Modal } from "../../components/Modal";
import { dispatchCTA } from "../../utils/cta-actions";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./hero.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function HeroTemplate({ wing, imageUrl, onClose }: Props) {
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [showDonation, setShowDonation] = React.useState(false);

  const handleCTA = React.useCallback(() => {
    dispatchCTA(wing.ctaAction, { openModal: (id) => console.log("modal:", id), onClose });
  }, [wing.ctaAction, onClose]);

  const handleMouseMove = React.useCallback((e: React.MouseEvent) => {
    // Calculate normalized mouse position relative to center (-1 to 1)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    setMousePos({ x, y });
  }, []);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: Used purely for aesthetic background parallax
    <div className={styles.heroContainer} onMouseMove={handleMouseMove}>
      {/* Sacred Geometry Resonance background */}
      <div
        className={styles.sriYantra}
        style={{
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -15}px) scale(1.1)`,
        }}
      >
        <svg viewBox="0 0 100 100" fill="none" opacity="0.05" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="50" cy="50" r="45" stroke="var(--color-sacred-gold)" strokeWidth="0.5" />
          <polygon points="50,15 80,75 20,75" stroke="var(--color-sacred-gold)" strokeWidth="0.5" />
          <polygon points="50,85 80,25 20,25" stroke="var(--color-sacred-gold)" strokeWidth="0.5" />
        </svg>
      </div>
      {/* Navigation */}
      <nav className={styles.navBar}>
        <div className={styles.navLogo}>
          <span className={styles.logoMark}>TN</span>
          <span className={styles.logoText}>TRYAMBAKAM NOESIS</span>
        </div>
        <div className={styles.navLinks}>
          <button type="button" onClick={() => setShowDonation(true)} className={styles.navLink}>
            Observe Void
          </button>
          <button type="button" className={styles.navLink} onClick={onClose}>
            The Noesis
          </button>
          <button type="button" className={styles.navBtn} onClick={onClose}>
            Access {wing.number}
          </button>
        </div>
      </nav>

      {/* Main Hero Layout */}
      <main className={styles.heroMain}>
        {/* Left Column: Typography & Content */}
        <div className={styles.contentCol}>
          <div className={styles.eyebrow}>
            <span className={styles.pulseDot} />
            KHA-BA-LA ROOT {wing.number}
          </div>

          <h1 className={styles.heroHeadline}>
            {wing.title.split("\n").map((line, i) => (
              <span key={i} className={styles.headlineLine}>
                {line.toUpperCase()}
              </span>
            ))}
          </h1>

          <div className={styles.heroSubhead}>
            {wing.description.split(" ").map((word, i) => (
              <span key={i} style={{ "--index": i } as React.CSSProperties} className={styles.staggerWord}>
                {word}&nbsp;
              </span>
            ))}
          </div>

          <div className={styles.actionGroup}>
            <button type="button" className={styles.primaryAction} onClick={handleCTA}>
              {wing.cta}
            </button>
            <button type="button" className={styles.secondaryAction} onClick={handleCTA}>
              Explore Plane
            </button>
          </div>

          <div className={styles.specsGrid}>
            {wing.specs.slice(0, 3).map((spec) => (
              <div key={spec.label} className={styles.specItem}>
                <div className={styles.specValue}>{spec.value}</div>
                <div className={styles.specLabel}>{spec.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Visualizer */}
        <div className={styles.visualCol}>
          <div className={styles.visualWrapper}>
            {/* Abstract background elements */}
            <div
              className={styles.abstractBlob}
              style={{
                top: "10%",
                right: "10%",
                background: "linear-gradient(45deg, var(--color-void-black), var(--color-witness-violet))",
              }}
            />
            <div
              className={styles.abstractBlob}
              style={{
                bottom: "10%",
                left: "10%",
                background: "linear-gradient(45deg, var(--color-flow-indigo), var(--color-void-black))",
              }}
            />

            {/* The actual Artwork */}
            <div className={styles.renderContainer}>
              <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.heroImage} />
            </div>

            {/* Overlay UI elements */}
            <div className={styles.glassBadge} style={{ top: "30px", left: "-20px" }}>
              <span className={styles.badgeLabel}>RESONANCE</span>
              <span className={styles.badgeValue}>STABLE</span>
            </div>

            <div className={styles.glassBadge} style={{ bottom: "40px", right: "-10px" }}>
              <span className={styles.badgeLabel}>KOSHA LAYER</span>
              <span className={styles.badgeValue}>{wing.number}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Value Prop Strip (using Features) */}
      <section className={styles.featureStrip}>
        {wing.features.slice(0, 3).map((f, i) => (
          <div key={i} className={styles.featurePill}>
            <div className={styles.featureIcon}>0{i + 1}</div>
            <div className={styles.featureText}>{f.title}</div>
          </div>
        ))}
      </section>

      {/* Donation / Investment in Sovereignty Modal */}
      <Modal open={showDonation} onClose={() => setShowDonation(false)} title="INVESTMENT IN SOVEREIGNTY" maxWidth={600}>
        <div className={styles.donationModal}>
          <h2 className={styles.donationHeadline}>Pay What This Is Worth to Your Becoming</h2>

          <p className={styles.donationBody}>
            Tryambakam Noesis is free to enter. Investment reflects commitment&nbsp;&mdash; not to the system, but to your own
            authorship.
          </p>

          <p className={styles.donationPhilosophy}>
            Not Subscription. Not Purchase. Not Payment. This is investment in your own sovereignty.
          </p>

          <div className={styles.tierGrid}>
            <div className={styles.tierCard}>
              <span className={styles.tierName}>Free Tier</span>
              <span className={styles.tierPrice}>$0</span>
              <span className={styles.tierDesc}>
                All digital access&nbsp;&mdash; 16&nbsp;engines, Somatic Canticles, .init&nbsp;Protocols,
                The&nbsp;Plumber&nbsp;&mdash; permanently available at no cost.
              </span>
            </div>

            <div className={styles.tierCard}>
              <span className={styles.tierName}>Sustaining</span>
              <span className={styles.tierPrice}>$10 – $50 / mo</span>
              <span className={styles.tierDesc}>Covers operational infrastructure. Keeps the system sovereign and ad-free.</span>
            </div>

            <div className={styles.tierCard}>
              <span className={styles.tierName}>Physical Products</span>
              <span className={styles.tierPrice}>Varies</span>
              <span className={styles.tierDesc}>Material costs are real. Bronze, leather, sacred blends.</span>
            </div>

            <div className={styles.tierCard}>
              <span className={styles.tierName}>Mentorship</span>
              <span className={styles.tierPrice}>Application</span>
              <span className={styles.tierDesc}>Time is finite. 5–10&nbsp;slots. Application required.</span>
            </div>
          </div>

          <p className={styles.donationClosing}>You know what this is worth. Honor that knowing.</p>

          <button type="button" className={styles.donationClose} onClick={() => setShowDonation(false)}>
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default HeroTemplate;
