import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./gallery.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function GalleryTemplate({ wing, imageUrl, onClose }: Props) {
  return (
    <div className={styles.galleryContainer}>
      <header className={styles.topNav}>
        <div className={styles.navLeft}>
          <span className={styles.logo}>[TN]</span> KNOWLEDGE_WELL
        </div>
        <div className={styles.navCenter}>WING_{wing.number}</div>
        <button type="button" onClick={onClose} className={styles.closeBtn}>
          CLOSE ✕
        </button>
      </header>

      <div className={styles.gridOverlay} />

      <main className={styles.galleryMain}>
        {/* Left Col: Info */}
        <section className={styles.infoCol}>
          <div className={styles.infoBlock}>
            <div className={styles.blockTitle}>ARCHETYPE</div>
            <h1 className={styles.subjectTitle}>{wing.title}</h1>
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.blockTitle}>DESCRIPTION</div>
            <p className={styles.descText}>{wing.description}</p>
          </div>

          <div className={styles.infoBlock}>
            <div className={styles.blockTitle}>DIMENSIONS</div>
            {wing.specs.map((spec) => (
              <div key={spec.label} className={styles.propRow}>
                <span>{spec.label}</span>
                <span>{spec.value}</span>
              </div>
            ))}
          </div>

          <div className={styles.btnWrapper}>
            <button type="button" className={styles.primaryBtn}>
              {wing.cta}
            </button>
          </div>
        </section>

        {/* Center Col: Main Artifact */}
        <section className={styles.artifactCol}>
          <div className={styles.artifactFrame}>
            <div className={styles.frameMarkers}>
              <span className={styles.tl} />
              <span className={styles.tr} />
              <span className={styles.bl} />
              <span className={styles.br} />
            </div>

            <ProgressiveImage src={imageUrl} alt={wing.title} className={styles.mainImage} />

            <div className={styles.artifactLabels}>
              <span>ID: {wing.slug.substring(0, 8).toUpperCase()}</span>
              <span>SCALE: 1.0</span>
              <span>RESONANCE: {wing.number}Hz</span>
            </div>
          </div>
        </section>

        {/* Right Col: Features/Collection */}
        <section className={styles.collectionCol}>
          <div className={styles.collectionHeader}>CONTENTS ({wing.features.length})</div>
          <div className={styles.collectionList}>
            {wing.features.map((f, i) => (
              <div key={i} className={styles.collectionCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardId}>ITM_{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                <p className={styles.cardDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.bottomBar}>
        <span>PRANA: FLOWING</span>
        <span>STATE: WITNESS</span>
      </footer>
    </div>
  );
}
