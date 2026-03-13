import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const WINGS_DIR = path.join(ROOT_DIR, "public/artworks/wings");
const MANIFEST_PATH = path.join(ROOT_DIR, "src/artworks/manifest.json");

async function run() {
  console.log("Reading directory:", WINGS_DIR);
  const files = await fs.readdir(WINGS_DIR);
  const jpgFiles = files.filter(f => f.toLowerCase().endsWith(".jpg") || f.toLowerCase().endsWith(".jpeg"));

  if (jpgFiles.length === 0) {
    console.log("No JPG files found to convert.");
  } else {
    for (const file of jpgFiles) {
      const inputPath = path.join(WINGS_DIR, file);
      const outputFilename = file.replace(/\.jpe?g$/i, ".webp");
      const outputPath = path.join(WINGS_DIR, outputFilename);

      console.log(`Converting ${file} -> ${outputFilename}...`);
      await sharp(inputPath)
        .webp({ quality: 80, effort: 4 })
        .toFile(outputPath);
      
      // Optionally remove original
      await fs.unlink(inputPath);
    }
    console.log("Conversion complete.");
  }

  // Update manifest
  console.log("Updating manifest...");
  const manifestRaw = await fs.readFile(MANIFEST_PATH, "utf-8");
  const parsedManifest = JSON.parse(manifestRaw);

  let updated = false;
  for (const item of parsedManifest) {
    if (item.url.endsWith(".jpg") || item.url.endsWith(".jpeg")) {
      item.url = item.url.replace(/\.jpe?g$/i, ".webp");
      updated = true;
    }
  }

  if (updated) {
    await fs.writeFile(MANIFEST_PATH, JSON.stringify(parsedManifest, null, 2), "utf-8");
    console.log("Manifest updated.");
  } else {
    console.log("Manifest was already updated.");
  }
}

run().catch(console.error);
