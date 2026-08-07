import * as React from "react";
import { playAudioCue } from "~/src/utils";
import styles from "./terminal-egg.module.css";

function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const segments = [8, 4, 4, 4, 12];
  return segments
    .map((len) =>
      Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
    )
    .join("-");
}

export function TerminalEgg() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([]);
  const [apiKey, setApiKey] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const sequence = React.useRef("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setApiKey(null);
        setCopied(false);
        return;
      }

      const char = e.key.toLowerCase();
      // Allow period and letters
      if (char.length === 1 && char.match(/[a-z.]/i)) {
        sequence.current += char;
        if (sequence.current.length > 20) {
          sequence.current = sequence.current.slice(-20);
        }

        if (sequence.current.endsWith(".init") || sequence.current.endsWith("noesis")) {
          setIsOpen(true);
          sequence.current = "";
          setApiKey(null);
          setCopied(false);
          setLogs(["[SYSTEM] TERMINAL MODE ACTIVATED"]);
          playAudioCue("open");
        }
      }
    };

    const handleTriggerInit = () => {
      setIsOpen(true);
      sequence.current = "";
      setApiKey(null);
      setCopied(false);
      setLogs(["[SYSTEM] TERMINAL MODE ACTIVATED VIA QUINE REFLECTION"]);
      playAudioCue("open");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("trigger-init", handleTriggerInit);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("trigger-init", handleTriggerInit);
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const terminalLogs = [
      "Loading Pancha Kosha arrays...",
      "Aligning bio-electric fields...",
      "Establishing KHA-BA-LA protocol...",
      "Bypassing standard routing...",
      "DECRYPTING SOMATIC CANTICLES...",
      "== ACCESS GRANTED ==",
      "",
      "Generating Selemene Engine API key...",
      "Tier: FREE — 17 engines × 4 compass directions",
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < terminalLogs.length) {
        setLogs((prev) => [...prev, terminalLogs[i]]);
        playAudioCue("hover");
        i++;
      } else {
        clearInterval(interval);
        // Generate and display the API key
        const key = generateApiKey();
        setApiKey(key);
        setLogs((prev) => [...prev, "", `API_KEY: tn_free_${key}`]);
        playAudioCue("open");
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleCopy = React.useCallback(() => {
    if (!apiKey) return;
    navigator.clipboard.writeText(`tn_free_${apiKey}`).then(() => {
      setCopied(true);
      playAudioCue("click");
      setTimeout(() => setCopied(false), 2000);
    });
  }, [apiKey]);

  if (!isOpen) return null;

  return (
    <div className={styles.terminalOverlay}>
      <div className={styles.crtLines} />
      <div className={styles.scanline} />
      <div className={styles.terminalContent}>
        {logs.map((log, idx) => (
          <div key={idx} className={styles.logLine}>
            {log}
          </div>
        ))}

        {apiKey && (
          <div className={styles.apiKeySection}>
            <button type="button" className={styles.copyBtn} onClick={handleCopy}>
              {copied ? "COPIED ✓" : "COPY API KEY"}
            </button>
            <div className={styles.apiHint}>
              Use this key at <span className={styles.apiUrl}>/#sixteen-engines</span> to consult all 17 engines.
            </div>
            <div className={styles.apiHint}>Press ESC to close.</div>
          </div>
        )}

        {!apiKey && logs.length > 5 && (
          <div className={styles.promptLine}>
            <span className={styles.prompt}>admin@tryambakam:~# </span>
            <span className={styles.cursor}>_</span>
          </div>
        )}
      </div>
    </div>
  );
}
