import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = resolve(import.meta.dirname, "..");
const REGISTRY_PATH = resolve(ROOT, "../Selemene-engine/.context/baseline/engine-matrix.json");

function parseRegistry(text) {
  try {
    return JSON.parse(text);
  } catch {
    const marker = "\n  ]\n}";
    const end = text.indexOf(marker);
    if (end === -1) throw new Error(`${REGISTRY_PATH} is not parseable JSON and no object boundary was found.`);
    return JSON.parse(text.slice(0, end + marker.length));
  }
}

const registry = parseRegistry(readFileSync(REGISTRY_PATH, "utf8"));
const registryEngines = [...registry.rust_engines, ...registry.ts_engines];
const registryIds = new Set(registryEngines.map((engine) => engine.engine_id));
const registryNames = new Set(registryEngines.map((engine) => engine.engine_name));
const { ENGINES } = await import(pathToFileURL(join(ROOT, "node_modules/.tmp/tryambakam-check", "engines.mjs")));

const failures = [];

if (registry.counts.total_engines !== registryEngines.length) {
  failures.push(`Registry counts.total_engines=${registry.counts.total_engines} but lists ${registryEngines.length} engines.`);
}

if (ENGINES.length !== registry.counts.total_engines) {
  failures.push(`src/data/engines.ts lists ${ENGINES.length} engines but registry expects ${registry.counts.total_engines}.`);
}

for (const engine of ENGINES) {
  if (!registryIds.has(engine.selemeneEngineId)) {
    failures.push(`Engine ${engine.id} (${engine.name}) references unknown Selemene id "${engine.selemeneEngineId}".`);
  }
}

const wingCopy = readFileSync(join(ROOT, "src/wing-page/data.ts"), "utf8");
const requiredClaims = [
  `17 mirrors`,
  `${registry.counts.rust_engines} Rust engines`,
  `${registry.counts.ts_engines} TypeScript lenses`,
  `${registry.counts.total_engines} Active`,
  `4 × ${registry.counts.total_engines} = ${4 * registry.counts.total_engines}`,
];

for (const claim of requiredClaims) {
  if (!wingCopy.includes(claim)) failures.push(`Wing copy is missing registry-backed claim: ${claim}`);
}

for (const name of registryNames) {
  if (!wingCopy.includes(name)) failures.push(`Wing copy does not name registered engine "${name}".`);
}

const staleClaims = [
  "Temporal Mapping",
  "Kosha Integration",
  "HD Gate Synthesis",
  "HRV Coherence",
  "Tattva Cycles",
  "Nakshatra Navigation",
  "Sonic Entrainment",
  "Purusha Witness",
  "Meridian Clock",
];

for (const staleClaim of staleClaims) {
  if (wingCopy.includes(staleClaim)) failures.push(`Wing copy still contains non-registry engine claim "${staleClaim}".`);
}

if (failures.length > 0) {
  console.error(failures.map((failure) => `- ${failure}`).join("\n"));
  process.exit(1);
}

console.log(`Verified ${ENGINES.length} app engines against ${registryEngines.length} Selemene registry entries.`);
