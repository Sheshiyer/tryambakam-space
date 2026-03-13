export const run = <T>(fn: () => T): T => fn();

export const clamp = (v: number, min: number, max: number): number => Math.max(min, Math.min(max, v));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const seededRandom = (seed: number): number => {
  const x = Math.sin(seed * 9999) * 10000;
  return x - Math.floor(x);
};

export const hashString = (str: string): number => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export const playAudioCue = (type: "click" | "hover" | "open" | "glitch" = "click") => {
  try {
    // @ts-expect-error
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    // Only play if the user prefers motion/sound (optional accessibility check)
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === "open") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.4);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "hover") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (_e) {
    // Audio might fail if user hasn't interacted with document yet
  }
};
