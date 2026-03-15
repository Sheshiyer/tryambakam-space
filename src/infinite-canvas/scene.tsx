import { KeyboardControls, Stats, shaderMaterial, useKeyboardControls, useProgress, PerformanceMonitor } from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import { useIsTouchDevice } from "~/src/use-is-touch-device";
import { useMobile } from "~/src/use-mobile";
import { clamp, lerp, playAudioCue } from "~/src/utils";
import {
  CHUNK_FADE_MARGIN,
  CHUNK_OFFSETS,
  CHUNK_SIZE,
  DEPTH_FADE_END,
  DEPTH_FADE_START,
  INITIAL_CAMERA_Z,
  INVIS_THRESHOLD,
  KEYBOARD_SPEED,
  MAX_VELOCITY,
  RENDER_DISTANCE,
  VELOCITY_DECAY,
  VELOCITY_LERP,
} from "./constants";
import styles from "./style.module.css";
import { getTexture } from "./texture-manager";
import type { ChunkData, InfiniteCanvasProps, MediaItem, PlaneData } from "./types";
import { generateChunkPlanesCached, getChunkUpdateThrottleMs, shouldThrottleUpdate } from "./utils";

const PLANE_GEOMETRY = new THREE.PlaneGeometry(1, 1);

const OrganicNodeMaterial = shaderMaterial(
  {
    uTexture: new THREE.Texture(),
    uOpacity: 0,
    uHover: 0,
    uTime: 0,
  },
  // vertex shader
  `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // fragment shader
  `
  uniform sampler2D uTexture;
  uniform float uOpacity;
  uniform float uHover;
  uniform float uTime;
  varying vec2 vUv;

  float random(vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
      float value = 0.0;
      float amplitude = 0.5;
      for (int i = 0; i < 5; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
      }
      return value;
  }

  void main() {
      float t = uTime * 0.4;
      
      // Basic image texture
      vec4 texColor = texture2D(uTexture, vUv);
      
      // Calculate local luminance for edge detection
      float dx = 0.005;
      float dy = 0.005;
      
      // Read neighboring pixels to find natural contours
      float l_center = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
      float l_right  = dot(texture2D(uTexture, vUv + vec2(dx, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
      float l_up     = dot(texture2D(uTexture, vUv + vec2(0.0, dy)).rgb, vec3(0.299, 0.587, 0.114));
      
      // Cheap gradient magnitude (edge strength)
      float gradX = l_right - l_center;
      float gradY = l_up - l_center;
      float edge = length(vec2(gradX, gradY));
      
      // Amplify edge to make it a distinct mask
      float edgeMask = smoothstep(0.02, 0.15, edge);
      
      // Domain warping for Art Nouveau whiplash curves
      vec2 q = vec2(0.0);
      q.x = fbm(vUv * 3.0 + vec2(t, 0.0));
      q.y = fbm(vUv * 3.0 + vec2(0.0, t));
      
      vec2 r = vec2(0.0);
      r.x = fbm(vUv * 2.0 + q + vec2(1.7, 9.2) + 0.15 * t);
      r.y = fbm(vUv * 2.0 + q + vec2(8.3, 2.8) + 0.126 * t);
      float f = fbm(vUv * 2.0 + r);
      
      // Create fluid pulses moving through the noise field
      float pulseFlow = smoothstep(0.4, 0.8, sin(f * 15.0 - t * 3.0));
      
      // Tryambakam Consciousness Color Spectrum
      vec3 emerald = vec3(0.02, 0.58, 0.41); // #059669
      vec3 gold = vec3(0.85, 0.47, 0.02);    // #d97706
      vec3 indigo = vec3(0.31, 0.27, 0.90);  // #4F46E5
      
      // Ethereal color mixing based on noise vectors
      vec3 bioColor = mix(emerald, indigo, r.x);
      bioColor = mix(bioColor, gold, r.y * 0.6);
      
      // The magic trick: Route the bioluminescence *only* along the edges
      // and animate it with the noise flow.
      float structuralGlow = edgeMask * pulseFlow;
      
      // Slightly reveal the glow on hover, keep it subtle otherwise
      float hoverIntensity = mix(0.3, 1.5, uHover);
      
      vec3 finalColor = texColor.rgb;
      
      // Inject the structural bioluminescence
      finalColor += bioColor * structuralGlow * hoverIntensity;
      
      // Optional: Add a very faint chromatic shift to the entire image on hover
      float aberrationShift = 0.005 * uHover;
      float rChannel = texture2D(uTexture, vUv + vec2(aberrationShift, 0.0)).r;
      float bChannel = texture2D(uTexture, vUv - vec2(aberrationShift, 0.0)).b;
      vec3 shiftedColor = vec3(rChannel, texColor.g, bChannel);
      
      finalColor = mix(finalColor, shiftedColor + (bioColor * structuralGlow * hoverIntensity), uHover * 0.3);

      gl_FragColor = vec4(finalColor, texColor.a * uOpacity);
  }
  `
);

extend({ OrganicNodeMaterial });

const KEYBOARD_MAP = [
  { name: "forward", keys: ["w", "W", "ArrowUp"] },
  { name: "backward", keys: ["s", "S", "ArrowDown"] },
  { name: "left", keys: ["a", "A", "ArrowLeft"] },
  { name: "right", keys: ["d", "D", "ArrowRight"] },
  { name: "up", keys: ["e", "E"] },
  { name: "down", keys: ["q", "Q"] },
];

type KeyboardKeys = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
};

const getTouchDistance = (touches: Touch[]) => {
  if (touches.length < 2) {
    return 0;
  }

  const [t1, t2] = touches;
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};

type CameraGridState = {
  cx: number;
  cy: number;
  cz: number;
  camZ: number;
};

function MediaPlane({
  position,
  scale,
  media,
  mediaIndex,
  chunkCx,
  chunkCy,
  chunkCz,
  cameraGridRef,
  onMediaClick,
}: {
  position: THREE.Vector3;
  scale: THREE.Vector3;
  media: MediaItem;
  mediaIndex: number;
  chunkCx: number;
  chunkCy: number;
  chunkCz: number;
  cameraGridRef: React.RefObject<CameraGridState>;
  onMediaClick?: (mediaIndex: number) => void;
}) {
  const groupRef = React.useRef<THREE.Group>(null);
  const materialRef = React.useRef<any>(null); // any needed to avoid complex prop type errors with custom JSX elements
  const localState = React.useRef({ opacity: 0, frame: 0, ready: false, hovered: false, hoverFactor: 0.0 });
  const { isTouchDevice } = useMobile();

  const [texture, setTexture] = React.useState<THREE.Texture | null>(null);
  const [isReady, setIsReady] = React.useState(false);
  const [glitching, setGlitching] = React.useState(false);

  React.useEffect(() => {
    const start = () => setGlitching(true);
    const stop = () => setGlitching(false);
    window.addEventListener("glitch-start", start);
    window.addEventListener("glitch-stop", stop);
    return () => {
      window.removeEventListener("glitch-start", start);
      window.removeEventListener("glitch-stop", stop);
    };
  }, []);

  useFrame((stateCtx, delta) => {
    const material = materialRef.current;
    const group = groupRef.current;
    const state = localState.current;

    if (!material || !group) {
      return;
    }

    state.frame = (state.frame + 1) & 1;

    // Update shader specific uniforms
    material.uTime = stateCtx.clock.elapsedTime;

    if (glitching) {
      group.position.set(
        position.x + (Math.random() - 0.5) * 5,
        position.y + (Math.random() - 0.5) * 5,
        position.z + (Math.random() - 0.5) * 2
      );
      material.uHover = 1.0;
      material.uOpacity = Math.random() > 0.5 ? 1 : 0.5;
      group.visible = true;
      return;
    }

    group.position.copy(position);

    if (state.opacity < INVIS_THRESHOLD && !group.visible && state.frame === 0) {
      return;
    }

    const cam = cameraGridRef.current;
    const dist = Math.max(Math.abs(chunkCx - cam.cx), Math.abs(chunkCy - cam.cy), Math.abs(chunkCz - cam.cz));
    const absDepth = Math.abs(position.z - cam.camZ);

    if (absDepth > DEPTH_FADE_END + 50) {
      state.opacity = 0;
      material.uOpacity = 0;
      material.depthWrite = false;
      group.visible = false;
      return;
    }

    const gridFade =
      dist <= RENDER_DISTANCE ? 1 : Math.max(0, 1 - (dist - RENDER_DISTANCE) / Math.max(CHUNK_FADE_MARGIN, 0.0001));

    const depthFade =
      absDepth <= DEPTH_FADE_START
        ? 1
        : Math.max(0, 1 - (absDepth - DEPTH_FADE_START) / Math.max(DEPTH_FADE_END - DEPTH_FADE_START, 0.0001));

    const baseFade = Math.min(gridFade, depthFade * depthFade);

    const hoverTarget = state.hovered ? 1.0 : 0.0;
    state.hoverFactor = lerp(state.hoverFactor, hoverTarget, Math.max(delta, 0.08));
    material.uHover = state.hoverFactor;

    const target = baseFade * (0.3 + state.hoverFactor * 0.7); // Adjust opacity calculation to scale up when hovered

    state.opacity = target < INVIS_THRESHOLD && state.opacity < INVIS_THRESHOLD ? 0 : lerp(state.opacity, target, 0.18);

    const isFullyOpaque = state.opacity > 0.99;
    material.uOpacity = isFullyOpaque ? 1 : state.opacity;
    material.depthWrite = isFullyOpaque;
    group.visible = state.opacity > INVIS_THRESHOLD;
  });

  const displayScale = React.useMemo(() => {
    if (media.width && media.height) {
      const aspect = media.width / media.height;
      return new THREE.Vector3(scale.y * aspect, scale.y, 1);
    }
    return scale;
  }, [media.width, media.height, scale]);

  React.useEffect(() => {
    const state = localState.current;
    state.ready = false;
    state.opacity = 0;
    setIsReady(false);

    const material = materialRef.current;
    if (material) {
      material.uOpacity = 0;
      material.depthWrite = false;
      material.uTexture = null;
    }

    const tex = getTexture(media, () => {
      state.ready = true;
      setIsReady(true);
    });

    setTexture(tex);
  }, [media]);

  React.useEffect(() => {
    const material = materialRef.current;
    const group = groupRef.current;
    const state = localState.current;

    if (!material || !group || !texture || !isReady || !state.ready) {
      return;
    }

    material.uTexture = texture;
    material.uOpacity = state.opacity;
    material.depthWrite = state.opacity >= 1;
    group.scale.copy(displayScale);
  }, [displayScale, texture, isReady]);

  const onPointerOver = React.useCallback(
    (e: any) => {
      e.stopPropagation();
      if (glitching) return;
      localState.current.hovered = true;
      document.body.style.cursor = "pointer";
      playAudioCue("hover");
    },
    [glitching]
  );

  const onPointerOut = React.useCallback((e: any) => {
    e.stopPropagation();
    localState.current.hovered = false;
    document.body.style.cursor = "";
  }, []);

  const handleClick = React.useCallback(
    (e: any) => {
      e.stopPropagation();
      if (glitching) return;
      
      // On mobile, first tap simulates hover, second tap clicks
      if (isTouchDevice && !localState.current.hovered) {
        localState.current.hovered = true;
        playAudioCue("hover");
        return;
      }
      onMediaClick?.(mediaIndex);
    },
    [onMediaClick, mediaIndex, glitching, isTouchDevice]
  );

  return (
    <group
      ref={groupRef}
      position={position}
      scale={displayScale}
      visible={false}
    >
      <mesh geometry={PLANE_GEOMETRY}>
        {/* @ts-ignore */}
        <organicNodeMaterial ref={materialRef} transparent side={THREE.DoubleSide} />
      </mesh>
      {/* Invisible hitbox for mobile raycasting - scales slightly bigger */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: mesh is not a DOM element */}
      <mesh
        geometry={PLANE_GEOMETRY}
        scale={[1.25, 1.25, 1]}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onClick={handleClick}
        onPointerDown={handleClick} // Fast response on touch down
      >
        <meshBasicMaterial visible={false} />
      </mesh>
    </group>
  );
}

function Chunk({
  cx,
  cy,
  cz,
  media,
  cameraGridRef,
  onMediaClick,
}: {
  cx: number;
  cy: number;
  cz: number;
  media: MediaItem[];
  cameraGridRef: React.RefObject<CameraGridState>;
  onMediaClick?: (mediaIndex: number) => void;
}) {
  const [planes, setPlanes] = React.useState<PlaneData[] | null>(null);

  React.useEffect(() => {
    let canceled = false;
    const run = () => !canceled && setPlanes(generateChunkPlanesCached(cx, cy, cz));

    if (typeof requestIdleCallback !== "undefined") {
      const id = requestIdleCallback(run, { timeout: 100 });

      return () => {
        canceled = true;
        cancelIdleCallback(id);
      };
    }

    const id = setTimeout(run, 0);
    return () => {
      canceled = true;
      clearTimeout(id);
    };
  }, [cx, cy, cz]);

  if (!planes) {
    return null;
  }

  return (
    <group>
      {planes.map((plane) => {
        const mediaItem = media[plane.mediaIndex % media.length];

        if (!mediaItem) {
          return null;
        }

        return (
          <MediaPlane
            key={plane.id}
            position={plane.position}
            scale={plane.scale}
            media={mediaItem}
            mediaIndex={plane.mediaIndex % media.length}
            chunkCx={cx}
            chunkCy={cy}
            chunkCz={cz}
            cameraGridRef={cameraGridRef}
            onMediaClick={onMediaClick}
          />
        );
      })}
    </group>
  );
}

type ControllerState = {
  velocity: { x: number; y: number; z: number };
  targetVel: { x: number; y: number; z: number };
  basePos: { x: number; y: number; z: number };
  drift: { x: number; y: number };
  mouse: { x: number; y: number };
  lastMouse: { x: number; y: number };
  scrollAccum: number;
  isDragging: boolean;
  lastTouches: Touch[];
  lastTouchDist: number;
  lastChunkKey: string;
  lastChunkUpdate: number;
  pendingChunk: { cx: number; cy: number; cz: number } | null;
};

const createInitialState = (camZ: number): ControllerState => ({
  velocity: { x: 0, y: 0, z: 0 },
  targetVel: { x: 0, y: 0, z: 0 },
  basePos: { x: 0, y: 0, z: camZ },
  drift: { x: 0, y: 0 },
  mouse: { x: 0, y: 0 },
  lastMouse: { x: 0, y: 0 },
  scrollAccum: 0,
  isDragging: false,
  lastTouches: [],
  lastTouchDist: 0,
  lastChunkKey: "",
  lastChunkUpdate: 0,
  pendingChunk: null,
});

function SceneController({
  media,
  onTextureProgress,
  onLoadingComplete,
  onMediaClick,
}: {
  media: MediaItem[];
  onTextureProgress?: (progress: number) => void;
  onLoadingComplete?: () => void;
  onMediaClick?: (mediaIndex: number) => void;
}) {
  const { camera, gl } = useThree();
  const isTouchDevice = useIsTouchDevice();
  const [, getKeys] = useKeyboardControls<keyof KeyboardKeys>();

  const state = React.useRef<ControllerState>(createInitialState(INITIAL_CAMERA_Z));
  const cameraGridRef = React.useRef<CameraGridState>({ cx: 0, cy: 0, cz: 0, camZ: camera.position.z });

  const [chunks, setChunks] = React.useState<ChunkData[]>([]);

  const { progress } = useProgress();
  const maxProgress = React.useRef(0);

  React.useEffect(() => {
    // Removed old GSAP rotation and quickSetters
    // Geometric gauge is static but animates via CSS breathe keyframes
  }, []);

  React.useEffect(() => {
    const rounded = Math.round(progress);

    if (rounded > maxProgress.current) {
      maxProgress.current = rounded;
      onTextureProgress?.(rounded);
    }
    
    // Trigger loading complete when we hit 100%
    if (rounded >= 100 && onLoadingComplete) {
      const timer = setTimeout(() => {
        onLoadingComplete();
      }, 500); // Small delay to ensure smooth transition
      return () => clearTimeout(timer);
    }
  }, [progress, onTextureProgress, onLoadingComplete]);

  React.useEffect(() => {
    const canvas = gl.domElement;
    const s = state.current;
    canvas.style.cursor = "grab";

    const setCursor = (cursor: string) => {
      canvas.style.cursor = cursor;
    };

    const onMouseDown = (e: MouseEvent) => {
      // Just start dragging - keep drift frozen at current value
      s.isDragging = true;
      s.lastMouse = { x: e.clientX, y: e.clientY };
      setCursor("grabbing");
    };

    const onMouseUp = () => {
      s.isDragging = false;
      setCursor("grab");
    };

    const onMouseLeave = () => {
      s.mouse = { x: 0, y: 0 };
      s.isDragging = false;
      setCursor("grab");
    };

    const onMouseMove = (e: MouseEvent) => {
      s.mouse = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };

      if (s.isDragging) {
        s.targetVel.x -= (e.clientX - s.lastMouse.x) * 0.045;
        s.targetVel.y += (e.clientY - s.lastMouse.y) * 0.045;
        s.lastMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      s.scrollAccum += e.deltaY * 0.008;
    };

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      s.lastTouches = Array.from(e.touches) as Touch[];
      s.lastTouchDist = getTouchDistance(s.lastTouches);
      setCursor("grabbing");
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touches = Array.from(e.touches) as Touch[];

      if (touches.length === 1 && s.lastTouches.length >= 1) {
        const [touch] = touches;
        const [last] = s.lastTouches;

        if (touch && last) {
          s.targetVel.x -= (touch.clientX - last.clientX) * 0.035;
          s.targetVel.y += (touch.clientY - last.clientY) * 0.035;
        }
      } else if (touches.length === 2 && s.lastTouchDist > 0) {
        const dist = getTouchDistance(touches);
        s.scrollAccum += (s.lastTouchDist - dist) * 0.008;
        s.lastTouchDist = dist;
      }

      s.lastTouches = touches;
    };

    const onTouchEnd = (e: TouchEvent) => {
      s.lastTouches = Array.from(e.touches) as Touch[];
      s.lastTouchDist = getTouchDistance(s.lastTouches);
      setCursor("grab");
    };

    const onImpulse = (e: CustomEvent) => {
      s.targetVel.x += e.detail.x;
      s.targetVel.y += e.detail.y;
    };

    canvas.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("canvas-impulse", onImpulse as EventListener);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("canvas-impulse", onImpulse as EventListener);
    };
  }, [gl]);

  useFrame(() => {
    const s = state.current;
    const now = performance.now();

    const { forward, backward, left, right, up, down } = getKeys();
    if (forward) s.targetVel.z -= KEYBOARD_SPEED;
    if (backward) s.targetVel.z += KEYBOARD_SPEED;
    if (left) s.targetVel.x -= KEYBOARD_SPEED;
    if (right) s.targetVel.x += KEYBOARD_SPEED;
    if (down) s.targetVel.y -= KEYBOARD_SPEED;
    if (up) s.targetVel.y += KEYBOARD_SPEED;

    const isZooming = Math.abs(s.velocity.z) > 0.05;
    const zoomFactor = clamp(s.basePos.z / 50, 0.3, 2.0);
    const driftAmount = 8.0 * zoomFactor;
    const driftLerp = isZooming ? 0.2 : 0.12;

    if (s.isDragging) {
      // Freeze drift during drag - keep it at current value
    } else if (isTouchDevice) {
      s.drift.x = lerp(s.drift.x, 0, driftLerp);
      s.drift.y = lerp(s.drift.y, 0, driftLerp);
    } else {
      s.drift.x = lerp(s.drift.x, s.mouse.x * driftAmount, driftLerp);
      s.drift.y = lerp(s.drift.y, s.mouse.y * driftAmount, driftLerp);
    }

    s.targetVel.z += s.scrollAccum;
    s.scrollAccum *= 0.8;

    s.targetVel.x = clamp(s.targetVel.x, -MAX_VELOCITY, MAX_VELOCITY);
    s.targetVel.y = clamp(s.targetVel.y, -MAX_VELOCITY, MAX_VELOCITY);
    s.targetVel.z = clamp(s.targetVel.z, -MAX_VELOCITY, MAX_VELOCITY);

    s.velocity.x = lerp(s.velocity.x, s.targetVel.x, VELOCITY_LERP);
    s.velocity.y = lerp(s.velocity.y, s.targetVel.y, VELOCITY_LERP);
    s.velocity.z = lerp(s.velocity.z, s.targetVel.z, VELOCITY_LERP);

    s.basePos.x += s.velocity.x;
    s.basePos.y += s.velocity.y;
    s.basePos.z += s.velocity.z;

    camera.position.set(s.basePos.x + s.drift.x, s.basePos.y + s.drift.y, s.basePos.z);

    s.targetVel.z *= VELOCITY_DECAY;

    // Output bio-rhythm "Heart Rate Variability" proxy to the CSS DOM
    // When idle it pulses slowly (8s Coherence Emerald). When frantic it pulses fast (1s).
    const velMag = Math.sqrt(s.velocity.x ** 2 + s.velocity.y ** 2 + s.velocity.z ** 2);
    const breatheSpeed = Math.max(1.0, 8.0 - velMag * 14.0);
    document.documentElement.style.setProperty("--breathe-speed", `${breatheSpeed}s`);

    // Removed minimap radar coordinate updates
    // The scene is entirely felt based on current view/chunks, not a specific coordinate map.

    const cx = Math.floor(s.basePos.x / CHUNK_SIZE);
    const cy = Math.floor(s.basePos.y / CHUNK_SIZE);
    const cz = Math.floor(s.basePos.z / CHUNK_SIZE);

    cameraGridRef.current = { cx, cy, cz, camZ: s.basePos.z };

    const key = `${cx},${cy},${cz}`;
    if (key !== s.lastChunkKey) {
      s.pendingChunk = { cx, cy, cz };
      s.lastChunkKey = key;
    }

    const throttleMs = getChunkUpdateThrottleMs(isZooming, Math.abs(s.velocity.z));

    if (s.pendingChunk && shouldThrottleUpdate(s.lastChunkUpdate, throttleMs, now)) {
      const { cx: ucx, cy: ucy, cz: ucz } = s.pendingChunk;
      s.pendingChunk = null;
      s.lastChunkUpdate = now;

      setChunks(
        CHUNK_OFFSETS.map((o) => ({
          key: `${ucx + o.dx},${ucy + o.dy},${ucz + o.dz}`,
          cx: ucx + o.dx,
          cy: ucy + o.dy,
          cz: ucz + o.dz,
        }))
      );
    }
  });

  React.useEffect(() => {
    const s = state.current;
    s.basePos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };

    setChunks(
      CHUNK_OFFSETS.map((o) => ({
        key: `${o.dx},${o.dy},${o.dz}`,
        cx: o.dx,
        cy: o.dy,
        cz: o.dz,
      }))
    );
  }, [camera]);

  return (
    <>
      {chunks.map((chunk) => (
        <Chunk
          key={chunk.key}
          cx={chunk.cx}
          cy={chunk.cy}
          cz={chunk.cz}
          media={media}
          cameraGridRef={cameraGridRef}
          onMediaClick={onMediaClick}
        />
      ))}
    </>
  );
}

function TheQuineMirror() {
  const [hovered, setHover] = React.useState(false);
  const routerClick = React.useCallback(() => {
    playAudioCue("open");
    window.dispatchEvent(new CustomEvent("trigger-init"));
  }, []);

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: mesh is not a DOM element
    <mesh
      position={[0, 0, -2]} // Placed right behind the initial camera focus
      onClick={routerClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHover(true);
        document.body.style.cursor = "pointer";
        playAudioCue("hover");
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHover(false);
        document.body.style.cursor = "";
      }}
    >
      <planeGeometry args={[100, 100]} />
      {/* Reflect the 13 wings around it */}
      <meshBasicMaterial color={hovered ? "#c4873b" : "#4F46E5"} transparent opacity={hovered ? 0.3 : 0.05} wireframe />
    </mesh>
  );
}

function LaBackground() {
  const { camera } = useThree();
  const { isTouchDevice, isLowTierGPU } = useMobile();
  const ref = React.useRef<THREE.Points>(null);

  const [positions] = React.useState(() => {
    const particleCount = isTouchDevice ? (isLowTierGPU ? 500 : 1200) : 3000;
    const coords = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      coords[i * 3] = (Math.random() - 0.5) * 2000;
      coords[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      coords[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    return coords;
  });

  useFrame(() => {
    if (ref.current) {
      // Parallax effect: The stars follow camera with high friction (0.9 drag)
      ref.current.position.x = camera.position.x * 0.9;
      ref.current.position.y = camera.position.y * 0.9;
      ref.current.position.z = camera.position.z * 0.9;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={1.5} color="#D97706" transparent opacity={0.3} sizeAttenuation fog={true} />
    </points>
  );
}

function BioluminescentEnvironment({ isMidnight, fogNear, fogFar }: { isMidnight: boolean; fogNear: number; fogFar: number }) {
  const { scene } = useThree();
  const voidBlack = React.useMemo(() => new THREE.Color("#111827"), []);
  // A dark representation of flow indigo for the deep fog
  const flowIndigoDeep = React.useMemo(() => new THREE.Color("#1A1A3A"), []);
  const midnight = React.useMemo(() => new THREE.Color("#2A0A10"), []);

  React.useEffect(() => {
    scene.background = new THREE.Color();
    scene.fog = new THREE.Fog(voidBlack, fogNear, fogFar);
  }, [scene, voidBlack, fogNear, fogFar]);

  useFrame(({ clock }) => {
    if (isMidnight) {
      if (scene.background instanceof THREE.Color) scene.background.copy(midnight);
      if (scene.fog) scene.fog.color.copy(midnight);
      return;
    }

    // Very slow continuous breathing for the void (approx 12s cycle)
    const t = (Math.sin(clock.elapsedTime * 0.5) + 1) / 2;

    if (scene.background instanceof THREE.Color) {
      // Subtle pulse: 0 to 0.4 mix with indigo
      scene.background.lerpColors(voidBlack, flowIndigoDeep, t * 0.6);
    }
    if (scene.fog) {
      scene.fog.color.copy(scene.background as THREE.Color);
    }
  });

  return null;
}

function CompassOverlay() {
  const thrust = (x: number, y: number) => {
    window.dispatchEvent(new CustomEvent("canvas-impulse", { detail: { x, y } }));
    playAudioCue("hover");
  };

  return (
    <>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: simple overlay */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: simple overlay */}
      <div className={`${styles.compassNode} ${styles.compassNorth}`} onClick={() => thrust(0, 20)}>
        <span className={styles.compassLabel}>STABILIZE</span>
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: simple overlay */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: simple overlay */}
      <div className={`${styles.compassNode} ${styles.compassSouth}`} onClick={() => thrust(0, -20)}>
        <span className={styles.compassLabel}>HEAL</span>
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: simple overlay */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: simple overlay */}
      <div className={`${styles.compassNode} ${styles.compassEast}`} onClick={() => thrust(20, 0)}>
        <span className={styles.compassLabel}>CREATE</span>
      </div>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: simple overlay */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: simple overlay */}
      <div className={`${styles.compassNode} ${styles.compassWest}`} onClick={() => thrust(-20, 0)}>
        <span className={styles.compassLabel}>MUTATE</span>
      </div>
    </>
  );
}

export function InfiniteCanvasScene({
  media,
  onTextureProgress,
  onLoadingComplete,
  onMediaClick,
  showFps = false,
  showControls = true,
  cameraFov = 60,
  cameraNear = 1,
  cameraFar = 600,
  fogNear = 160,
  fogFar = 420,
}: InfiniteCanvasProps) {
  const isTouchDevice = useIsTouchDevice();
  const maxDpr = isTouchDevice ? 1.5 : 2.0;
  const [dpr, setDpr] = React.useState(() => Math.min(window.devicePixelRatio || 1, isTouchDevice ? 1.25 : 1.5));
  const [isMidnight, setIsMidnight] = React.useState(false);
  const [showHints, setShowHints] = React.useState(false);
  const [showCompass, setShowCompass] = React.useState(false);

  React.useEffect(() => {
    const d = new Date();
    if (d.getHours() === 0 && d.getMinutes() <= 5) {
      setIsMidnight(true);
    }
  }, []);

  // Reveal compass + controls when .init easter egg triggers
  React.useEffect(() => {
    const revealCompass = () => setShowCompass(true);
    window.addEventListener("trigger-init", revealCompass);
    return () => window.removeEventListener("trigger-init", revealCompass);
  }, []);

  if (!media.length) {
    return null;
  }

  return (
    <KeyboardControls map={KEYBOARD_MAP}>
      <div className={styles.container}>
        <Canvas
          camera={{ position: [0, 0, INITIAL_CAMERA_Z], fov: cameraFov, near: cameraNear, far: cameraFar }}
          dpr={dpr}
          flat
          gl={{ antialias: false, powerPreference: "high-performance" }}
          className={styles.canvas}
        >
          <PerformanceMonitor 
            onIncline={() => setDpr(maxDpr)} 
            onDecline={() => setDpr(Math.max(1, dpr - 0.5))} 
            onChange={({ factor }) => setDpr(Math.round(1 + (maxDpr - 1) * factor * 10) / 10)} 
          />
          <BioluminescentEnvironment isMidnight={isMidnight} fogNear={fogNear} fogFar={fogFar} />
          <LaBackground />
          <SceneController media={media} onTextureProgress={onTextureProgress} onLoadingComplete={onLoadingComplete} onMediaClick={onMediaClick} />
          <TheQuineMirror />
          {showFps && <Stats className={styles.stats} />}
        </Canvas>

        {showCompass && <CompassOverlay />}

        {showControls && showCompass && (
          // biome-ignore lint/a11y/useKeyWithClickEvents: Click reveals visual hints only
          // biome-ignore lint/a11y/noStaticElementInteractions: UI overlay without focus necessity
          <div className={styles.controlsPanel} onClick={() => setShowHints((h) => !h)}>
            <div className={styles.geometryGaugeContainer}>
              {/* Sacred Geometry Compass replacing map */}
              <svg className={styles.geometryGauge} viewBox="-30 -30 60 60" xmlns="http://www.w3.org/2000/svg">
                {/* Outermost Boundary */}
                <circle className={styles.gaugeCircleOuter} cx="0" cy="0" r="28" />

                {/* 4-Point Compass Lines (Stabilize/Create/Mutate/Heal) */}
                <line className={styles.gaugeStarLine} x1="0" y1="-26" x2="0" y2="26" />
                <line className={styles.gaugeStarLine} x1="-26" y1="0" x2="26" y2="0" />

                {/* Inner Hex-like petals (Star of David base elements) */}
                <path className={styles.gaugePetal} d="M0 -15 L13 7.5 L-13 7.5 Z" />
                <path className={styles.gaugePetal} d="M0 15 L13 -7.5 L-13 -7.5 Z" />

                {/* Inner Coherence Sphere */}
                <circle className={styles.gaugeCircleInner} cx="0" cy="0" r="10" />
                <circle className={styles.gaugeCenter} cx="0" cy="0" r="2" />
              </svg>
            </div>
            {showHints &&
              (isTouchDevice ? (
                <div className={styles.controlsHints}>
                  <span>DRAG</span> Pan · <span>PINCH</span> Zoom
                </div>
              ) : (
                <div className={styles.controlsHints}>
                  <span>WASD</span> Move · <span>QE</span> Up/Down
                  <br />
                  <span>SCROLL</span> Zoom · <span>CMD+K</span> Jump
                </div>
              ))}
          </div>
        )}
      </div>
    </KeyboardControls>
  );
}
