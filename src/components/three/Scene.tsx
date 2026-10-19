"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { noise } from "./noise";

const COLORS = {
  low: new THREE.Color("#4c1d95"),
  mid: new THREE.Color("#22d3ee"),
  high: new THREE.Color("#f5d0fe"),
  glow: new THREE.Color("#8b5cf6"),
  star: new THREE.Color("#c7d2fe"),
};

// Shared per-frame state written by <Rig>, read by scene objects.
// `fade` dims the landscape once it would sit behind page content.
const motion = { fade: 1 };

/* ---------- Wave landscape: points + row lines over one shared height field ---------- */

const terrainVertex = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uPixelRatio;
  uniform float uHalfWidth;
  varying float vHeight;
  varying float vDepth;
  varying float vEdge;
  ${noise}

  float heightAt(vec2 p) {
    float h = snoise(vec3(p.x * 0.11, p.y * 0.11 + uTime * 0.1, uTime * 0.04)) * 1.0;
    h += snoise(vec3(p.x * 0.32, p.y * 0.32 - uTime * 0.18, 3.1)) * 0.22;
    h += sin(p.x * 0.35 + uTime * 0.5) * cos(p.y * 0.22 - uTime * 0.3) * 0.18;
    // Ripple radiating from the point under the cursor.
    float d = distance(p, uMouse);
    h += sin(d * 2.4 - uTime * 4.0) * exp(-d * 0.32) * 0.6 * uMouseStrength;
    return h;
  }

  void main() {
    vec3 p = position;
    p.y = heightAt(p.xz);
    vHeight = p.y;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vDepth = -mv.z;
    vEdge = 1.0 - smoothstep(0.55, 1.0, abs(position.x) / uHalfWidth);
    gl_PointSize = (2.2 + max(p.y, 0.0) * 2.0) * uPixelRatio * 10.0 / vDepth;
    gl_Position = projectionMatrix * mv;
  }
`;

const terrainFragment = /* glsl */ `
  uniform vec3 uLow;
  uniform vec3 uMid;
  uniform vec3 uHigh;
  uniform float uFade;
  uniform float uAlpha;
  varying float vHeight;
  varying float vDepth;
  varying float vEdge;

  void main() {
    float a = uAlpha;
    #ifndef IS_LINE
      float d = length(gl_PointCoord - 0.5);
      a *= smoothstep(0.5, 0.05, d);
    #endif
    float t = smoothstep(-0.9, 1.0, vHeight);
    vec3 col = mix(uLow, uMid, smoothstep(0.1, 0.65, t));
    col = mix(col, uHigh, smoothstep(0.7, 1.0, t));
    float fog = 1.0 - smoothstep(8.0, 38.0, vDepth);
    float near = smoothstep(1.5, 5.0, vDepth);
    a *= fog * near * vEdge * uFade * (0.35 + t * 0.9);
    gl_FragColor = vec4(col * (0.8 + t * 0.8), a);
  }
`;

function Terrain({ cols, rows }: { cols: number; rows: number }) {
  const width = 44;
  const depth = 44;
  const dpr = useThree((s) => s.viewport.dpr);
  const { camera, pointer } = useThree();

  const { geometry, lineGeometry } = useMemo(() => {
    const positions = new Float32Array(cols * rows * 3);
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = (r * cols + c) * 3;
        positions[i] = (c / (cols - 1) - 0.5) * width;
        positions[i + 1] = 0;
        positions[i + 2] = 6 - (r / (rows - 1)) * depth;
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    // Horizontal scanlines: connect neighbours along every other row.
    const index: number[] = [];
    for (let r = 0; r < rows; r += 2) {
      for (let c = 0; c < cols - 1; c++) {
        index.push(r * cols + c, r * cols + c + 1);
      }
    }
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", geometry.getAttribute("position"));
    lineGeometry.setIndex(index);
    return { geometry, lineGeometry };
  }, [cols, rows]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, -6) },
      uMouseStrength: { value: 0.4 },
      uPixelRatio: { value: dpr },
      uHalfWidth: { value: width / 2 },
      uFade: { value: 1 },
      uLow: { value: COLORS.low },
      uMid: { value: COLORS.mid },
      uHigh: { value: COLORS.high },
    }),
    [dpr],
  );
  const pointUniforms = useMemo(() => ({ ...uniforms, uAlpha: { value: 1 } }), [uniforms]);
  const lineUniforms = useMemo(() => ({ ...uniforms, uAlpha: { value: 0.28 } }), [uniforms]);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const ground = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const last = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uFade.value = motion.fade;

    // Project the cursor onto the water plane to place the ripple.
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(ground, hit)) {
      const m = uniforms.uMouse.value;
      m.x = THREE.MathUtils.damp(m.x, hit.x, 6, delta);
      m.y = THREE.MathUtils.damp(m.y, Math.max(hit.z, -30), 6, delta);
    }
    // Moving the mouse energizes the ripple; it settles when still.
    const moved = Math.hypot(pointer.x - last.current.x, pointer.y - last.current.y);
    last.current = { x: pointer.x, y: pointer.y };
    const s = uniforms.uMouseStrength;
    s.value = THREE.MathUtils.damp(s.value, moved > 0.001 ? 1.2 : 0.35, moved > 0.001 ? 8 : 1.2, delta);
  });

  return (
    <group>
      <points geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={terrainVertex}
          fragmentShader={terrainFragment}
          uniforms={pointUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={lineGeometry} frustumCulled={false}>
        <shaderMaterial
          vertexShader={terrainVertex}
          fragmentShader={terrainFragment}
          uniforms={lineUniforms}
          defines={{ IS_LINE: "" }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

/* ---------- Horizon glow ---------- */

const glowFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uCore;
  uniform float uTime;
  uniform float uFade;
  varying vec2 vUv;
  void main() {
    vec2 p = (vUv - 0.5) * vec2(1.0, 3.2);
    float d = length(p);
    float glow = exp(-d * 3.6) * (0.85 + 0.15 * sin(uTime * 0.6)) * 0.7;
    float core = exp(-abs(p.y) * 7.0) * exp(-abs(p.x) * 2.6) * 0.3;
    vec3 col = uColor * glow + uCore * core;
    gl_FragColor = vec4(col, (glow + core) * uFade);
  }
`;

