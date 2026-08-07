import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const CHECK_MODULE_DIR = join(ROOT, "node_modules/.tmp/tryambakam-check");
const { CTA_MODAL_CONTENT, getCTAHref } = await import(pathToFileURL(join(CHECK_MODULE_DIR, "cta-actions.mjs")));
const { WINGS } = await import(pathToFileURL(join(CHECK_MODULE_DIR, "wing-data.mjs")));

const failures = [];
const slugs = new Set(WINGS.map((wing) => wing.slug));
const modalIds = new Set(Object.keys(CTA_MODAL_CONTENT));

for (const wing of WINGS) {
  const { ctaAction } = wing;
  const href = getCTAHref(ctaAction);
  if (!wing.cta.trim()) failures.push(`${wing.slug} has empty CTA label.`);
  if (!href.trim()) failures.push(`${wing.slug} CTA resolves to an empty href.`);
  if ((ctaAction.type === "scroll" || ctaAction.type === "route") && !slugs.has(ctaAction.target)) {
    failures.push(`${wing.slug} ${ctaAction.type} CTA targets missing wing slug "${ctaAction.target}".`);
  }
  if (ctaAction.type === "modal" && !modalIds.has(ctaAction.target)) {
    failures.push(`${wing.slug} modal CTA targets missing modal content "${ctaAction.target}".`);
  }
  if (ctaAction.type === "external" && !ctaAction.target.startsWith("https://")) {
    failures.push(`${wing.slug} external CTA must use https: ${ctaAction.target}`);
  }
}

const linearMode = readFileSync(join(ROOT, "src/app/LinearMode.tsx"), "utf8");
if (!linearMode.includes("dispatchCTA")) failures.push("Linear mode must dispatch configured CTA actions, not only open wing pages.");
if (!linearMode.includes("getCTAHref")) failures.push("Linear mode must expose real CTA hrefs for keyboard and assistive users.");
if (!linearMode.includes("CTAModalHost")) failures.push("Linear mode must render the shared CTA modal host.");

const app = readFileSync(join(ROOT, "src/app/index.tsx"), "utf8");
if (!app.includes("CTAModalHost")) failures.push("3D mode must render the shared CTA modal host.");

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`CTA checks passed for ${WINGS.length} wings across linear and 3D modes.`);
