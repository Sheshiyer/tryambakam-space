import * as React from "react";
import { Modal } from "../../components/Modal";
import { ENGINES, type Engine } from "../../data/engines";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./matrix.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function EngineMatrixTemplate({ wing, imageUrl, onClose }: Props) {
  const [hoveredCell, setHoveredCell] = React.useState<number | null>(null);
  const [selectedEngine, setSelectedEngine] = React.useState<Engine | null>(null);

  // Row and Col calc for intersection lines
  const hoverRow = hoveredCell ? Math.floor((hoveredCell - 1) / 4) : null;
  const hoverCol = hoveredCell ? (hoveredCell - 1) % 4 : null;

  return (
    <div className={styles.matrixContainer}>
      {/* Background artwork with heavy contrast */}
      <div className={styles.bgWrapper}>
        <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.bgImage} />
        <div className={styles.bgOverlay} />
      </div>

      <header className={styles.topNav}>
        <div className={styles.sysText}>[ CORE ] NOESIS_ENGINE v1.0</div>
        <button type="button" onClick={onClose} className={styles.escapeBtn}>
          ESCAPE
        </button>
      </header>

      <main className={styles.layoutSplit}>
        {/* Left Side: The 4x4 Engine Grid */}
        <section className={styles.gridSection}>
          <div className={styles.gridWrapper}>
            <div className={styles.interferenceLayer} />
            <div className={styles.matrix4x4}>
              {ENGINES.map((engine, idx) => {
                const row = Math.floor(idx / 4);
                const col = idx % 4;
                const isIntersectX = hoverRow === row;
                const isIntersectY = hoverCol === col;
                const isSelf = hoveredCell === engine.id;

                return (
                  // biome-ignore lint/a11y/useSemanticElements: Grid cell with complex flex layout; button resets would break styling
                  <div
                    key={engine.id}
                    className={`${styles.engineCell} ${isSelf ? styles.activeCell : ""}`}
                    onMouseEnter={() => setHoveredCell(engine.id)}
                    onMouseLeave={() => setHoveredCell(null)}
                    onClick={() => setSelectedEngine(engine)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedEngine(engine);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                  >
                    <span className={styles.categoryBadge}>{engine.category === "Rust Core" ? "RS" : "TS"}</span>
                    <div className={styles.dirLabel}>{engine.compassLabel}</div>
                    <div className={styles.engineId}>E-{engine.id.toString().padStart(2, "0")}</div>
                    <div className={styles.engineName}>{engine.name}</div>

                    {/* Intersection Highlight Lines */}
                    <div className={`${styles.intersectLineX} ${isIntersectX ? styles.lineVisible : ""}`} />
                    <div className={`${styles.intersectLineY} ${isIntersectY ? styles.lineVisible : ""}`} />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Right Side: Terminal Data */}
        <aside className={styles.dataSection}>
          <h1 className={styles.pageTitle}>{wing.title.split("\n").join(" ")}</h1>
          <h2 className={styles.pageSubtitle}>:: {wing.subtitle}</h2>

          <div className={styles.cliReadout}>
            <div className={styles.cliLine}>&gt; initializing 16 symbolic-computational lenses...</div>
            <div className={styles.cliLine}>&gt; mapping 256 permutations — 16 engines × 4 compass directions</div>
            <div className={styles.cliLine}>&gt; {wing.description}</div>
          </div>

          <div className={styles.specTable}>
            <div className={styles.specHeader}>SYSTEM_SPECS</div>
            {wing.specs.map((spec) => (
              <div key={spec.label} className={styles.specRow}>
                <span className={styles.specKey}>{spec.label}</span>
                <span className={styles.specValue}>{spec.value}</span>
              </div>
            ))}
          </div>

          <div className={styles.dynamicFeatures}>
            <div className={styles.specHeader} style={{ marginTop: "40px" }}>
              ACTIVE_LOGS
            </div>
            {wing.features.map((f) => (
              <div key={f.title} className={styles.cliBlock}>
                <div className={styles.cliTypewriter}>[LOG] {f.title}</div>
                <div className={styles.cliDesc}>-- {f.desc}</div>
              </div>
            ))}
          </div>
        </aside>
      </main>

      <Modal open={!!selectedEngine} onClose={() => setSelectedEngine(null)} title={selectedEngine?.name ?? ""} maxWidth={520}>
        {selectedEngine && (
          <div className={styles.engineModal}>
            <div className={styles.engineBadge}>
              <span className={styles.engineCat}>{selectedEngine.category}</span>
              <span className={styles.engineDir}>
                {selectedEngine.compassDirection} — {selectedEngine.compassLabel}
              </span>
            </div>
            <h3>What It Computes</h3>
            <p>{selectedEngine.whatItComputes}</p>
            <h3>Kosha Layer</h3>
            <p>{selectedEngine.koshaLayer}</p>
            <a href="/#sixteen-engines" className={styles.selemeneLink}>
              View all 16 engines →
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EngineMatrixTemplate;
