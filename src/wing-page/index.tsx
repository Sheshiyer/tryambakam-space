import * as React from "react";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
import type { WingData } from "./data";
import styles from "./style.module.css";

// ── Lazy-loaded wing templates (Vite auto-splits each into its own chunk) ──
const ApothecaryTemplate = React.lazy(() => import("./templates/ApothecaryTemplate"));
const BeginJourneyTemplate = React.lazy(() => import("./templates/BeginJourneyTemplate"));
const EngineMatrixTemplate = React.lazy(() => import("./templates/EngineMatrixTemplate"));
const FinancialBiosensorTemplate = React.lazy(() => import("./templates/FinancialBiosensorTemplate"));
const FirstRuleTemplate = React.lazy(() => import("./templates/FirstRuleTemplate"));
const HeroTemplate = React.lazy(() => import("./templates/HeroTemplate"));
const InfiniteTreasureTemplate = React.lazy(() => import("./templates/InfiniteTreasureTemplate"));
const InitTemplate = React.lazy(() => import("./templates/InitTemplate"));
const RegenerativeFieldTemplate = React.lazy(() => import("./templates/RegenerativeFieldTemplate"));
const SomaticCanticlesTemplate = React.lazy(() => import("./templates/SomaticCanticlesTemplate"));
const ThreePillarsTemplate = React.lazy(() => import("./templates/ThreePillarsTemplate"));
const WitnessAgentsTemplate = React.lazy(() => import("./templates/WitnessAgentsTemplate"));
const WitnessTemplate = React.lazy(() => import("./templates/WitnessTemplate"));

type WingPageProps = {
  wing: WingData;
  imageUrl: string;
  open: boolean;
  onClose: () => void;
};

export function WingPage({ wing, imageUrl, open, onClose }: WingPageProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  // Routing Logic corresponding to the Implementation Plan
  const slug = wing.slug;

  let Template: React.ComponentType<{
    wing: WingData;
    imageUrl: string;
    onClose: () => void;
  }>;

  if (slug === "financial-biosensor") {
    Template = FinancialBiosensorTemplate;
  } else if (slug === "sixteen-engines") {
    Template = EngineMatrixTemplate;
  } else if (slug === "three-pillars") {
    Template = ThreePillarsTemplate;
  } else if (slug === "self-integration") {
    Template = RegenerativeFieldTemplate;
  } else if (slug === "somatic-canticles") {
    Template = SomaticCanticlesTemplate;
  } else if (slug === "first-rule") {
    Template = FirstRuleTemplate;
  } else if (slug === "witness-yourself") {
    Template = WitnessTemplate;
  } else if (slug === "initiation-protocols") {
    Template = InitTemplate;
  } else if (slug === "apothecary") {
    Template = ApothecaryTemplate;
  } else if (slug === "witness-agents") {
    Template = WitnessAgentsTemplate;
  } else if (slug === "infinite-treasure") {
    Template = InfiniteTreasureTemplate;
  } else if (slug === "begin-journey") {
    Template = BeginJourneyTemplate;
  } else {
    // Default to HeroTemplate for hero
    Template = HeroTemplate;
  }

  return (
    <React.Suspense key={wing.slug} fallback={<LoadingSkeleton />}>
      <div className={styles.templateWrapper}>
        <Template wing={wing} imageUrl={imageUrl} onClose={onClose} />
      </div>
    </React.Suspense>
  );
}
