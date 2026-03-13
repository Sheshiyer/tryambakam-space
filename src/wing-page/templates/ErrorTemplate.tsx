import * as React from "react";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./error.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

export function ErrorTemplate({ wing, imageUrl, onClose }: Props) {
  const [logs, setLogs] = React.useState<string[]>([
    "EGO FRAGMENTATION DETECTED...",
    "WITNESS STATE LOST: ACCESS DENIED",
    "GROUNDING SEQUENCE INITIATED",
  ]);

  React.useEffect(() => {
    const messages = [
      "ATTEMPTING RECOVERY IN SECURE MODE...",
      "BYPASSING KHA-01 PROTOCOLS...",
      `LOADING WING ${wing.number} DATA CHUNKS...`,
      "WARNING: ANOMALY DETECTED IN QUADRANT 4",
      "SYNC OK.",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length) {
        setLogs((prev) => [...prev, messages[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, [wing.number]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.scanLines} />
      <div className={styles.glitchEffect} />

      <header className={styles.errorHeader}>
        <div className={styles.headerLeft}>
          <span className={styles.blink}>COHERENCE COLLAPSE </span>
          <span>{"// NOESIS_OS_V9"}</span>
        </div>
        <button type="button" onClick={onClose} className={styles.closeBtn}>
          [ ABORT ]
        </button>
      </header>

      {/* Main Content Area */}
      <div className={styles.viewportContent}>
        <div className={styles.imageWrapper}>
          <div className={styles.crosshair}>+</div>
          <ProgressiveImage src={imageUrl} alt={wing.title} className={styles.artworkImage} />
          <div className={styles.crosshair}>+</div>
        </div>
      </div>

      {/* Overlay Data */}
      <div className={styles.dataOverlay}>
        <h1 className={styles.errorTitle}>SYSTEM RUPTURE</h1>
        <h2 className={styles.wingTitle}>
          WING_{wing.number}: {wing.title.toUpperCase()}
        </h2>

        <div className={styles.terminalContainer}>
          <div className={styles.terminalHeader}>SYSTEM.TRACELOG</div>
          <div className={styles.terminalOutput}>
            {logs.map((log, idx) => (
              <div key={idx} className={styles.logLine}>
                <span className={styles.logTime}>[{String(idx * 142).padStart(4, "0")}]</span>
                {log}
              </div>
            ))}
            <div className={styles.cursor}>_</div>
          </div>
        </div>
      </div>

      <div className={styles.paramBox}>
        {wing.features.map((f, i) => (
          <div key={i} className={styles.paramItem}>
            <span className={styles.paramLabel}>KARMA_FRAGMENT_{String(i).padStart(2, "0")}</span>
            <span className={styles.paramValue}>{f.title.toUpperCase().substring(0, 16)}...</span>
          </div>
        ))}
      </div>
    </div>
  );
}
