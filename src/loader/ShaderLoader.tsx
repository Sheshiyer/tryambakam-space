import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./shader-loader.module.css";

// Abstract void shader — adapted from twigl compact notation
const VoidShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;

    void main() {
      vec2 r = uResolution;
      float t = uTime * 0.3;
      vec4 o = vec4(0.0);

      // Centered aspect-corrected coordinates
      vec2 p = (gl_FragCoord.xy * 2.0 - r) / r.y / 0.7;
      vec2 d = vec2(-1.0, 1.0);

      // Warped coordinate system
      vec2 c = p * mat2(1.0, 1.0, d / (0.1 + 5.0 / dot(5.0 * p - d, 5.0 * p - d)));
      vec2 v = c;

      // Log-polar rotation with time
      float logLen = log(max(length(v), 1e-6));
      v *= mat2(cos(logLen + t * 0.2 + vec4(0.0, 33.0, 11.0, 0.0))) * 5.0;

      // Fractal accumulation — 9 iterations
      for (float i = 1.0; i <= 9.0; i += 1.0) {
        v += 0.7 * sin(v.yx * i + t) / i + 0.5;
        o += sin(v.xyyx) + 1.0;
      }

      // Complex exponential color mapping
      o = 1.0 - exp(
        -exp(c.x * vec4(0.6, -0.4, -1.0, 0.0))
        / o
        / (0.1 + 0.1 * pow(length(sin(v / 0.3) * 0.2 + c * vec2(1.0, 2.0)) - 1.0, 2.0))
        / (1.0 + 7.0 * exp(0.3 * c.y - dot(c, c)))
        / (0.03 + abs(length(p) - 0.7))
        * 0.2
      );

      gl_FragColor = vec4(o.rgb, 1.0);
    }
  `,
};

function VoidScene() {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const { viewport, gl } = useThree();

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      // Pass pixel resolution for gl_FragCoord-based shader
      material.uniforms.uResolution.value.set(gl.domElement.width, gl.domElement.height);
    }
  });
  
  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={VoidShaderMaterial.uniforms}
        vertexShader={VoidShaderMaterial.vertexShader}
        fragmentShader={VoidShaderMaterial.fragmentShader}
      />
    </mesh>
  );
}

interface ShaderLoaderProps {
  isLoading: boolean;
  minLoadTime?: number; // Minimum time to show in ms
}

export function ShaderLoader({ isLoading, minLoadTime = 3000 }: ShaderLoaderProps) {
  const [show, setShow] = React.useState(true);
  const [canHide, setCanHide] = React.useState(false);
  
  // Minimum time enforcement
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setCanHide(true);
    }, minLoadTime);
    
    return () => clearTimeout(timer);
  }, [minLoadTime]);
  
  // Handle hide logic
  React.useEffect(() => {
    if (!isLoading && canHide) {
      // Add a small delay for smooth transition
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, canHide]);
  
  if (!show) return null;
  
  const isFading = !isLoading && canHide;
  
  return (
    <div className={`${styles.overlay} ${isFading ? styles.fadeOut : ""}`}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 0, 1] }}
        gl={{ antialias: false, alpha: false }}
        dpr={[1, 1.5]} // Limit pixel ratio for performance
      >
        <VoidScene />
      </Canvas>
      
      {/* Subtle text hint */}
      <div className={styles.hint}>
        <span className={styles.hintText}>INITIALIZING NOESIS</span>
        <span className={styles.hintDots} />
      </div>
    </div>
  );
}

export default ShaderLoader;
