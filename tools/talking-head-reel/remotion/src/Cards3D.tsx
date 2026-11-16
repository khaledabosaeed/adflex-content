import { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { enterSpring, exitScale, PUNCH, STAGGER_S } from "./motionTokens";
import { numberGeometry } from "./Coin3D";

const CARD_COLORS = ["#FF6363", "#63B3FF", "#78DC8C", "#FFBE50", "#BE82FF"];
const YELLOW = "#FFD600";

const roundedRect = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
};

const slab = (w: number, h: number, r: number, depth: number) => {
  const g = new THREE.ExtrudeGeometry(roundedRect(w, h, r), {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.3,
    bevelSize: Math.min(w, h) * 0.02,
    bevelSegments: 3,
    curveSegments: 10,
  });
  g.translate(0, 0, -depth / 2);
  return g;
};

/** One mini ad creative: white card, coloured image block, three grey text lines. */
const AdCard: React.FC<{ k: number; px: number; frame: number; fps: number; total: number }> = ({
  k,
  px,
  frame,
  fps,
  total,
}) => {
  const w = 104 * px;
  const h = 140 * px;
  const d = 10 * px;
  const geo = useMemo(
    () => ({
      body: slab(w, h, 14 * px, d),
      image: slab(w - 20 * px, 56 * px, 8 * px, d * 0.4),
      lines: [0, 1, 2].map((j) => slab(w - 24 * px - (j === 2 ? 25 * px : 0), 9 * px, 4 * px, d * 0.3)),
    }),
    [w, h, d, px],
  );

  // same layout as the 2D version: fan right-to-left, slight arc and tilt
  const start = Math.round(k * STAGGER_S * fps);
  const f = frame - start;
  const enter = enterSpring(f, fps);
  const exit = exitScale(frame, total, fps);
  if (f < 0) return null;
  const x = (-100 - (k - 4.5) * 52) * px;
  const y = -Math.abs(k - 4.5) * 5 * px;
  const rotZ = (((k - 4.5) * -4) * Math.PI) / 180;
  const t = frame / fps;
  const rotY = (1 - enter) * Math.PI + 0.18 * Math.sin(t * 2.3 + k * 0.5);
  // each card sits fully in front of the previous one; shrink by the camera
  // distance (camera z=10) so the fan keeps its 2D layout on screen
  const zb = k * 0.2;
  const persp = (10 - zb) / 10;
  const z = zb + (1 - enter) * 2.5;

  return (
    <group position={[x * persp, (y + (1 - enter) * -1.2) * persp, z]} rotation={[0.1 * Math.sin(t * 1.8 + k), rotY, rotZ]} scale={Math.max(0.001, enter * exit * persp)}>
      <mesh castShadow geometry={geo.body}>
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.35} clearcoat={0.7} />
      </mesh>
      <mesh castShadow geometry={geo.image} position={[0, h / 2 - 10 * px - 28 * px, d * 1.15]}>
        <meshPhysicalMaterial color={CARD_COLORS[k % 5]} emissive={CARD_COLORS[k % 5]} emissiveIntensity={0.15} roughness={0.3} clearcoat={0.8} />
      </mesh>
      {geo.lines.map((g, j) => (
        <mesh
          key={j}
          geometry={g}
          position={[j === 2 ? -12.5 * px : 0, h / 2 - (80 + j * 18 + 4.5) * px, d * 1.1]}
        >
          <meshStandardMaterial color="#C8C8C8" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
};

/** Big 3D counter 1× -> 10×, with a little punch each time the number changes. */
const Counter3D: React.FC<{ px: number; frame: number; fps: number; total: number; startOffset: number; countDur: number }> = ({
  px,
  frame,
  fps,
  total,
  startOffset,
  countDur,
}) => {
  const height = 112 * px;
  const geos = useMemo(
    () => Array.from({ length: 10 }, (_, i) => numberGeometry(`${i + 1}×`, height, height * 0.22)),
    [height],
  );
  const f = frame - Math.round(startOffset * fps);
  if (f < 0) return null;
  const p = Math.min(1, Math.max(0, f / (countDur * fps)));
  const k = Math.round(p * 9);
  const changeAt = Math.round((((k - 0.5) / 9) * countDur * fps));
  const since = k === 0 ? f : f - changeAt;
  const punch = 1 + PUNCH * Math.exp(-since / (0.083 * fps));
  const enter = enterSpring(f, fps);
  const exit = exitScale(frame, total, fps);
  const t = frame / fps;
  const settle = interpolate(f, [countDur * fps, (countDur + 0.27) * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.back(3)),
  });
  return (
    <group
      position={[290 * px, 0, 0.6]}
      rotation={[0.12 * Math.sin(t * 2), -0.35 + 0.25 * Math.sin(t * 2.6) + (1 - enter) * -1.2, 0]}
      scale={Math.max(0.001, enter * exit * punch * (1 + 0.06 * settle))}
    >
      <mesh castShadow geometry={geos[k]}>
        <meshPhysicalMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={0.3} roughness={0.25} clearcoat={1} />
      </mesh>
      {/* dark shadow copy behind for a chunky look */}
      <mesh castShadow geometry={geos[k]} position={[4 * px, -4 * px, -height * 0.12]}>
        <meshStandardMaterial color="#121212" roughness={0.5} />
      </mesh>
    </group>
  );
};

/** "Ten versions" moment: 10 ad cards fan in, counter rolls to 10×. */
export const Cards3D: React.FC<{ px: number; durationInFrames: number; countDur: number }> = ({
  px,
  durationInFrames,
  countDur,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <group>
      {Array.from({ length: 10 }, (_, k) => (
        <AdCard key={k} k={k} px={px} frame={frame} fps={fps} total={durationInFrames} />
      ))}
      <Counter3D px={px} frame={frame} fps={fps} total={durationInFrames} startOffset={0.05} countDur={countDur} />
    </group>
  );
};
