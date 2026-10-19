"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { noise } from "./noise";

const COLORS = {
  cyan: new THREE.Color("#22d3ee"),
  violet: new THREE.Color("#8b5cf6"),
  pink: new THREE.Color("#ec4899"),
};

// Shared per-frame state written by <Rig>, read by scene objects.
// `fade` dims the centerpiece once it would sit behind page content.
const motion = { fade: 1 };

/* ---------- Morphing energy orb ---------- */

const orbVertex = /* glsl */ `
  uniform float uTime;
  uniform float uDistort;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  ${noise}
  void main() {
    float n = snoise(position * 0.9 + uTime * 0.22);
    n += 0.35 * snoise(position * 2.4 - uTime * 0.18);
    vNoise = n;
    vec3 p = position + normal * n * uDistort;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vView = normalize(-mv.xyz);
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * mv;
  }
`;

const orbFragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  uniform float uTime;
  uniform float uFade;
  varying vec3 vNormal;
  varying vec3 vView;
  varying float vNoise;
  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
    float band = 0.5 + 0.5 * sin(vNoise * 6.0 + uTime * 0.8);
    vec3 col = mix(uA, uB, smoothstep(-0.5, 0.7, vNoise + band * 0.3));
    col = mix(col, uC, fresnel * fresnel * 0.6);
    float alpha = (0.07 + fresnel * 0.75) * uFade;
    gl_FragColor = vec4(col * (0.5 + fresnel * 1.5), alpha);
  }
`;

function Orb({ detail }: { detail: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  const wire = useRef<THREE.LineSegments>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFade: { value: 1 },
      uDistort: { value: 0.28 },
      uA: { value: COLORS.violet },
      uB: { value: COLORS.cyan },
      uC: { value: COLORS.pink },
    }),
    [],
  );
  const wireGeo = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.25, 2)),
    [],
  );

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uFade.value = motion.fade;
    if (wire.current) {
      (wire.current.material as THREE.LineBasicMaterial).opacity = 0.12 * motion.fade;
    }
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.08;
      mesh.current.rotation.x += delta * 0.03;
    }
    if (wire.current) {
      wire.current.rotation.y -= delta * 0.05;
      wire.current.rotation.z += delta * 0.02;
    }
  });

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.6, detail]} />
        <shaderMaterial
          vertexShader={orbVertex}
          fragmentShader={orbFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <lineSegments ref={wire} geometry={wireGeo}>
        <lineBasicMaterial
          color={COLORS.cyan}
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

/* ---------- Orbit rings ---------- */

type Ring = {
  r: number;
  tilt: [number, number, number];
  color: THREE.Color;
  speed: number;
  opacity: number;
};

const RINGS: Ring[] = [
  { r: 2.7, tilt: [1.2, 0.2, 0], color: COLORS.cyan, speed: 0.15, opacity: 0.5 },
  { r: 3.2, tilt: [1.0, -0.5, 0.4], color: COLORS.violet, speed: -0.1, opacity: 0.35 },
  { r: 3.8, tilt: [1.4, 0.6, -0.3], color: COLORS.pink, speed: 0.07, opacity: 0.2 },
];

function Rings() {
  const rings = RINGS;
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    refs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.z += delta * rings[i].speed;
      (m.material as THREE.MeshBasicMaterial).opacity = rings[i].opacity * motion.fade;
    });
  });

  return (
    <group>
      {rings.map((ring, i) => (
        <mesh
          key={ring.r}
          ref={(m) => {
            refs.current[i] = m;
          }}
          rotation={ring.tilt}
        >
          <torusGeometry args={[ring.r, 0.006, 8, 220]} />
          <meshBasicMaterial
            color={ring.color}
            transparent
            opacity={ring.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Twinkling particle field ---------- */

const pointsVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aScale;
  attribute float aOffset;
  varying float vTwinkle;
  varying float vMix;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.2 + aOffset) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vTwinkle = 0.55 + 0.45 * sin(uTime * (0.6 + aScale) + aOffset * 6.0);
    vMix = fract(aOffset);
    gl_PointSize = aScale * 34.0 * uPixelRatio / -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;

const pointsFragment = /* glsl */ `
  uniform vec3 uA;
  uniform vec3 uB;
  varying float vTwinkle;
  varying float vMix;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    vec3 col = mix(uA, uB, vMix);
    gl_FragColor = vec4(col + 0.35, a * vTwinkle);
  }
`;

function Particles({ count }: { count: number }) {
  const dpr = useThree((s) => s.viewport.dpr);
  const { positions, scales, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.7;
      positions[i * 3 + 2] = r * Math.cos(phi) - 4;
      scales[i] = 0.4 + Math.random() * 1.6;
      offsets[i] = Math.random() * 10;
    }
    return { positions, scales, offsets };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: dpr },
      uA: { value: COLORS.cyan },
      uB: { value: COLORS.violet },
    }),
    [dpr],
  );
  const points = useRef<THREE.Points>(null);

  useFrame((state, delta) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    if (points.current) points.current.rotation.y += delta * 0.012;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
        <bufferAttribute attach="attributes-aOffset" args={[offsets, 1]} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={pointsVertex}
        fragmentShader={pointsFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- Rig: mouse parallax + scroll choreography ---------- */

function Rig({ mobile, children }: { mobile: boolean; children: React.ReactNode }) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = window.scrollY / max;
    // 0 at the top of the hero, 1 once it has scrolled mostly out of view.
    const pastHero = Math.min(1, window.scrollY / (window.innerHeight * 0.7));
    const ease = 1 - Math.pow(0.001, delta);

    // Orb sits right of the hero text on desktop, above it on mobile, then
    // drifts to the far edge and dims so it never fights with content.
    const targetX = mobile ? THREE.MathUtils.lerp(0, 1.6, pastHero) : THREE.MathUtils.lerp(2.4, 4.8, pastHero);
    const targetY = mobile ? 1.9 - progress * 2.5 : 0.1 - progress * 1.2;
    const targetScale = (mobile ? 0.62 : 1) * (1 - pastHero * 0.15);
    const targetFade = (mobile ? 0.45 : 1) * (1 - pastHero * 0.8);

    motion.fade = THREE.MathUtils.lerp(motion.fade, targetFade, ease * 0.5);
    g.position.x = THREE.MathUtils.lerp(g.position.x, targetX, ease * 0.6);
    g.position.y = THREE.MathUtils.lerp(g.position.y, targetY, ease * 0.6);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, targetScale, ease * 0.6));
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.5 + progress * Math.PI, ease * 0.4);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.35, ease * 0.4);

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, state.pointer.x * 0.6, ease * 0.3);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, state.pointer.y * 0.4, ease * 0.3);
    camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
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
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={reduced ? "demand" : "always"}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <Rig mobile={mobile}>
        <Orb detail={mobile ? 20 : 40} />
        <Rings />
      </Rig>
      <Particles count={mobile ? 700 : 1800} />
    </Canvas>
    </div>
  );
}
