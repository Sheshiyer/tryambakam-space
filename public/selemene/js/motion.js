/* Selemene MotionSkin — reskin of MotionSites "Particle Field" (source
 *   https://motionsites.ai/?prompt=particle-field ).
 *
 * Mechanical parameters preserved from the reference in
 *   docs/selemene-motion/particle-field-reference.md.
 * Approved product deviations documented in DESIGN-CONTRACT.md.
 * Skin swapped: Selemene navy/gold/parchment palette, Tryambakam sigil as
 * the actual shape sampler, no lil-gui/stats — accessible Pause Motion
 * toggle instead.
 *
 * All dependencies are same-origin: three@0.185.1 and lenis@1.1.18 are
 * vendored under /selemene/lib/. No CDN calls at runtime, no textures,
 * models, video, fonts or postprocessing composers loaded.
 */

import * as THREE from '/selemene/lib/three/three.module.min.js';

/* ── Lenis is optional: only imported if not reduced-motion. ── */
let LenisCtor = null;
async function loadLenis() {
  if (LenisCtor !== null) return LenisCtor;
  try {
    const mod = await import('/selemene/lib/lenis/lenis.mjs');
    LenisCtor = mod.default || mod.Lenis || mod;
  } catch (_) {
    LenisCtor = false;
  }
  return LenisCtor;
}

/* ═════════════════════════════════════════════════════════════════
 * Palette (baked into vertex colours, not CSS)
 * ─── Selemene skin (skin swap from mint/green reference) ───
 * ═════════════════════════════════════════════════════════════════ */
const PALETTE = {
  pale:    new THREE.Color('#f2e6b8'),
  accent:  new THREE.Color('#c5a017'),
  deep:    new THREE.Color('#5a3f0a'),
  sparkle: new THREE.Color('#ffffff'),
};
const STAR_COLORS = [
  new THREE.Color('#e6e2d0'),
  new THREE.Color('#c5a017'),
  new THREE.Color('#8a9ba8'),
];

/* ═════════════════════════════════════════════════════════════════
 * SVG sampler — raster once at 512, sample opaque pixels for interior,
 * getPointAtLength for the outline. Uses the real Tryambakam sigil path.
 *
 * Both interior (raster pixels) and outline (getPointAtLength) map into
 * the same aspect-preserving field coordinate system via the same
 * letterboxing scale/offset derived from the SVG viewBox.
 * ═════════════════════════════════════════════════════════════════ */
