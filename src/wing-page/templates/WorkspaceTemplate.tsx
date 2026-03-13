import * as React from "react";
import { Modal } from "../../components/Modal";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./workspace.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function WorkspaceTemplate({ wing, imageUrl, onClose }: Props) {
  const [witnessDepth, setWitnessDepth] = React.useState(75);
  const [compassBias, setCompassBias] = React.useState(124);
  const [fieldScale, setFieldScale] = React.useState(42);
  const [showTUI, setShowTUI] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = React.useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  return (
    <div className={styles.workspaceContainer}>
      <header className={styles.headerHud}>
        <div className={styles.hudItem}>
          <span style={{ color: "white", marginRight: "10px" }}>TRYAMBAKAM</span> CONSCIOUSNESS PHASE: PRACTICING
        </div>
        <div className={`${styles.hudItem} ${styles.hudCenter}`}>{`${wing.title.toUpperCase()} // KHA-BA-LA CORE`}</div>
        <div className={`${styles.hudItem} ${styles.hudRight}`}>
          <button type="button" onClick={onClose} className={styles.closeBtn}>
            ✕ CLOSE
          </button>
        </div>
      </header>

      <div className={styles.scanLines} />

      {/* Replace 3D canvas with 2D Artwork */}
      <div className={styles.viewportCanvas}>
        <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.artworkImage} />
      </div>

      {/* Floating Left: Features */}
      <div className={`${styles.floatingPanel} ${styles.toolPalette}`}>
        <div className={styles.panelHeader}>
          <span>Manifestations</span>
          <span>01</span>
        </div>
        <div className={styles.featureList}>
          {wing.features.map((f, i) => (
            <div key={i} className={styles.featureItem}>
              <strong>{f.title}</strong>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Right: Specs / Parameters */}
      <div className={`${styles.floatingPanel} ${styles.paramsPanel}`}>
        <div className={styles.panelHeader}>
          <span>Tattva Parameters</span>
          <span>{wing.number}</span>
        </div>

        {wing.specs[0] && (
          <div className={styles.controlGroup}>
            <div className={styles.labelRow}>
              <span>{wing.specs[0].label.toUpperCase()}</span>
              <span>{wing.specs[0].value.replace(/\D/g, "") || (witnessDepth / 100).toFixed(2)}</span>
            </div>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="100"
              value={witnessDepth}
              onChange={(e) => setWitnessDepth(Number(e.target.value))}
              aria-label={wing.specs[0]?.label ?? "Witness depth"}
            />
          </div>
        )}

        {wing.specs[1] && (
          <div className={styles.controlGroup}>
            <div className={styles.labelRow}>
              <span>{wing.specs[1].label.toUpperCase()}</span>
              <span>{wing.specs[1].value.replace(/\D/g, "") || (compassBias / 100).toFixed(2)}</span>
            </div>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="200"
              value={compassBias}
              onChange={(e) => setCompassBias(Number(e.target.value))}
              aria-label={wing.specs[1]?.label ?? "Compass bias"}
            />
          </div>
        )}

        {wing.specs[2] && (
          <div className={styles.controlGroup}>
            <div className={styles.labelRow}>
              <span>{wing.specs[2].label.toUpperCase()}</span>
              <span>{wing.specs[2].value.replace(/\D/g, "") || (fieldScale / 100).toFixed(2)}</span>
            </div>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="100"
              value={fieldScale}
              onChange={(e) => setFieldScale(Number(e.target.value))}
              aria-label={wing.specs[2]?.label ?? "Field scale"}
            />
          </div>
        )}

        <div className={styles.panelHeader} style={{ borderTop: "1px solid var(--border-color)" }}>
          <span>Observer State</span>
        </div>
        <div style={{ padding: "16px", display: "flex", gap: "8px" }}>
          <button type="button" className={styles.booleanBtn} onClick={() => setShowTUI(true)}>
            LAUNCH TUI
          </button>
          <button type="button" className={styles.booleanBtn} onClick={onClose}>
            MERGE
          </button>
        </div>
      </div>

      <div className={styles.viewportLabels}>
        <span className={styles.statusPill}>KHA-BA-LA ACTIVE</span>
        WING: {wing.number} | TITLE: {wing.title.replace("\n", " ").toUpperCase()} | FIELD: COHERENT
      </div>

      {/* Timeline / Description */}
      <div className={styles.timelineContainer}>
        <div className={styles.panelHeader}>
          <span>Karmic Trajectory</span>
          <span>SESSION DEPTH: ACTIVE</span>
        </div>
        <div className={styles.timelineTrack}>
          <div className={styles.historyNode}>ENTRY</div>
          <div className={styles.timelineLine} />
          <div className={styles.historyNode}>CULTIVATION</div>
          <div className={styles.timelineLine} />
          <div className={`${styles.historyNode} ${styles.historyActive}`}>INTEGRATION</div>
          <div className={styles.timelineLine} />
          <div className={styles.historyNode} style={{ opacity: 0.4 }}>
            INDEPENDENCE
          </div>
        </div>
      </div>

      <Modal open={showTUI} onClose={() => setShowTUI(false)} title="NOESIS TUI" maxWidth={520}>
        <div className={styles.tuiModal}>
          <p className={styles.tuiIntro}>Access the Noesis consciousness architecture system from your terminal.</p>

          <div className={styles.installBlock}>
            <div className={styles.installLabel}>INSTALL VIA CARGO</div>
            <div className={styles.codeBlock}>
              <code>cargo install noesis</code>
              <button type="button" className={styles.copyBtn} onClick={() => handleCopy("cargo install noesis")}>
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          <div className={styles.installBlock}>
            <div className={styles.installLabel}>OR VIA PIP</div>
            <div className={styles.codeBlock}>
              <code>pip install noesis-tui</code>
              <button type="button" className={styles.copyBtn} onClick={() => handleCopy("pip install noesis-tui")}>
                {copied ? "COPIED" : "COPY"}
              </button>
            </div>
          </div>

          <div className={styles.tuiFeatures}>
            <h3>What You Get</h3>
            <ul>
              <li>16 engine consultations from the command line</li>
              <li>.init protocol runner with breath timing</li>
              <li>Compass orientation and biorhythm sync</li>
              <li>Full Kha-Ba-La framework navigation</li>
            </ul>
          </div>

          <a href="https://selemene.tryambakam.space" target="_blank" rel="noopener noreferrer" className={styles.selemeneLink}>
            Or access via Selemene API →
          </a>
        </div>
      </Modal>
    </div>
  );
}
