import styles from "./LoadingSkeleton.module.css";

/**
 * Branded loading skeleton for wing-page Suspense fallback.
 *
 * Init-sequence aesthetic: void-black canvas, pulsing placeholder blocks
 * with staggered shimmer, subtle scanline overlay, and "LOADING" monospace label.
 */
export function LoadingSkeleton() {
  return (
    <div className={styles.root} role="status" aria-busy="true" aria-label="Loading wing content">
      {/* Scanline overlay — Init-template aesthetic */}
      <div className={styles.scanlines} />

      {/* Vertical scan beam */}
      <div className={styles.scanBeam}>
        <div className={styles.scanBeamLine} />
      </div>

      {/* Skeleton content placeholders */}
      <div className={styles.content}>
        {/* Title bar */}
        <div className={`${styles.block} ${styles.titleBar}`} />

        {/* Content blocks — staggered widths */}
        <div className={`${styles.block} ${styles.contentBlock1}`} />
        <div className={`${styles.block} ${styles.contentBlock2}`} />
        <div className={`${styles.block} ${styles.contentBlock3}`} />

        {/* CTA placeholder */}
        <div className={`${styles.block} ${styles.ctaBlock}`} />

        {/* Pulsing dot triad */}
        <div className={styles.dotTriad}>
          <div className={`${styles.dot} ${styles.dot1}`} />
          <div className={`${styles.dot} ${styles.dot2}`} />
          <div className={`${styles.dot} ${styles.dot3}`} />
        </div>

        {/* LOADING label */}
        <span className={styles.label}>Loading</span>
      </div>
    </div>
  );
}
