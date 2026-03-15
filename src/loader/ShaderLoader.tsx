import * as React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import styles from "./shader-loader.module.css";

// The shader from user - expanded and adapted
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
    
    // Rotation matrix
    mat2 rotate2D(float angle) {
      float s = sin(angle);
      float c = cos(angle);
      return mat2(c, -s, s, c);
    }
    
    // HSV to RGB conversion
    vec3 hsv(float h, float s, float v) {
      vec3 p = abs(fract(h + vec3(0.0, 0.333, 0.667)) * 6.0 - 3.0);
      return v * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), s);
    }
    
    void main() {
      vec2 r = uResolution;
      float t = uTime * 0.3;
      
      // Original shader variables
      float i = 0.0;
      float e = 0.0;
      float R = 0.0;
      float s = 1.0;
      
      vec3 q = vec3(0.0);
      vec3 p = vec3(0.0);
      vec3 o = vec3(0.0);
      
      // Ray direction (FC = gl_FragCoord equivalent)
      vec3 d = vec3((vUv.xy - 0.5) * r / min(r.x, r.y), 0.7);
      
      // q.z-- from original
      q.z -= 1.0;
      
      // Original raymarching loop (99 iterations)
      for (int idx = 0; idx < 99; idx++) {
        i = float(idx);
        
        // Original HSV coloring - preserves the purple/cyan/gold colors
        o += hsv(0.6, e * 0.4 + p.y, e / 30.0);
        
        // Advance ray
        p = q += d * max(e, 0.01) * R * 0.14;
        
        // Rotate
        p.xy *= rotate2D(0.8);
        
        // Polar transform
        R = length(p);
        float logR = log2(R) - t;
        float height = -p.z / R - 0.8;
        float angle = atan(p.x * 0.08, p.y) - t * 0.2;
        
        p = vec3(logR, height, angle);
        
        // Fractal noise
        e = 0.0;
        for (s = 1.0; s < 1000.0; s += s) {
          e += abs(dot(sin(p.yzx * s), cos(p.yyz * s))) / s;
        }
      }
      
      // Normalize
      o = o / 99.0;
      
      // Void Black background from brand (#070B1D)
      vec3 voidBlack = vec3(0.027, 0.043, 0.114);
      
      // Soft vignette
      float vignette = 1.0 - length(vUv - 0.5) * 0.6;
      o *= vignette;
      
      // Blend with void black background
      float intensity = length(o);
      o = mix(voidBlack, o, smoothstep(0.0, 0.15, intensity));
      
      gl_FragColor = vec4(o, 1.0);
    }
  `,
};

function VoidScene() {
  const meshRef = React.useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uResolution.value.set(viewport.width, viewport.height);
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
