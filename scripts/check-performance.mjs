import { readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(join(ROOT, "src/artworks/manifest.json"), "utf8"));
const failures = [];
const MAX_INITIAL_WINGS = 13;
const MAX_WING_DIMENSION = 2048;
const MAX_INDEX_HTML_BYTES = 20_000;

const indexBytes = statSync(join(ROOT, "index.html")).size;
if (indexBytes > MAX_INDEX_HTML_BYTES) {
  failures.push(`index.html is ${indexBytes} bytes, above ${MAX_INDEX_HTML_BYTES} byte budget.`);
}

const initialWings = manifest.slice(0, MAX_INITIAL_WINGS);
for (const item of initialWings) {
  if (item.width > MAX_WING_DIMENSION || item.height > MAX_WING_DIMENSION) {
    failures.push(`${item.url} is ${item.width}x${item.height}, above ${MAX_WING_DIMENSION}px initial-wing dimension budget.`);
  }
}

const nonOptimizedInitial = initialWings.filter((item) => !item.url.endsWith(".webp") && !item.url.endsWith(".png"));
if (nonOptimizedInitial.length > 0) failures.push(`Initial wing media includes unsupported formats: ${nonOptimizedInitial.map((item) => item.url).join(", ")}.`);

const wingPage = readFileSync(join(ROOT, "src/wing-page/index.tsx"), "utf8");
if (!wingPage.includes("React.lazy")) failures.push("WingPage must retain lazy-loaded wing templates for route-level chunking.");

const app = readFileSync(join(ROOT, "src/app/index.tsx"), "utf8");
if (!app.includes("loadTimedOut")) failures.push("App must retain the loader timeout fallback for failed canvas initialization.");

const progressiveImage = readFileSync(join(ROOT, "src/wing-page/components/ProgressiveImage.tsx"), "utf8");
if (!progressiveImage.includes('loading={rest.loading ?? "lazy"}')) failures.push("ProgressiveImage must keep lazy image loading.");
if (!progressiveImage.includes('decoding={rest.decoding ?? "async"}')) failures.push("ProgressiveImage must keep async image decoding.");

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log("Performance checks passed: metadata budget, media dimensions, lazy chunks, fallback, and image loading.");
