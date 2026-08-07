import * as React from "react";
import manifest from "~/src/artworks/manifest.json";
import { CTAModalHost } from "~/src/components/CTAModalHost";
import { createCTACallbacks, dispatchCTA, getCTAHref } from "~/src/utils/cta-actions";
import { WingPage } from "~/src/wing-page";
import { WINGS } from "~/src/wing-page/data";
import styles from "./linear-mode.module.css";

export function LinearMode({ forcedFallback = false }: { forcedFallback?: boolean }) {
  const [activeWing, setActiveWing] = React.useState<string | null>(() => window.location.hash.slice(1) || null);

  React.useEffect(() => {
    const handler = () => setActiveWing(window.location.hash.slice(1) || null);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  const currentWingIndex = WINGS.findIndex((w) => w.slug === activeWing);
  const wing = currentWingIndex !== -1 ? WINGS[currentWingIndex] : null;
  const wingImage = currentWingIndex !== -1 ? manifest[currentWingIndex]?.url : "";

  const handleClose = React.useCallback(() => {
    window.location.hash = "";
  }, []);

  const handleCTA = React.useCallback((wing: (typeof WINGS)[number]) => {
    dispatchCTA(wing.ctaAction, createCTACallbacks());
  }, []);

  if (wing) {
    return (
      <>
        <CTAModalHost />
        <WingPage wing={wing} imageUrl={wingImage ?? ""} open onClose={handleClose} />
      </>
    );
  }

  return (
    <>
      <CTAModalHost />
      <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.eyebrow}>{forcedFallback ? "Linear View Active" : "Linear Interface"}</span>
          <h1>TRYAMBAKAM NOESIS</h1>
          <p className={styles.lead}>
            {forcedFallback
              ? "The immersive canvas could not start here, so this calm linear view keeps every wing available."
              : "A structured index of the 13 wings. Click any card to enter its page."}
          </p>
          <a href="/" className={styles.returnLink}>
            {forcedFallback ? "Retry Canvas" : "Return to Canvas"}
          </a>
        </div>
      </header>

      <main className={styles.grid}>
        {WINGS.map((wing, index) => {
          const isFeatured = index === 0 || index === 4 || index === 9;
          const imageUrl = manifest[index]?.url;
          return (
            <article
              key={wing.slug}
              className={`${styles.card} ${isFeatured ? styles.cardWide : ""}`}
              style={{ "--index": index } as React.CSSProperties}
            >
              {imageUrl && (
                <div className={styles.cardMedia}>
                  <img src={imageUrl} alt="" loading="lazy" />
                  <div className={styles.mediaOverlay} />
                </div>
              )}
              <div className={styles.cardBody}>
                <div className={styles.cardHeader}>
                  <span className={styles.number}>{wing.number}</span>
                  <h2>{wing.title.replaceAll("\n", " ")}</h2>
                </div>
                <p className={styles.subtitle}>{wing.subtitle}</p>
                <p className={styles.description}>{wing.description}</p>

                <a
                  href={getCTAHref(wing.ctaAction)}
                  className={styles.link}
                  target={wing.ctaAction.type === "external" ? "_blank" : undefined}
                  rel={wing.ctaAction.type === "external" ? "noopener noreferrer" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    handleCTA(wing);
                  }}
                >
                  {wing.cta}
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>

                {wing.specs.length > 0 && (
                  <div className={styles.details}>
                    <h4>Parameters</h4>
                    <ul>
                      {wing.specs.slice(0, 3).map((spec) => (
                        <li key={spec.label}>
                          <span className={styles.detailLabel}>{spec.label}</span>
                          <span className={styles.detailValue}>{spec.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </main>

      <footer className={styles.footer}>
        <p>Tryambakam Noesis — Self-Consciousness as Technology</p>
      </footer>
      </div>
    </>
  );
}
