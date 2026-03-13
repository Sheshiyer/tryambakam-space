import * as React from "react";
import { Modal } from "../../components/Modal";
import { getCurrentSpin, PROTOCOLS } from "../../data/protocols";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./init.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function InitTemplate({ wing, imageUrl, onClose }: Props) {
  const [progress, setProgress] = React.useState(0);
  const [showProtocol, setShowProtocol] = React.useState(false);
  const [currentProtocol] = React.useState(1);
  const protocol = PROTOCOLS[currentProtocol - 1];
  const spin = getCurrentSpin(currentProtocol);

  React.useEffect(() => {
    const duration = 2000;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setProgress(Math.min((currentStep / steps) * 100, 100));
      if (currentStep >= steps) clearInterval(interval);
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => setShowProtocol(true), 600);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  return (
    <div className={styles.initContainer}>
      <header className={styles.topBar}>
        <div className={styles.sysInfo}>
          TRYAMBAKAM NOESIS [KERNEL]
          <span className={styles.separator}>{"//"}</span>
          ALIGNING BIO-FIELD...
        </div>
        <button type="button" onClick={onClose} className={styles.closeBtn}>
          [ EXIT ]
        </button>
      </header>

      <div className={styles.matrixBg}>
        <div className={styles.codeColumn} style={{ left: "10%", animationDelay: "0s" }}>
          01010011 01011001 01010011
        </div>
        <div className={styles.codeColumn} style={{ left: "30%", animationDelay: "2s" }}>
          01001001 01001110 01001001
        </div>
        <div className={styles.codeColumn} style={{ left: "50%", animationDelay: "1s" }}>
          01010100 01001001 01000001
        </div>
        <div className={styles.codeColumn} style={{ left: "70%", animationDelay: "3s" }}>
          01010100 01000101 00100000
        </div>
        <div className={styles.codeColumn} style={{ left: "90%", animationDelay: "0.5s" }}>
          01010011 01011001 01010011
        </div>
      </div>

      <div className={styles.centerConsole}>
        <div className={styles.imageBox}>
          <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.artworkImage} style={{ opacity: progress / 100 }} />
          <div className={styles.overlayText}>{progress < 100 ? "DECRYPTING KARMA..." : "PRANA MERGED"}</div>
        </div>

        <div className={styles.statusPanel}>
          <h1 className={styles.title}>LOADING {wing.title.toUpperCase()}...</h1>

          <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuenow={Math.floor(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Wing loading progress"
          >
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.progressText}>{Math.floor(progress)}% COMPLETE</div>

          <div className={styles.loadingLog}>
            <div className={styles.logItem}>&gt; CALIBRATING KHA-BA-LA AXIS... [OK]</div>
            <div className={styles.logItem}>&gt; SYNCHRONIZING BREATH PATTERNS... [OK]</div>
            <div className={styles.logItem}>&gt; VERIFYING CONSCIOUSNESS SIGNATURE... {progress > 50 ? "[OK]" : "[WAIT]"}</div>
            <div className={styles.logItem}>
              &gt; LOADING WING {wing.number} PROTOCOLS... {progress > 80 ? "[OK]" : "[WAIT]"}
            </div>
            <div className={styles.logItem}>&gt; {progress === 100 ? "SYSTEM READY." : "PROCESSING..."}</div>
          </div>

          {progress === 100 && (
            <button type="button" className={styles.enterBtn} onClick={() => setShowProtocol(true)}>
              BEGIN PROTOCOL ▸
            </button>
          )}
        </div>
      </div>

      <div className={styles.specsSidebar}>
        <div className={styles.sideHeader}>WING PARAMS</div>
        {wing.specs.map((spec) => (
          <div key={spec.label} className={styles.specRow}>
            <span className={styles.specKey}>{spec.label}</span>
            <span className={styles.specVal}>{spec.value}</span>
          </div>
        ))}
        <div className={styles.sideHeader} style={{ marginTop: "20px" }}>
          FEATURES LOADED
        </div>
        {wing.features.map((f) => (
          <div
            key={f.title}
            className={styles.specRow}
            style={{ borderBottom: "none", flexDirection: "column", alignItems: "flex-start" }}
          >
            <span className={styles.specKey}>&gt; {f.title}</span>
            <span className={styles.specVal} style={{ fontSize: "0.6rem", opacity: 0.65, marginTop: "2px" }}>
              {f.desc}
            </span>
          </div>
        ))}
      </div>

      <Modal
        open={showProtocol}
        onClose={() => {
          setShowProtocol(false);
          onClose();
        }}
        title={`PROTOCOL ${protocol?.number ?? 1}`}
        maxWidth={500}
      >
        {protocol && spin && (
          <div className={styles.protocolModal}>
            <div className={styles.spinBadge}>
              SPIN: {spin.name.toUpperCase()} ({spin.range})
            </div>
            <h3>{protocol.title}</h3>
            <p className={styles.protocolPurpose}>{protocol.purpose}</p>
            <div className={styles.protocolElements}>
              <span className={styles.elementsLabel}>ELEMENTS</span>
              <p>{protocol.elements}</p>
            </div>
            <button type="button" className={styles.beginBtn} onClick={onClose}>
              BEGIN PROTOCOL →
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default InitTemplate;