function HorizonGlow() {
  const uniforms = useMemo(
    () => ({
      uColor: { value: COLORS.glow },
      uCore: { value: COLORS.high },
      uTime: { value: 0 },
      uFade: { value: 1 },
    }),
    [],
  );
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uFade.value = 0.4 + motion.fade * 0.6;
  });
  return (
    <mesh position={[0, 0.6, -34]}>
      <planeGeometry args={[70, 22]} />
      <shaderMaterial
        vertexShader="varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"
        fragmentShader={glowFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ---------- Star field above the horizon ---------- */

const starVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aOffset;
  varying float vTwinkle;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vTwinkle = 0.4 + 0.6 * (0.5 + 0.5 * sin(uTime * (0.5 + aScale) + aOffset * 6.0));
    gl_PointSize = aScale * 28.0 * uPixelRatio / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const starFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vTwinkle;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, a * a * vTwinkle);
  }
`;

function Stars({ count }: { count: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const { positions, scales, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 70;
      positions[i * 3 + 1] = 1.5 + Math.pow(Math.random(), 0.7) * 16;
      positions[i * 3 + 2] = -6 - Math.random() * 30;
      scales[i] = 0.4 + Math.random() * 1.4;
      offsets[i] = Math.random() * 10;
    }
    return { positions, scales, offsets };
  }, [count]);
  const uniforms = useMemo(
    () => ({ uTime: { value: 0 }, uPixelRatio: { value: dpr }, uColor: { value: COLORS.star } }),
    [dpr],
  );
  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={starVertex}
        fragmentShader={starFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- Camera rig: pointer parallax + scroll flight ---------- */

function Rig({ mobile }: { mobile: boolean }) {
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, delta) => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = window.scrollY / max;
    const pastHero = Math.min(1, window.scrollY / (window.innerHeight * 0.7));

    // Low over the water in the hero, then rise and glide forward as the page scrolls.
    const px = state.pointer.x * (mobile ? 0.3 : 1.1);
    const py = state.pointer.y * 0.35;
    const targetPos = new THREE.Vector3(px, (mobile ? 2.6 : 2.1) + pastHero * 1.6 + py, 8 - progress * 7);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetPos.x, 2.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetPos.y, 2.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetPos.z, 2.5, delta);

    look.set(px * 0.4, 0.2 + pastHero * 0.6, camera.position.z - 14);
    camera.lookAt(look);

    const targetFade = (mobile ? 0.8 : 1) * (1 - pastHero * 0.5);
    motion.fade = THREE.MathUtils.damp(motion.fade, targetFade, 3, delta);
  });

  return null;
}

export default function Scene() {
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setMobile(window.matchMedia("(max-width: 768px)").matches);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 animate-[fade-in_2s_ease-out]" aria-hidden>
      <Canvas
        camera={{ position: [0, 2.1, 8], fov: 55, near: 0.1, far: 80 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={reduced ? "demand" : "always"}
        eventSource={typeof document !== "undefined" ? document.body : undefined}
        eventPrefix="client"
      >
        <Rig mobile={mobile} />
        <HorizonGlow />
        <Stars count={mobile ? 300 : 700} />
        {/* Remount on breakpoint change so the grid resolution updates. */}
        <Terrain key={mobile ? "m" : "d"} cols={mobile ? 110 : 200} rows={mobile ? 90 : 150} />
      </Canvas>
    </div>
  );
}