async function buildSvgSampler(svgUrl, opts) {
  const RES = opts?.resolution || 512;
  const RADIUS = opts?.radius || 5.3;

  const res = await fetch(svgUrl, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`sigil fetch ${res.status}`);

  const text = await res.text();

  // Parse and normalise into an offscreen SVG document.
  const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
  const src = doc.querySelector('svg');
  if (!src) throw new Error('sigil svg has no <svg> root');

  // Determine viewBox with finite/positive guard.
  let vb = (src.getAttribute('viewBox') || '').trim().split(/\s+/).map(Number);
  if (vb.length !== 4 || vb.some(n => !Number.isFinite(n))) {
    const w = parseFloat(src.getAttribute('width') || RES);
    const h = parseFloat(src.getAttribute('height') || RES);
    vb = [0, 0, w || RES, h || RES];
  }
  let [vx, vy, vw, vh] = vb;
  if (vw <= 0 || vh <= 0) { vw = RES; vh = RES; vb = [0, 0, vw, vh]; }

  // Letterbox: scale into RES×RES preserving aspect ratio.
  const scale = Math.min(RES / vw, RES / vh);
  const drawW = vw * scale;
  const drawH = vh * scale;
  const offX = (RES - drawW) * 0.5;
  const offY = (RES - drawH) * 0.5;

  // Rasterise once to an offscreen canvas.
  const canvas = document.createElement('canvas');
  canvas.width = RES;
  canvas.height = RES;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2d context unavailable');

  // Serialize the source SVG and draw it into an Image.
  const blob = new Blob([new XMLSerializer().serializeToString(src)],
    { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const img = new Image();
  const drawn = new Promise((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
  });
  img.src = url;
  await drawn;
  ctx.clearRect(0, 0, RES, RES);
  // Draw into letterboxed rect preserving original SVG aspect.
  ctx.drawImage(img, offX, offY, drawW, drawH);
  URL.revokeObjectURL(url);

  const imgData = ctx.getImageData(0, 0, RES, RES).data;

  // Find opaque bounds so radius maps to the tightest fit.
  let minX = RES, minY = RES, maxX = 0, maxY = 0;
  for (let py = 0; py < RES; py++) {
    for (let px = 0; px < RES; px++) {
      const a = imgData[((py * RES) + px) * 4 + 3];
      if (a > 24) {
        if (px < minX) minX = px;
        if (py < minY) minY = py;
        if (px > maxX) maxX = px;
        if (py > maxY) maxY = py;
      }
    }
  }
  if (maxX < minX) { minX = 0; maxX = RES - 1; minY = 0; maxY = RES - 1; }

  // Map opaque bounds back to viewBox space for correct aspect.
  const vbMinX = vx + (minX - offX) / scale;
  const vbMinY = vy + (minY - offY) / scale;
  const vbMaxX = vx + (maxX - offX) / scale;
  const vbMaxY = vy + (maxY - offY) / scale;
  const vbSpanX = vbMaxX - vbMinX;
  const vbSpanY = vbMaxY - vbMinY;
  const vbSpan = Math.max(vbSpanX, vbSpanY);
  const vbCx = (vbMinX + vbMaxX) * 0.5;
  const vbCy = (vbMinY + vbMaxY) * 0.5;

  // Precompute opaque-pixel list (in raster coords) for interior sampling.
  const opaque = [];
  for (let py = 0; py < RES; py++) {
    for (let px = 0; px < RES; px++) {
      const a = imgData[((py * RES) + px) * 4 + 3];
      if (a > 40) opaque.push(px, py);
    }
  }
  const opaqueCount = opaque.length / 2;
  if (opaqueCount === 0) throw new Error('sigil has no opaque pixels');

  // Extract all <path>s from the source, concatenated for outline sampling.
  const paths = Array.from(src.querySelectorAll('path'));
  const outlineHost = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  outlineHost.setAttribute('viewBox', `${vx} ${vy} ${vw} ${vh}`);
  outlineHost.setAttribute('width', '0');
  outlineHost.setAttribute('height', '0');
  outlineHost.style.position = 'absolute';
  outlineHost.style.left = '-99999px';
  outlineHost.style.top = '-99999px';
  outlineHost.setAttribute('aria-hidden', 'true');
  const outlinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const dCombined = paths.map(p => p.getAttribute('d') || '').join(' ');
  outlinePath.setAttribute('d', dCombined);
  outlineHost.appendChild(outlinePath);
  document.body.appendChild(outlineHost);
  const totalLen = outlinePath.getTotalLength();

  /* Map a viewBox-space point to field coords.
   * Both interior (raster→viewBox) and outline (getPointAtLength) use this. */
  function toField(vbX, vbY) {
    const nx = (vbX - vbCx) / (vbSpan * 0.5);
    const ny = -(vbY - vbCy) / (vbSpan * 0.5);
    return [nx * RADIUS, ny * RADIUS];
  }

  function sampleInterior() {
    const i = (Math.random() * opaqueCount) | 0;
    const px = opaque[i * 2] + Math.random();
    const py = opaque[i * 2 + 1] + Math.random();
    // Convert raster pixel → viewBox space, then to field.
    const vbX = vx + (px - offX) / scale;
    const vbY = vy + (py - offY) / scale;
    const [x, y] = toField(vbX, vbY);
    return { x, y, z: 0 };
  }

  function sampleOutline() {
    const t = Math.random() * totalLen;
    const pt = outlinePath.getPointAtLength(t);
    const [x, y] = toField(pt.x, pt.y);
    return { x, y, z: 0 };
  }

  // Feature dots for the static fallback outline (240 samples along path).
  const outlineDots = [];
  const N = 240;
  for (let i = 0; i < N; i++) {
    const pt = outlinePath.getPointAtLength((i / N) * totalLen);
    const [x, y] = toField(pt.x, pt.y);
    outlineDots.push({ x, y });
  }

  // Feature ring (rim) — for classifying rim-share particles.
  const halfW = (vbSpanX / vbSpan) * RADIUS;
  const halfH = (vbSpanY / vbSpan) * RADIUS;

  function dispose() {
    outlineHost.remove();
  }

  return {
    is3D: false,
    radius: RADIUS,
    halfW: halfW,
    halfH: halfH,
    halfD: 0.35,
    sampleInterior,
    sampleOutline,
    outlineDots,
    viewBox: `${vx} ${vy} ${vw} ${vh}`,
    combinedD: dCombined,
    dispose,
  };
}

/* ═════════════════════════════════════════════════════════════════
 * Shader material — procedural disc/soft sprite, additive, no texture.
 * ═════════════════════════════════════════════════════════════════ */
function buildShaderMaterial() {
  const uniforms = {
    uTime:     { value: 0 },
    uLife:     { value: 0 },
    uBurst:    { value: 0 },
    uMotion:   { value: 1 },
    uOpacity:  { value: 0.95 },
    uSizeMul:  { value: 1 },
    uScale:    { value: 800 },
    uMinPx:    { value: 1.4 },
    uCalmOn:   { value: 1 },
    uCalmA:    { value: new THREE.Vector4(99, 99, 0, 0) },
    uCalmB:    { value: new THREE.Vector4(99, 99, 0, 0) },
    uCalmR:    { value: 0.35 },
    uCalmStr:  { value: 0.70 },
  };
  const vertexShader = /* glsl */`
    uniform float uTime;
    uniform float uLife;
    uniform float uBurst;
    uniform float uMotion;
    uniform float uSizeMul;
    uniform float uScale;
    uniform float uMinPx;
    uniform float uCalmOn;
    uniform vec4  uCalmA;
    uniform vec4  uCalmB;
    uniform float uCalmR;
    uniform float uCalmStr;

    attribute float aSize;
    attribute float aSoft;
    attribute vec3  aColor;
    attribute vec3  aDrift;
    attribute float aTwinkle;
    attribute vec3  aBurstDir;
    attribute float aBurstDist;

    varying vec3  vCol;
    varying float vA;
    varying float vSoft;

    float sdRoundBox(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + vec2(r);
      return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
    }

    void main() {
      vec3 pos = position;
      float t = uTime;
      float m = uMotion * uLife;
      // Layered sine wander — touch/no-fine-pointer drift via aDrift.
      pos.x += aDrift.x * m * sin(t * 0.7 + aDrift.z * 6.2831);
      pos.y += aDrift.y * m * cos(t * 0.55 + aDrift.z * 6.2831);
      pos.z += aDrift.z * m * 0.6 * sin(t * 0.33 + aDrift.x * 6.2831);

      pos += aBurstDir * (aBurstDist * uBurst);

      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      float depth = max(-mv.z, 0.001);

      float seedSize = 0.115;
      float grown = mix(seedSize, aSize, uLife);
      float sz = grown * uSizeMul * (1.0 + uBurst * 0.6);

      gl_PointSize = clamp(sz * uScale / depth, uMinPx, uScale * 0.05);

      float tw = 1.0 + aTwinkle * 0.35 * sin(t * (1.7 + aTwinkle * 3.0) + aDrift.y * 12.0);
      float depthAtten = clamp(1.0 - (depth - 10.0) * 0.008, 0.55, 1.15);

      vec4 clip = projectionMatrix * mv;
      float calm = 1.0;
      if (uCalmOn > 0.001 && clip.w > 0.0) {
        vec2 nd = clip.xy / clip.w;
        float dA = sdRoundBox(nd - uCalmA.xy, uCalmA.zw, uCalmR);
        float dB = sdRoundBox(nd - uCalmB.xy, uCalmB.zw, uCalmR);
        float mA = 1.0 - smoothstep(0.0, 0.15, dA);
        float mB = 1.0 - smoothstep(0.0, 0.15, dB);
        float mask = max(mA, mB);
        calm = 1.0 - mask * uCalmStr * uCalmOn;
      }

      vCol  = aColor * tw * depthAtten * calm;
      vSoft = mix(aSoft, 1.0, uBurst);
      vA    = mix(0.95, 0.35, uBurst);

      gl_Position = clip;
    }
  `;
  const fragmentShader = /* glsl */`
    precision highp float;
    uniform float uOpacity;
    varying vec3  vCol;
    varying float vA;
    varying float vSoft;

    void main() {
      vec2 q = gl_PointCoord - 0.5;
      float d2 = dot(q, q) * 4.0;
      if (d2 >= 1.0) discard;
      float tight = min(1.0, (1.0 - d2) * 1.9);
      float wide  = (1.0 - d2) * (1.0 - d2);
      float a = mix(tight, wide * 0.55, vSoft) * vA * uOpacity;
      if (a < 0.004) discard;
      gl_FragColor = vec4(vCol, a);
    }
  `;
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}

/* ═════════════════════════════════════════════════════════════════
 * Field builder
 * ═════════════════════════════════════════════════════════════════ */
function classifySize(rand) {
  if (rand < 0.70) {
    return { size: 0.08 + Math.random() * 0.055, soft: 0.10 };
  } else if (rand < 0.95) {
    return { size: 0.16 + Math.random() * 0.09,  soft: 0.45 };
  } else {
    return { size: 0.32 + Math.random() * 0.26,  soft: 1.00 };
  }
}
const RIM_CLASS  = { size: 0.075, soft: 0.08, sizeRand: 0.055 };
const HALO_CLASS = { spread: [1.15, 1.9], amp: 0.38, dim: [0.55, 0.90] };

function pickColor() {
  const r = Math.random();
  if (r < 0.015) return PALETTE.sparkle;
  if (r < 0.35)  return PALETTE.pale;
  if (r < 0.85)  return PALETTE.accent;
  return PALETTE.deep;
}

function buildField(sampler, opts) {
  const count = opts.count;
  const rimShare = opts.rimShare;
  const haloCount = opts.haloCount;

  const total = count + haloCount;
  const positions   = new Float32Array(total * 3);
  const colors      = new Float32Array(total * 3);
  const sizes       = new Float32Array(total);
  const softs       = new Float32Array(total);
  const drifts      = new Float32Array(total * 3);
  const twinkles    = new Float32Array(total);
  const burstDirs   = new Float32Array(total * 3);
  const burstDists  = new Float32Array(total);
  const rimFlag     = new Uint8Array(total);
  const restPos     = new Float32Array(total * 3);
  const offset      = new Float32Array(total * 3);

  const rimCount = Math.round(count * rimShare);
  const rMax = Math.max(sampler.halfW, sampler.halfH);

  for (let i = 0; i < count; i++) {
    let p;
    if (i < rimCount) {
      p = sampler.sampleOutline();
      rimFlag[i] = 1;
      sizes[i] = RIM_CLASS.size + Math.random() * RIM_CLASS.sizeRand;
      softs[i] = RIM_CLASS.soft;
    } else {
      p = sampler.sampleInterior();
      const cls = classifySize(Math.random());
      sizes[i] = cls.size;
      softs[i] = cls.soft;
    }
    if (softs[i] === 1.00 && Math.random() < 0.05) {
      sizes[i] *= 1.05;
    }

    positions[i*3+0] = p.x;
    positions[i*3+1] = p.y;
    positions[i*3+2] = p.z + (Math.random() - 0.5) * (sampler.halfD || 0);

    restPos[i*3+0] = positions[i*3+0];
    restPos[i*3+1] = positions[i*3+1];
    restPos[i*3+2] = positions[i*3+2];

    const c = pickColor();
    colors[i*3+0] = c.r;
    colors[i*3+1] = c.g;
    colors[i*3+2] = c.b;

    drifts[i*3+0] = (Math.random() - 0.5) * 0.9;
    drifts[i*3+1] = (Math.random() - 0.5) * 0.55;
    drifts[i*3+2] = Math.random();

    twinkles[i] = Math.random();

    let dx = Math.random()*2 - 1;
    let dy = Math.random()*2 - 1;
    let dz = Math.random()*2 - 1;
    const dl = Math.hypot(dx, dy, dz) || 1;
    burstDirs[i*3+0] = dx/dl;
    burstDirs[i*3+1] = dy/dl;
    burstDirs[i*3+2] = dz/dl;
    burstDists[i]    = rMax * (1.6 + Math.random() * 2.6);
  }

  for (let i = 0; i < haloCount; i++) {
    const idx = count + i;
    const p = sampler.sampleOutline();
    const angle = Math.random() * Math.PI * 2;
    const rr = HALO_CLASS.spread[0]
      + Math.random() * (HALO_CLASS.spread[1] - HALO_CLASS.spread[0]);
    const rx = p.x + Math.cos(angle) * HALO_CLASS.amp * rr;
    const ry = p.y + Math.sin(angle) * HALO_CLASS.amp * rr;
    positions[idx*3+0] = rx;
    positions[idx*3+1] = ry;
    positions[idx*3+2] = (Math.random() - 0.5) * 0.4;
    restPos[idx*3+0] = rx;
    restPos[idx*3+1] = ry;
    restPos[idx*3+2] = positions[idx*3+2];

    sizes[idx] = 0.32 + Math.random() * 0.30;
    softs[idx] = 1.0;

    const dim = HALO_CLASS.dim[0]
      + Math.random() * (HALO_CLASS.dim[1] - HALO_CLASS.dim[0]);
    const c = pickColor();
    colors[idx*3+0] = c.r * dim;
    colors[idx*3+1] = c.g * dim;
    colors[idx*3+2] = c.b * dim;

    drifts[idx*3+0] = (Math.random() - 0.5) * 0.6;
    drifts[idx*3+1] = (Math.random() - 0.5) * 0.4;
    drifts[idx*3+2] = Math.random();

    twinkles[idx] = Math.random();

    let dx = Math.random()*2 - 1;
    let dy = Math.random()*2 - 1;
    let dz = Math.random()*2 - 1;
    const dl = Math.hypot(dx, dy, dz) || 1;
    burstDirs[idx*3+0] = dx/dl;
    burstDirs[idx*3+1] = dy/dl;
    burstDirs[idx*3+2] = dz/dl;
    burstDists[idx]    = rMax * (1.6 + Math.random() * 2.6);
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position',   new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('aColor',     new THREE.BufferAttribute(colors, 3));
  geom.setAttribute('aSize',      new THREE.BufferAttribute(sizes, 1));
  geom.setAttribute('aSoft',      new THREE.BufferAttribute(softs, 1));
  geom.setAttribute('aDrift',     new THREE.BufferAttribute(drifts, 3));
  geom.setAttribute('aTwinkle',   new THREE.BufferAttribute(twinkles, 1));
  geom.setAttribute('aBurstDir',  new THREE.BufferAttribute(burstDirs, 3));
  geom.setAttribute('aBurstDist', new THREE.BufferAttribute(burstDists, 1));

  return { geom, total, count, haloCount, positions, restPos, offset, rimFlag, rMax };
}

/* ═════════════════════════════════════════════════════════════════
 * Starfield — 2 layers, referenced drift.
 * ═════════════════════════════════════════════════════════════════ */
function buildStarLayer(n, rRange, size, accentRatio) {
  const pos = new Float32Array(n * 3);
  const col = new Float32Array(n * 3);
  const siz = new Float32Array(n);
  const sof = new Float32Array(n);
  const drf = new Float32Array(n * 3);
  const tw  = new Float32Array(n);
  const bd  = new Float32Array(n * 3);
  const bdd = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const r = rRange[0] + Math.random() * (rRange[1] - rRange[0]);
    const s2 = Math.sqrt(1 - u*u);
    const x = r * s2 * Math.cos(th);
    const y = r * s2 * Math.sin(th);
    let z = r * u;
    z = -Math.abs(z) * 0.6 - 4;
    pos[i*3+0] = x; pos[i*3+1] = y; pos[i*3+2] = z;
    let c;
    if (Math.random() < accentRatio) c = STAR_COLORS[1];
    else if (Math.random() < 0.5) c = STAR_COLORS[0];
    else c = STAR_COLORS[2];
    col[i*3+0] = c.r; col[i*3+1] = c.g; col[i*3+2] = c.b;
    siz[i] = size;
    sof[i] = 0.1;
    tw[i] = Math.random();
    drf[i*3+0] = 0; drf[i*3+1] = 0; drf[i*3+2] = 0;
    bd[i*3+0] = 0; bd[i*3+1] = 0; bd[i*3+2] = 0;
    bdd[i] = 0;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position',   new THREE.BufferAttribute(pos, 3));
  g.setAttribute('aColor',     new THREE.BufferAttribute(col, 3));
  g.setAttribute('aSize',      new THREE.BufferAttribute(siz, 1));
  g.setAttribute('aSoft',      new THREE.BufferAttribute(sof, 1));
  g.setAttribute('aDrift',     new THREE.BufferAttribute(drf, 3));
  g.setAttribute('aTwinkle',   new THREE.BufferAttribute(tw, 1));
  g.setAttribute('aBurstDir',  new THREE.BufferAttribute(bd, 3));
  g.setAttribute('aBurstDist', new THREE.BufferAttribute(bdd, 1));
  return g;
}

/* ═════════════════════════════════════════════════════════════════
 * Static SVG fallback (WebGL missing or motion paused)
 * ═════════════════════════════════════════════════════════════════ */
function makeStaticFallback(sampler) {
  const container = document.createElement('div');
  container.className = 'pf-fallback';
  container.setAttribute('aria-hidden', 'true');
  container.innerHTML = `
    <svg viewBox="${sampler.viewBox}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pf-grad" cx="50%" cy="45%" r="60%">
          <stop offset="0%"   stop-color="#f2e6b8" />
          <stop offset="45%"  stop-color="#c5a017" />
          <stop offset="80%"  stop-color="#5a3f0a" />
          <stop offset="100%" stop-color="#070b1d" />
        </radialGradient>
      </defs>
      <path d="${sampler.combinedD}" fill="url(#pf-grad)" opacity="0.9" />
      <path d="${sampler.combinedD}" fill="none" stroke="#f2e6b8"
            stroke-width="0.6" opacity="0.8" />
    </svg>`;
  return container;
}

/* ═════════════════════════════════════════════════════════════════
 * The main runtime.
 * ═════════════════════════════════════════════════════════════════ */
async function boot() {
  const host = document.getElementById('field');
  if (!host) return;

  // Keep the real static mark until a frame successfully renders.
  const baseline = host.querySelector('.pf-baseline');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const mobile = window.innerWidth < 768;

  const budget = {
    count:     mobile ? Math.round(6000 * 0.6) : 6000,
    haloCount: mobile ? Math.round(260  * 0.6) : 260,
    rimShare:  0.26,
    fov:       50,
    cameraZ:   16,
    farZ:      106,
    maxDpr:    2,
    autoSpin:  0,      // flat-shape exception: no continuous spin
    sway:      0.6,    // reference §9 flat-shape rule
    swaySpeed: 0.16,
    scrollSpin: Math.PI * 1.15,
    parallax:  0.9,
    tilt:      0.2,
    wobble:    0.07,
    holeRadiusRel: 0.17,
    springIn:  0.22,
    springOut: 0.055,
  };

  const status = {
    webgl: false,
    reducedMotion: reduced.matches,
    motionOn: !reduced.matches,
    finePointer: fine.matches,
    mobile,
    ready: false,
    fallback: false,
    paused: false,
    progress: 0,
    burst: 0,
    pointCount: 0,
  };

  /* ── If reduced-motion or WebGL unavailable → SVG fallback only. ── */
  const canTryGL = (() => {
    try {
      const c = document.createElement('canvas');
      return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (_) { return false; }
  })();

  let sampler = null;
  try {
    sampler = await buildSvgSampler('/selemene/assets/tryambakam-sigil.svg', {
      radius: 5.3,
      resolution: 512,
    });
  } catch (err) {
    console.warn('[selemene motion] sigil sampler failed', err);
  }

  if (reduced.matches || !canTryGL || !sampler) {
    status.fallback = true;
    if (baseline) baseline.hidden = false;
    if (sampler) sampler.dispose();
    status.ready = true;
    status.motionOn = false;
    setupPauseToggle(true);
    let staticDisposed = false;
    function clearStaticMode() {
      staticDisposed = true;
      reduced.removeEventListener?.('change', onStaticPreferenceChange);
    }
    function onStaticPreferenceChange() {
      if (!staticDisposed && !reduced.matches && canTryGL && sampler) {
        clearStaticMode();
        boot().catch(() => { if (baseline) baseline.hidden = false; });
      }
    }
    reduced.addEventListener?.('change', onStaticPreferenceChange);
    window.field = { webgl: false, status, destroy: clearStaticMode };
    return;
  }

  /* ── Renderer / scene ── */
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, budget.maxDpr));
  renderer.setSize(Math.max(1, window.innerWidth), Math.max(1, window.innerHeight));
  renderer.setClearColor(0x000000, 0);
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    budget.fov,
    Math.max(1, window.innerWidth) / Math.max(1, window.innerHeight),
    0.1,
    500,
  );
  camera.position.set(0, 0, budget.cameraZ);

  const group = new THREE.Group();
  scene.add(group);

  /* ── Field ── */
  const material = buildShaderMaterial();
  const field = buildField(sampler, {
    count: budget.count,
    rimShare: budget.rimShare,
    haloCount: budget.haloCount,
  });
  status.pointCount = field.total;
  const points = new THREE.Points(field.geom, material);
  points.frustumCulled = false;
  group.add(points);
  group.position.z = camera.position.z - budget.farZ;

  /* ── Starfield (two layers, referenced drift) ── */
  const starA = new THREE.Points(buildStarLayer(900, [30, 90], 0.5, 0.06), material);
  const starB = new THREE.Points(buildStarLayer(700, [25, 80], 0.32, 0.10), material);
  starA.frustumCulled = false;
  starB.frustumCulled = false;
  scene.add(starA);
  scene.add(starB);
  status.webgl = true;

  /* ── Lenis (optional, skipped in reduced-motion). ── */
  let lenis = null;
  const Lenis = status.reducedMotion ? null : await loadLenis();

  function createLenis() {
    if (lenis || !Lenis || status.reducedMotion) return;
    try {
      lenis = new Lenis({ autoRaf: false, smoothWheel: true });
    } catch (_) { lenis = null; }
  }
  function destroyLenis() {
    if (lenis) { try { lenis.destroy(); } catch (_) {} lenis = null; }
  }
  createLenis();

  const state = { y: 0, H: window.innerHeight, time: 0, dt: 0, last: performance.now() / 1000 };
  const scrollSource = () => (lenis ? lenis.scroll : window.scrollY || 0);

  /* ── Single RAF bus — one requestAnimationFrame with Set subscribers. ── */
  const subscribers = new Set();
  let rafId = 0;
  let busRunning = false;
  let destroyed = false;

  function busStart() {
    if (busRunning || destroyed || document.hidden || status.reducedMotion || status.paused) return;
    busRunning = true;
    state.last = performance.now() / 1000;
    rafId = requestAnimationFrame(busFrame);
  }
  function busStop() {
    busRunning = false;
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
  }
  function busFrame(nowMs) {
    if (!busRunning || destroyed || document.hidden || status.reducedMotion || status.paused) return;
    const now = nowMs / 1000;
    const dtRaw = now - state.last;
    state.last = now;
    state.dt = Math.min(dtRaw, 0.1);
    state.time += state.dt;
    for (const fn of subscribers) fn(state);
    rafId = requestAnimationFrame(busFrame);
  }

  /* ── CALM SDF measurement — resize only. ── */
  const calmParked = new THREE.Vector4(99, 99, 0, 0);
  material.uniforms.uCalmA.value.copy(calmParked);
  material.uniforms.uCalmB.value.copy(calmParked);

  function measureCalm() {
    const title = document.getElementById('title');
    const lede  = document.getElementById('lede');
    function rectToClip(el, vec) {
      if (!el) { vec.copy(calmParked); return; }
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) { vec.copy(calmParked); return; }
      const cx = r.left + r.width * 0.5;
      const cy = r.top  + r.height * 0.5;
      const w = window.innerWidth  || 1;
      const h = window.innerHeight || 1;
      const nx =  (cx / w) * 2 - 1;
      const ny = -(cy / h) * 2 + 1;
      const halfW = (r.width  / w);
      const halfH = (r.height / h);
      vec.set(nx, ny, halfW, halfH);
    }
    rectToClip(title, material.uniforms.uCalmA.value);
    rectToClip(lede,  material.uniforms.uCalmB.value);
  }

  /* ── Pointer for the cursor hole ── */
  const pointer = { live: false, ndc: new THREE.Vector2() };
  const onPointerMove = (e) => {
    pointer.live = true;
    const w = window.innerWidth  || 1;
    const h = window.innerHeight || 1;
    pointer.ndc.x =  (e.clientX / w) * 2 - 1;
    pointer.ndc.y = -(e.clientY / h) * 2 + 1;
  };
  const onPointerLeave = () => { pointer.live = false; };

  /* ── Resize ── */
  function onResize() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    state.H = h;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, budget.maxDpr));
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const dbh = renderer.domElement.height;
    material.uniforms.uScale.value = dbh * 0.5;
    material.uniforms.uMinPx.value = 1.4 * Math.min(window.devicePixelRatio || 1, 2);
    measureCalm();
  }

  /* ── Media-query listeners ── */
  function onReducedChange() {
    status.reducedMotion = reduced.matches;
    if (reduced.matches) {
      status.motionOn = false;
      material.uniforms.uMotion.value = 0;
      destroyLenis();
      busStop();
      renderer.domElement.hidden = true;
      if (baseline) baseline.hidden = false;
      status.fallback = true;
    } else {
      // Respect explicit user pause — only restart if not paused.
      if (!status.paused) {
        status.motionOn = true;
        material.uniforms.uMotion.value = 1;
        renderer.domElement.hidden = false;
        status.fallback = false;
        createLenis();
        if (!document.hidden) busStart();
      }
    }
    syncPauseButton();
  }

  /* ── Visibility change ── */
  function onVisibilityChange() {
    if (document.hidden) {
      busStop();
    } else if (!destroyed && !status.paused && !status.reducedMotion) {
      renderer.domElement.hidden = false;
      createLenis();
      busStart();
    }
  }

  /* ── Cursor hole solver (fine pointer only) ── */
  const ray = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const groupPlane = new THREE.Plane();
  const worldNormal = new THREE.Vector3();
  const hit = new THREE.Vector3();
  const localHit = new THREE.Vector3();
  const groupInv = new THREE.Matrix4();
  const viewDir = new THREE.Vector3();
  const perp1 = new THREE.Vector3();
  const perp2 = new THREE.Vector3();
  const anglePicker = new Float32Array(field.total);
  for (let i = 0; i < field.total; i++) anglePicker[i] = Math.random() * Math.PI * 2;
  const jitter = new Float32Array(field.total);
  for (let i = 0; i < field.total; i++) jitter[i] = 0.92 + Math.random() * 0.16;
  let solvingEnergy = 0;

  /* ── Frame step (RAF bus subscriber) ── */
  let userPaused = false;
  status.paused = false;
  status.motionOn = !status.reducedMotion;
  material.uniforms.uMotion.value = status.motionOn ? 1 : 0;

  function smoothstep(x) { return x * x * (3 - 2 * x); }

  function step() {
    if (lenis) lenis.raf(performance.now());

    const y = scrollSource();
    state.y = y;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - state.H);
    const t = Math.min(1, Math.max(0, y / maxScroll));

    const progress = Math.min(1, Math.max(0, t / 0.34));
    const burst    = Math.min(1, Math.max(0, (t - 0.76) / 0.24));

    status.progress = progress;
    status.burst = burst;

    // Logarithmic dolly — using arrival progress, not raw t.
    const near = budget.cameraZ;
    const far  = budget.farZ;
    const kk = 0.7 * progress + 0.3 * smoothstep(progress);
    const distance = far * Math.pow(near / far, kk);
    group.position.z = camera.position.z - distance;

    // Extra arrival yaw.
    const scrollYaw = progress * budget.scrollSpin;

    // Motion-driven group rotation.
    // autoSpin = 0 (flat-shape exception); sway = 0.6.
    const timeYaw = state.time * budget.autoSpin
                  + Math.sin(state.time * budget.swaySpeed) * budget.sway;
    group.rotation.y = timeYaw + scrollYaw;
    group.rotation.x = budget.tilt + Math.sin(state.time * 0.09) * budget.wobble;

    // Parallax drift fade 1→0 over progress 0.10 → 0.60
    const parallaxFade = 1 - Math.min(1, Math.max(0, (progress - 0.10) / 0.50));
    group.position.x = pointer.ndc.x * budget.parallax * 0.35 * parallaxFade;
    group.position.y = pointer.ndc.y * budget.parallax * 0.20 * parallaxFade;

    // Uniforms driven by scroll.
    const pClamp = Math.min(1, Math.max(0, (progress - 0.05) / 0.70));
    material.uniforms.uLife.value  = 0.18 + 0.82 * smoothstep(pClamp);
    material.uniforms.uBurst.value = burst;
    material.uniforms.uTime.value  = state.time;
    const calmFade = 1 - Math.min(1, Math.max(0, (progress - 0.35) / 0.20));
    material.uniforms.uCalmOn.value = calmFade;

    // Star drift (referenced).
    starA.rotation.y += state.dt * 0.004;
    starB.rotation.y -= state.dt * 0.006;
    starA.rotation.x = pointer.ndc.y * 0.08;
    starB.rotation.x = pointer.ndc.y * 0.05;

    // Cursor hole — punch to exact rim.
    const holeEnabled = status.motionOn
      && status.finePointer
      && pointer.live
      && progress >= 0.98
      && burst < 0.5
      && Math.abs(pointer.ndc.x) <= 1;

    group.updateMatrixWorld(true);
    solveHole(holeEnabled);

    renderer.render(scene, camera);
    if (baseline) baseline.hidden = true;
  }

  subscribers.add(step);

  function solveHole(enabled) {
    const holeR = budget.holeRadiusRel * Math.max(sampler.halfW, sampler.halfH);
    const holeR2 = holeR * holeR;

    let cx = 0, cy = 0, cz = 0, hasCentre = false;
    if (enabled) {
      ray.setFromCamera(pointer.ndc, camera);
      worldNormal.set(0, 0, 1).applyQuaternion(group.quaternion).normalize();
      groupPlane.setFromNormalAndCoplanarPoint(worldNormal, group.position);
      if (ray.ray.intersectPlane(groupPlane, hit)) {
        groupInv.copy(group.matrixWorld).invert();
        localHit.copy(hit).applyMatrix4(groupInv);
        cx = localHit.x; cy = localHit.y; cz = localHit.z;
        hasCentre = true;
      }
    }
    if (hasCentre) {
      viewDir.copy(camera.position).sub(hit).normalize();
      const rotInv = new THREE.Matrix4().extractRotation(group.matrixWorld).invert();
      viewDir.applyMatrix4(rotInv).normalize();
      const tmp = Math.abs(viewDir.x) < 0.9
        ? new THREE.Vector3(1, 0, 0)
        : new THREE.Vector3(0, 1, 0);
      perp1.copy(tmp).sub(viewDir.clone().multiplyScalar(tmp.dot(viewDir))).normalize();
      perp2.copy(viewDir).cross(perp1).normalize();
    }

    const posAttr = field.geom.getAttribute('position');
    const positions = posAttr.array;
    const rest = field.restPos;
    const off = field.offset;
    let energy = 0;

    for (let i = 0; i < field.total; i++) {
      const rx = rest[i*3+0];
      const ry = rest[i*3+1];
      const rz = rest[i*3+2];

      let targetOx = 0, targetOy = 0, targetOz = 0;
      let inside = false;

      if (enabled && hasCentre) {
        const dx = rx - cx, dy = ry - cy, dz = rz - cz;
        const along = dx * viewDir.x + dy * viewDir.y + dz * viewDir.z;
        const ppx = dx - along * viewDir.x;
        const ppy = dy - along * viewDir.y;
        const ppz = dz - along * viewDir.z;
        const pp2 = ppx*ppx + ppy*ppy + ppz*ppz;
        if (pp2 < holeR2) {
          inside = true;
          const targetR = holeR * jitter[i];
          const len = Math.sqrt(pp2);
          let ux, uy, uz;
          if (len > 1e-4) {
            ux = ppx / len; uy = ppy / len; uz = ppz / len;
          } else {
            const a = anglePicker[i];
            ux = Math.cos(a) * perp1.x + Math.sin(a) * perp2.x;
            uy = Math.cos(a) * perp1.y + Math.sin(a) * perp2.y;
            uz = Math.cos(a) * perp1.z + Math.sin(a) * perp2.z;
          }
          const rimX = cx + ux * targetR;
          const rimY = cy + uy * targetR;
          const rimZ = cz + uz * targetR;
          targetOx = rimX - rx;
          targetOy = rimY - ry;
          targetOz = rimZ - rz;
        }
      }

      const k = inside ? budget.springIn : budget.springOut;
      const nx = off[i*3+0] + (targetOx - off[i*3+0]) * k;
      const ny = off[i*3+1] + (targetOy - off[i*3+1]) * k;
      const nz = off[i*3+2] + (targetOz - off[i*3+2]) * k;
      off[i*3+0] = nx;
      off[i*3+1] = ny;
      off[i*3+2] = nz;
      energy += nx*nx + ny*ny + nz*nz;

      positions[i*3+0] = rx + nx;
      positions[i*3+1] = ry + ny;
      positions[i*3+2] = rz + nz;
    }
    solvingEnergy = energy / Math.max(1, field.total);

    if (!enabled && solvingEnergy < 0.02) {
      for (let i = 0; i < field.total; i++) {
        off[i*3+0] = 0; off[i*3+1] = 0; off[i*3+2] = 0;
        positions[i*3+0] = rest[i*3+0];
        positions[i*3+1] = rest[i*3+1];
        positions[i*3+2] = rest[i*3+2];
      }
    }
    posAttr.needsUpdate = true;
  }

  /* ── Pause / resume: static image plus native scrolling ── */
  function syncPauseButton() {
    const btn = document.querySelector('.pause-toggle');
    if (!btn) return;
    const locked = status.reducedMotion || !status.webgl || destroyed;
    btn.disabled = locked;
    btn.setAttribute('aria-pressed', String(locked || status.paused));
    btn.textContent = locked ? 'Motion paused' : status.paused ? 'Resume motion' : 'Pause motion';
  }
  function pause() {
    if (destroyed || userPaused) return;
    userPaused = true;
    status.paused = true;
    status.motionOn = false;
    status.fallback = true;
    material.uniforms.uMotion.value = 0;
    destroyLenis();
    busStop();
    renderer.domElement.hidden = true;
    if (baseline) baseline.hidden = false;
    syncPauseButton();
  }
  function resume() {
    if (destroyed || !userPaused) return;
    userPaused = false;
    status.paused = false;
    status.motionOn = !status.reducedMotion;
    material.uniforms.uMotion.value = status.motionOn ? 1 : 0;
    if (!status.reducedMotion) {
      renderer.domElement.hidden = false;
      status.fallback = false;
      if (!document.hidden) {
        createLenis();
        busStart();
      }
    }
    syncPauseButton();
  }
  function onPauseClick() {
    if (destroyed || status.reducedMotion) return;
    if (userPaused) resume(); else pause();
  }
  function onFineChange() { status.finePointer = fine.matches; }
  function setupPauseToggle(staticMode) {
    const btn = document.querySelector('.pause-toggle');
    if (!btn) return;
    const controls = btn.closest('.motion-controls');
    if (controls) controls.hidden = false;
    if (staticMode) {
      btn.disabled = true;
      btn.setAttribute('aria-pressed', 'true');
      btn.textContent = 'Motion paused';
      return;
    }
    syncPauseButton();
    btn.addEventListener('click', onPauseClick);
  }

  /* ── Register all named listeners ── */
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('pointerleave', onPointerLeave, { passive: true });
  window.addEventListener('blur', onPointerLeave);
  window.addEventListener('resize', onResize);
  document.addEventListener('visibilitychange', onVisibilityChange);
  reduced.addEventListener?.('change', onReducedChange);
  fine.addEventListener?.('change', onFineChange);

  onResize();
  setupPauseToggle(false);

  status.ready = true;
  busStart();

  /* ── Destroy (idempotent) ── */
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    busStop();
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerleave', onPointerLeave);
    window.removeEventListener('blur', onPointerLeave);
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    // Media-query cleanup (safe if addEventListener was used).
    try { reduced.removeEventListener('change', onReducedChange); } catch (_) {}
    try { fine.removeEventListener('change', onFineChange); } catch (_) {}
    document.querySelector('.pause-toggle')?.removeEventListener('click', onPauseClick);
    destroyLenis();
    material.dispose();
    field.geom.dispose();
    starA.geometry.dispose();
    starB.geometry.dispose();
    renderer.dispose();
    if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    if (sampler.dispose) sampler.dispose();
    // Remove any temporary static fallback SVG.
    const fb = host.querySelector('.pf-fallback');
    if (fb) fb.remove();
    subscribers.clear();
    if (baseline) baseline.hidden = false;
    syncPauseButton();
  }

  /* ── Expose handles on window.field ── */
  window.field = {
    scene,
    camera,
    renderer,
    group,
    material,
    motion: { state, budget },
    webgl: true,
    status,
    step,
    setCalmTargets: measureCalm,
    setShape: null,
    stats: null,
    destroy,
  };
}

function exposeFallbackHandle() {
  if (!window.field) {
    window.field = {
      scene: null, camera: null, renderer: null, group: null,
      material: null, motion: null, webgl: false,
      status: { webgl: false, fallback: true, motionOn: false, paused: false,
                progress: 0, burst: 0, pointCount: 0 },
      step: null, setCalmTargets: null, setShape: null, stats: null, destroy: null,
    };
  }
}

boot().catch(err => {
  console.warn('[selemene motion] boot failed, static fallback stays', err);
  exposeFallbackHandle();
});
