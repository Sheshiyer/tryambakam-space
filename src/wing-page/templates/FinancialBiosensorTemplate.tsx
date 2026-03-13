import * as React from "react";
import { ProgressiveImage } from "../components/ProgressiveImage";
import type { WingData } from "../data";
import styles from "./financial.module.css";

type Props = {
  wing: WingData;
  imageUrl: string;
  onClose: () => void;
};

const COHERENCE_WAVE = [42, 58, 67, 73, 65, 52, 48, 55, 71, 82, 78, 63, 51, 47, 53, 68, 76, 84, 79, 61, 49, 44, 56, 69];

const TATTVA_CYCLE = ["AKASHA · ETHER", "VAYU · AIR", "TEJAS · FIRE", "APAS · WATER", "PRITHVI · EARTH"] as const;

const SPEC_VALUES = ["0.8742", "0.6218", "0.9156"];

const GANTT_TRACKS = [
  { width: "65%", left: "5%" },
  { width: "45%", left: "15%" },
  { width: "75%", left: "2%" },
];

export function FinancialBiosensorTemplate({ wing, imageUrl, onClose }: Props) {
  const [tick, setTick] = React.useState(0);
  const [coherence, setCoherence] = React.useState<number[]>(COHERENCE_WAVE);
  const tickRef = React.useRef(0);

  React.useEffect(() => {
    // Deterministic live tick mimicking financial streams
    const interval = setInterval(() => {
      tickRef.current += 1;
      setTick((prev) => (prev + 1) % 100);
      setCoherence((prev) => {
        const next = [...prev.slice(1), COHERENCE_WAVE[tickRef.current % COHERENCE_WAVE.length]];
        return next;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const sparklinePath = coherence.map((val, i) => `${i === 0 ? "M" : "L"} ${(i / 23) * 100},${100 - val}`).join(" ");

  return (
    <div className={styles.terminalContainer}>
      <div className={styles.crtScanline} />

      <header className={styles.topBar}>
        <div className={styles.tickerTape}>
          <span>SYS.COH {coherence[coherence.length - 1]}%</span>
          <span className={styles.tickGlow}>▲</span>
          <span style={{ marginLeft: 20 }}>TATTVA.CYCLE [{TATTVA_CYCLE[tick % 5]}]</span>
          <span style={{ marginLeft: 20 }}>DAILY DECISION INDEX</span>
        </div>
        <button type="button" className={styles.closeBtn} onClick={onClose}>
          TERMINATE [X]
        </button>
      </header>

      <div className={styles.sysGrid}>
        {/* Left Column: Thesis & Visual */}
        <aside className={styles.leftCol}>
          <h1 className={styles.terminalTitle}>{wing.title.replace("\n", " ")}</h1>
          <h2 className={styles.terminalSubtitle}>
            &gt; {wing.subtitle}_<span className={styles.cursor}>█</span>
          </h2>

          <div className={styles.visualFrame}>
            <ProgressiveImage src={imageUrl} alt={wing.alt} className={styles.terminalArt} />
            <div className={styles.artOverlay}>
              <div className={styles.crosshair} />
            </div>
          </div>

          <div className={styles.thesisBlock}>
            <p>{wing.description}</p>
            <button type="button" className={styles.actBtn} onClick={onClose}>
              {wing.cta}
            </button>
          </div>
        </aside>

        {/* Right Column: Dense Data & Timelines */}
        <main className={styles.rightCol}>
          {/* Coherence Forecast Sparkline */}
          <div className={styles.dataModule}>
            <div className={styles.moduleHeader}>
              <span>7-DAY ROLLING COHERENCE FORECAST</span>
              <span>LIVE</span>
            </div>
            <div className={styles.sparklineContainer}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.sparklineSvg}>
                <title>7-day rolling coherence forecast sparkline</title>
                <path d={sparklinePath} fill="none" stroke="var(--color-coherence-emerald)" strokeWidth="1" />
                {/* Fill gradient below sparkline */}
                <path d={`${sparklinePath} L 100,100 L 0,100 Z`} fill="url(#emeraldGrad)" opacity="0.1" />
                <defs>
                  <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-coherence-emerald)" stopOpacity="1" />
                    <stop offset="100%" stopColor="var(--color-coherence-emerald)" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
              <div
                className={styles.sparklineMarker}
                style={{ left: "100%", top: `${100 - coherence[coherence.length - 1]}%` }}
              />
            </div>
          </div>

          {/* Specifications Table */}
          <div className={styles.dataModule}>
            <div className={styles.moduleHeader}>SENSOR I/O MULTIPLEX</div>
            <table className={styles.dataTable} aria-label="Sensor I/O Multiplex specifications">
              <thead className="sr-only">
                <tr>
                  <th scope="col">Parameter</th>
                  <th scope="col">Value</th>
                  <th scope="col">Coefficient</th>
                </tr>
              </thead>{" "}
              <tbody>
                {wing.specs.map((spec, i) => (
                  <tr key={spec.label} className={i % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                    <td>{spec.label}</td>
                    <td className={styles.dataHighlight}>{spec.value}</td>
                    <td>{SPEC_VALUES[i % 3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* W06-T06: Temporal Decision Windows (Gantt style) */}
          <div className={styles.dataModule}>
            <div className={styles.moduleHeader}>TEMPORAL DECISION WINDOWS</div>
            <div className={styles.ganttContainer}>
              {wing.features.map((f, i) => (
                <div key={f.title} className={styles.ganttRow}>
                  <div className={styles.ganttLabel}>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                  <div className={styles.ganttTrack}>
                    <div
                      className={styles.ganttBlock}
                      style={{ width: GANTT_TRACKS[i % 3].width, left: GANTT_TRACKS[i % 3].left }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default FinancialBiosensorTemplate;
