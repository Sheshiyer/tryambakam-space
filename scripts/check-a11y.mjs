import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const failures = [];
const indexHtml = readFileSync(join(ROOT, "index.html"), "utf8");

if (!indexHtml.includes("<html lang=\"en\"")) failures.push("index.html must declare html lang=\"en\".");
if (!indexHtml.includes('name="viewport"')) failures.push("index.html must include a responsive viewport meta tag.");
if (!indexHtml.includes('name="description"')) failures.push("index.html must include a meta description.");
if (!indexHtml.includes("<title>") || indexHtml.includes("<title></title>")) failures.push("index.html must include a non-empty title.");

const wingData = readFileSync(join(ROOT, "src/wing-page/data.ts"), "utf8");
const altCount = [...wingData.matchAll(/alt:\s*"([^"]+)"/g)].length;
const emptyAltCount = [...wingData.matchAll(/alt:\s*"\s*"/g)].length;

if (altCount !== 13) failures.push(`Expected 13 non-empty wing alt strings, found ${altCount}.`);
if (emptyAltCount > 0) failures.push(`Found ${emptyAltCount} empty wing alt strings.`);

const modal = readFileSync(join(ROOT, "src/components/Modal.tsx"), "utf8");
if (!modal.includes("aria-label")) failures.push("Modal must keep an accessible label.");
if (!modal.includes("onCancel")) failures.push("Modal must handle native dialog cancel for keyboard users.");

const app = readFileSync(join(ROOT, "src/app/index.tsx"), "utf8");
if (!app.includes("<main")) failures.push("App must render a main landmark around primary content.");
if (!app.includes('aria-label="Wings Navigation"')) failures.push("App must expose the screen-reader-only wing navigation.");

const loaderCss = readFileSync(join(ROOT, "src/loader/shader-loader.module.css"), "utf8");
if (!loaderCss.includes("0%, 100% { opacity: 0.85; }")) failures.push("Shader loader hint must keep its minimum pulse opacity at 0.85 for contrast.");

const ctaActions = readFileSync(join(ROOT, "src/utils/cta-actions.ts"), "utf8");
for (const modalId of [
  "field-initiation",
  "biosensor-dashboard",
  "agents-detail",
  "protocol-launcher",
  "product-grid",
  "access-points",
]) {
  if (!ctaActions.includes(`"${modalId}"`)) failures.push(`CTA modal host is missing content for ${modalId}.`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Accessibility checks passed: document metadata, wing alts, modal labels, and CTA modal coverage.");
