import { build } from "esbuild";
import { rmSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(import.meta.dirname, "..");
const outdir = join(ROOT, "node_modules/.tmp/tryambakam-check");

rmSync(outdir, { recursive: true, force: true });

await Promise.all([
  build({
    entryPoints: [join(ROOT, "src/data/engines.ts")],
    outfile: join(outdir, "engines.mjs"),
    bundle: true,
    format: "esm",
    platform: "node",
    logLevel: "silent",
  }),
  build({
    entryPoints: [join(ROOT, "src/wing-page/data.ts")],
    outfile: join(outdir, "wing-data.mjs"),
    bundle: true,
    format: "esm",
    platform: "node",
    logLevel: "silent",
  }),
  build({
    entryPoints: [join(ROOT, "src/utils/cta-actions.ts")],
    outfile: join(outdir, "cta-actions.mjs"),
    bundle: true,
    format: "esm",
    platform: "node",
    logLevel: "silent",
  }),
]);
