import * as React from "react";
import { playAudioCue } from "~/src/utils";
import styles from "./terminal-egg.module.css";

export function TerminalEgg() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [logs, setLogs] = React.useState<string[]>([]);
  const sequence = React.useRef("");

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
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
          setLogs(["[SYSTEM] TERMINAL MODE ACTIVATED"]);
          playAudioCue("open");
        }
      }
    };

    const handleTriggerInit = () => {
      setIsOpen(true);
      sequence.current = "";
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
    ];
    let i = 0;
    const interval = setInterval(() => {
      if (i < terminalLogs.length) {
        setLogs((prev) => [...prev, terminalLogs[i]]);
        playAudioCue("hover"); // use the tiny hover blip for typing sounds
        i++;
      } else {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen]);

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
        {logs.length > 5 && (
          <div className={styles.promptLine}>
            <span className={styles.prompt}>admin@tryambakam:~# </span>
            <span className={styles.cursor}>_</span>
          </div>
        )}
      </div>
    </div>
  );
}
