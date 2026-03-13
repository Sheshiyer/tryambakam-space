import * as React from "react";
import { WINGS, type WingData } from "~/src/wing-page/data";
import styles from "./command-palette.module.css";

export function CommandPalette() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Global global key listener for Cmd+K or / or Esc
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "/") {
        // Only trigger if we aren't already typing in an input
        if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      // Timeout needed for focus if rendering delay
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  const filteredWings = React.useMemo(() => {
    if (!query.trim()) return WINGS;
    const lowerQuery = query.toLowerCase();
    return WINGS.filter(
      (w) =>
        w.title.toLowerCase().includes(lowerQuery) ||
        w.slug.toLowerCase().includes(lowerQuery) ||
        w.number.includes(lowerQuery) ||
        w.subtitle.toLowerCase().includes(lowerQuery)
    );
  }, [query]);

  React.useEffect(() => {
    setSelectedIndex(0); // Reset selection on new search
  }, []);

  const handleSelect = (wing: WingData) => {
    window.location.hash = wing.slug;
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredWings.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredWings.length) % filteredWings.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredWings[selectedIndex]) {
        handleSelect(filteredWings[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: Overlay handles click-outside
    <div className={styles.overlay} onClick={() => setIsOpen(false)} role="dialog">
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Stop propagation for the modal box */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Stop propagation for the modal box */}
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputWrapper}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="Search the infinite canvas..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className={styles.devIndicator}>ESC to close</div>
        </div>

        {filteredWings.length > 0 ? (
          <div className={styles.results}>
            {filteredWings.map((wing, i) => {
              const isSelected = i === selectedIndex;
              return (
                // biome-ignore lint/a11y/useKeyWithClickEvents: Keyboard handled globally by input arrow keys
                // biome-ignore lint/a11y/noStaticElementInteractions: List item
                <div
                  key={wing.slug}
                  className={`${styles.resultItem} ${isSelected ? styles.selected : ""}`}
                  onClick={() => handleSelect(wing)}
                  onMouseEnter={() => setSelectedIndex(i)}
                >
                  <span className={styles.resultNumber}>{wing.number}</span>
                  <span className={styles.resultTitle}>{wing.title.replace("\n", " ")}</span>
                  <span className={styles.resultType}>{wing.subtitle}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.noResults}>No matching wings found.</div>
        )}
      </div>
    </div>
  );
}
