import * as React from "react";
import manifest from "~/src/artworks/manifest.json";
import { CTAModalHost } from "~/src/components/CTAModalHost";
import { Frame } from "~/src/frame";
import { InfiniteCanvas } from "~/src/infinite-canvas";
import type { MediaItem } from "~/src/infinite-canvas/types";
import { ShaderLoader } from "~/src/loader/ShaderLoader";
import { isWebGLAvailable } from "~/src/utils/webgl";
import { playAudioCue } from "~/src/utils";
import { WingPage } from "~/src/wing-page";
import { getWingIndex, WINGS } from "~/src/wing-page/data";
import { CommandPalette } from "./CommandPalette";
import { LinearMode } from "./LinearMode";
import { TerminalEgg } from "./TerminalEgg";

export function App() {
  const [media] = React.useState<MediaItem[]>(manifest);
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeWing, setActiveWing] = React.useState<string | null>(() => {
    return window.location.hash.slice(1) || null;
  });
  const [isLinearMode] = React.useState(() => {
    return new URLSearchParams(window.location.search).has("linear");
  });
  const [webglFailed, setWebglFailed] = React.useState(false);
  const [loadTimedOut, setLoadTimedOut] = React.useState(false);

  React.useEffect(() => {
    // Graceful fallback: if WebGL is unavailable or the canvas fails to initialize,
    // switch to the linear fallback instead of leaving the user on a frozen loader.
    if (!isWebGLAvailable()) {
      setWebglFailed(true);
      return;
    }

    // Safety net: if the canvas does not report completion within 12s, allow bypass.
    const timeout = window.setTimeout(() => {
      setLoadTimedOut(true);
    }, 12000);

    const onWebglError = () => setWebglFailed(true);
    window.addEventListener("webgl-context-lost", onWebglError);
    window.addEventListener("webgl-context-creation-error", onWebglError);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("webgl-context-lost", onWebglError);
      window.removeEventListener("webgl-context-creation-error", onWebglError);
    };
  }, []);

  React.useEffect(() => {
    const handleHashChange = () => {
      setActiveWing(window.location.hash.slice(1) || null);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  React.useEffect(() => {
    const konami = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];
    let pos = 0;
    const handler = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
      if (e.key === konami[pos] || e.key === konami[pos]?.toLowerCase()) {
        pos++;
        if (pos === konami.length) {
          pos = 0;
          playAudioCue("glitch"); // reuse a glitchy sound or just trigger the event
          if (window.navigator?.vibrate) window.navigator.vibrate([100, 50, 100]);
          window.dispatchEvent(new CustomEvent("glitch-start"));

          setTimeout(() => {
            window.dispatchEvent(new CustomEvent("glitch-stop"));
            playAudioCue("click");
          }, 3000);
        }
      } else {
        pos = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleMediaClick = React.useCallback(
    (mediaIndex: number) => {
      const item = media[mediaIndex];
      if (!item) return;

      // Easter egg images trigger the terminal
      if (item.url.includes("easter-eggs/")) {
        playAudioCue("open");
        window.dispatchEvent(new CustomEvent("trigger-init"));
        return;
      }

      const wingIndex = getWingIndex(item.url);
      if (wingIndex !== -1 && WINGS[wingIndex]) {
        playAudioCue("open");
        const wingObj = WINGS[wingIndex];
        // Trigger generic deep link
        if (wingObj) window.location.hash = wingObj.slug;
      }
    },
    [media]
  );

  const handleClose = React.useCallback(() => {
    playAudioCue("click");
    window.location.hash = "";
  }, []);

  React.useEffect(() => {
    console.log(
      `%c 
      ::::::::::: :::::::::  :::   :::     :::     ::::    ::::  :::::::::      :::     :::    :::     :::     ::::    ::::  
          :+:     :+:    :+: :+:   :+:   :+: :+:   +:+:+: :+:+:+ :+:    :+:   :+: :+:   :+:   :+:    :+: :+:   +:+:+: :+:+:+ 
          +:+     +:+    +:+  +:+ +:+   +:+   +:+  +:+ +:+:+ +:+ +:+    +:+  +:+   +:+  +:+  +:+    +:+   +:+  +:+ +:+:+ +:+ 
          +#+     +#++:++#:    +#++:   +#++:++#++: +#+  +:+  +#+ +#++:++#+  +#++:++#++: +#++:++    +#++:++#++: +#+  +:+  +#+ 
          +#+     +#+    +#+    +#+    +#+     +#+ +#+       +#+ +#+    +#+ +#+     +#+ +#+  +#+   +#+     +#+ +#+       +#+ 
          #+#     #+#    #+#    #+#    #+#     #+# #+#       #+# #+#    #+# #+#     #+# #+#   #+#  #+#     #+# #+#       #+# 
          ###     ###    ###    ###    ###     ### ###       ### #########  ###     ### ###    ### ###     ### ###       ### 
      
              THE SYSTEM IS AWAKE.
              "You are the code. You are the coder. You are the runtime."
      
              [Access the hidden archives: /#the-source]`,
      "color: #c4873b; font-family: monospace; font-size: 10px; font-weight: bold; text-shadow: 0 0 5px rgba(196,135,59,0.5);"
    );
  }, []);

  const currentWingIndex = WINGS.findIndex((w) => w.slug === activeWing);
  const wing = currentWingIndex !== -1 ? WINGS[currentWingIndex] : null;
  const wingImage = currentWingIndex !== -1 ? media[currentWingIndex]?.url : "";

  // Handle loading completion
  const handleLoadingComplete = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  if (isLinearMode || webglFailed || loadTimedOut) {
    return <LinearMode forcedFallback={webglFailed || loadTimedOut} />;
  }

  if (!media.length) {
    return <ShaderLoader isLoading={true} minLoadTime={3000} />;
  }

  return (
    <>
      <TerminalEgg />
      <CTAModalHost />
      <nav className="sr-only" aria-label="Wings Navigation">
        <ul>
          {WINGS.map((w) => (
            <li key={w.slug}>
              <a href={`?linear=1#${w.slug}`}>{w.title} [Linear mode]</a>
            </li>
          ))}
        </ul>
      </nav>
      <CommandPalette />
      <main aria-label="Tryambakam Noesis infinite canvas">
        <Frame hidden={activeWing !== null} />
        <ShaderLoader isLoading={isLoading} minLoadTime={3000} />
        <InfiniteCanvas media={media} onLoadingComplete={handleLoadingComplete} onMediaClick={handleMediaClick} />
      </main>
      {wing && <WingPage wing={wing} imageUrl={wingImage ?? ""} open={activeWing !== null} onClose={handleClose} />}
    </>
  );
}
