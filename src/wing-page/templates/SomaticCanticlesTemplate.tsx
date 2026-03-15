import * as React from "react";
import { Modal } from "../../components/Modal";
import { BOOKS, getChaptersByBook } from "../../data/canticles";
import { dispatchCTA } from "../../utils/cta-actions";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./somatic.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

const ROMAN = ["I", "II", "III"] as const;

export function SomaticCanticlesTemplate({ wing, imageUrl, onClose }: Props) {
  const [scrollY, setScrollY] = React.useState(0);
  const [activeBook, setActiveBook] = React.useState(0);

  const handleCTA = React.useCallback(() => {
    dispatchCTA(wing.ctaAction, { openModal: () => onClose(), onClose });
  }, [wing.ctaAction, onClose]);
  const [selectedChapter, setSelectedChapter] = React.useState<{
    bookIndex: number;
    chapterNumber: number;
    title: string;
  } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  // Three-wave cycle based on scroll depth (approx max 800px)
  const syncProgress = Math.min(100, Math.max(0, (scrollY / 600) * 100));

  return (
    <div className={styles.codexContainer} onScroll={handleScroll} ref={containerRef}>
      <div className={styles.vignetteOverlay} />

      {/* FIXED LEFT: Index / Chapter Navigation */}
      <aside className={styles.fixedIndex}>
        <div className={styles.indexHeader}>
          <span className={styles.folioMarker}>VOL. {wing.number}</span>
          <button type="button" onClick={onClose} className={styles.backBtn}>
            CLOSE CODEX
          </button>
        </div>

        <nav className={styles.chapterList}>
          {BOOKS.map((book, i) => (
            <button
              type="button"
              key={book.index}
              className={`${styles.chapterItem} ${i === activeBook ? styles.chapActive : ""}`}
              onClick={() => setActiveBook(i)}
            >
              <div className={styles.bookCoverThumb}>
                <ProgressiveImage src={book.coverUrl} alt={book.title} className={styles.bookThumbImage} />
              </div>
              <div className={styles.bookInfo}>
                <span className={styles.chapNum}>{ROMAN[i]}</span>
                <span className={styles.chapName}>{book.title.toUpperCase()}</span>
              </div>
            </button>
          ))}
        </nav>

        {/* W4C-03: Chapter list for active book */}
        <div className={styles.chapterDetail}>
          {getChaptersByBook(activeBook).map((ch) => (
            <button
              type="button"
              key={`${ch.bookIndex}-${ch.chapterNumber}`}
              className={styles.chapterPill}
              onClick={() => setSelectedChapter(ch)}
            >
              <span className={styles.chNum}>{ch.chapterNumber}</span>
              <span className={styles.chTitle}>{ch.title}</span>
            </button>
          ))}
        </div>

        {/* W05-T05: Three-Wave Cycle Synchronization Indicator */}
        <div className={styles.bioSyncModule}>
          <div className={styles.syncLabel}>THREE-WAVE CYCLE: {Math.floor(syncProgress)}%</div>
          <div className={styles.syncTrack}>
            <div className={styles.syncFill} style={{ width: `${syncProgress}%` }} />
          </div>
          <div className={styles.syncLabel} style={{ fontSize: "0.55rem", marginTop: "4px", opacity: 0.7 }}>
            PHYSICAL · EMOTIONAL · INTELLECTUAL
          </div>
        </div>
      </aside>

      {/* SCROLLING RIGHT: Book Content */}
      <main className={styles.scrollingContent}>
        {/* W05-T04: Geometric Margin Folios */}
        <div className={styles.marginFolio} style={{ top: "100px" }}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="4" stroke="var(--color-sacred-gold)" strokeWidth="1" />
            <line x1="10" y1="0" x2="10" y2="4" stroke="var(--color-sacred-gold)" strokeWidth="1" />
          </svg>
        </div>

        <div className={styles.contentWrapper}>
          <div className={styles.pageHeader}>
            <h1 className={styles.codexTitle}>{wing.title.replace("\n", " ")}</h1>
            <h2 className={styles.codexSubtitle}>{wing.subtitle}</h2>
          </div>

          <div className={styles.artworkBlock}>
            <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.manuscriptArt} />
          </div>

          {/* W05-T08: Prominent Quoted Blockquotes (Aletheia/Lethe narrative) */}
          <blockquote className={styles.prominentQuote}>{wing.description}</blockquote>

          {/* W05-T06: Library Card-Catalog Metadata Blocks */}
          <div className={styles.metadataCards}>
            <div className={styles.cardCatalog}>
              <div className={styles.catalogHeader}>CATALOG SPECS</div>
              {wing.specs.map((spec) => (
                <div key={spec.label} className={styles.catalogRow}>
                  <span className={styles.catalogKey}>{spec.label}</span>
                  <span className={styles.catalogVal}>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.textBody}>
            {wing.features.map((f, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: pure static list
              <div key={i} className={styles.narrativeParagraph}>
                <p>
                  <span className={styles.dropcap}>{f.title.charAt(0)}</span>
                  <strong className={styles.inlineTitle}>{f.title.substring(1)}.</strong> {f.desc}
                </p>
              </div>
            ))}
          </div>

          <div className={styles.footerAction}>
            <button type="button" className={styles.readBtn} onClick={handleCTA}>
              {wing.cta}
            </button>
          </div>
        </div>
      </main>

      {/* W4C-03: Chapter preview modal */}
      <Modal
        open={!!selectedChapter}
        onClose={() => setSelectedChapter(null)}
        title={selectedChapter?.title ?? ""}
        maxWidth={480}
      >
        {selectedChapter && (
          <div className={styles.chapterModal}>
            <div className={styles.chapterModalCover}>
              <ProgressiveImage 
                src={BOOKS[selectedChapter.bookIndex]?.coverUrl ?? ""} 
                alt={BOOKS[selectedChapter.bookIndex]?.title ?? ""} 
                className={styles.modalCoverImage} 
              />
            </div>
            <div className={styles.chapterMeta}>
              Book {ROMAN[selectedChapter.bookIndex]} — Chapter {selectedChapter.chapterNumber}
            </div>
            <p className={styles.chapterTeaser}>{BOOKS[selectedChapter.bookIndex]?.theme}</p>
            <p className={styles.chapterKosha}>{BOOKS[selectedChapter.bookIndex]?.koshaMapping}</p>
            <a href="https://1319.tryambakam.space" target="_blank" rel="noopener noreferrer" className={styles.readLink}>
              READ AT 1319 →
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default SomaticCanticlesTemplate;
