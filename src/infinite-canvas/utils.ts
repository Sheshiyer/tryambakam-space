import * as THREE from "three";
import { hashString, seededRandom } from "~/src/utils";
import { CHUNK_SIZE } from "./constants";
import type { PlaneData } from "./types";

const MAX_PLANE_CACHE = 256;
const planeCache = new Map<string, PlaneData[]>();

const touchPlaneCache = (key: string) => {
  const v = planeCache.get(key);
  if (!v) {
    return;
  }

  planeCache.delete(key);
  planeCache.set(key, v);
};

const evictPlaneCache = () => {
  while (planeCache.size > MAX_PLANE_CACHE) {
    const firstKey = planeCache.keys().next().value as string | undefined;
    if (!firstKey) break;
    planeCache.delete(firstKey);
  }
};

export const getChunkUpdateThrottleMs = (isZooming: boolean, zoomSpeed: number): number => {
  if (zoomSpeed > 1.0) {
    return 500;
  }

  if (isZooming) {
    return 400;
  }

  return 100;
};

export const getMediaDimensions = (media: HTMLImageElement | undefined) => {
  const width = media instanceof HTMLImageElement ? media.naturalWidth || media.width : undefined;
  const height = media instanceof HTMLImageElement ? media.naturalHeight || media.height : undefined;
  return { width, height };
};

export const generateChunkPlanes = (cx: number, cy: number, cz: number): PlaneData[] => {
  const planes: PlaneData[] = [];
  const seed = hashString(`${cx},${cy},${cz}`);

  // Reduced from 7 to 3 items per chunk for a much sparser, elegant, and less "noisy" gallery feel.
  for (let i = 0; i < 3; i++) {
    const s = seed + i * 1000;
    const r = (n: number) => seededRandom(s + n);

    // Slightly smaller so they feel more like precious artifacts rather than overlapping clutter.
    // 12 to 24 units instead of 16 to 30.
    const size = 12 + r(4) * 12;

    // Add a structural cell offset so these 3 items naturally push away from each other
    // We can use the index i to loosely assign them to 3 different "thirds" of the chunk logic.
    const offsetX = ((i % 3) / 3.0 + r(0) * 0.3) * CHUNK_SIZE;
    const offsetY = r(1) * CHUNK_SIZE;
    const offsetZ = r(2) * CHUNK_SIZE;

    planes.push({
      id: `${cx}-${cy}-${cz}-${i}`,
      position: new THREE.Vector3(cx * CHUNK_SIZE + offsetX, cy * CHUNK_SIZE + offsetY, cz * CHUNK_SIZE + offsetZ),
      scale: new THREE.Vector3(size, size, 1),
      mediaIndex: Math.floor(r(5) * 1_000_000),
    });
  }

  return planes;
};

export const generateChunkPlanesCached = (cx: number, cy: number, cz: number): PlaneData[] => {
  const key = `${cx},${cy},${cz}`;
  const cached = planeCache.get(key);
  if (cached) {
    touchPlaneCache(key);
    return cached;
  }

  const planes = generateChunkPlanes(cx, cy, cz);
  planeCache.set(key, planes);
  evictPlaneCache();
  return planes;
};

export const shouldThrottleUpdate = (lastUpdateTime: number, throttleMs: number, currentTime: number): boolean => {
  return currentTime - lastUpdateTime >= throttleMs;
};
