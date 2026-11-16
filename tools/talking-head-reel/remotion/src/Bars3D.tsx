import { useMemo } from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { enterSpring, exitScale } from "./motionTokens";

const HEIGHTS = [0.35, 0.55, 0.45, 0.85];
const COLORS = ["#63B3FF", "#78DC8C", "#FFBE50", "#22C55E"];

const roundedRect = (w: number, h: number, r: number) => {
  const s = new THREE.Shape();
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
  return s;
};

/**
 * Growth chart: white card with four 3D columns rising out of it, then a green
 * trend arrow drawing itself across the tops. Same timings as the old 2D chart.
 */
export const Bars3D: React.FC<{ px: number; durationInFrames: number }> = ({ px, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const cw = 330 * px;
  const ch = 280 * px;
  const cd = 18 * px;
  const bw = 52 * px;
  const bd = 40 * px;
  const base = -ch / 2 + 30 * px;

  const card = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedRect(cw, ch, 28 * px), {
      depth: cd,
      bevelEnabled: true,
      bevelThickness: cd * 0.3,
      bevelSize: 6 * px,
      bevelSegments: 4,
      curveSegments: 12,
    });
    g.translate(0, 0, -cd);
    return g;
  }, [cw, ch, cd, px]);

  const barX = (k: number) => -cw / 2 + (30 + 26 + k * 72) * px;
  const top = (k: number) => base + HEIGHTS[k] * 200 * px;

  // trend arrow through the column tops (raised a little above them)
  const arrowPts = useMemo(
    () => [0, 1, 2, 3].map((k) => new THREE.Vector3(barX(k), top(k) + 34 * px, bd + 6 * px)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [px],
  );

  const t = frame / fps;
  const enter = enterSpring(frame, fps);
  const exit = exitScale(frame, durationInFrames, fps);
  const arrowP = interpolate(t, [0.9, 1.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // partial polyline for the drawing-on arrow
  const segs = arrowPts.length - 1;
  const pos = arrowP * segs;
  const pts = arrowPts.slice(0, Math.floor(pos) + 1);
  if (pos < segs && arrowP > 0) {
    const i = Math.floor(pos);
    pts.push(arrowPts[i].clone().lerp(arrowPts[i + 1], pos - i));
  }
  const tip = pts[pts.length - 1];
  const prev = pts.length > 1 ? pts[pts.length - 2] : tip;
  const dir = tip.clone().sub(prev).normalize();
  const tube = useMemo(
    () => (pts.length > 1 ? new THREE.TubeGeometry(polyline(pts), 64, 7 * px, 12, false) : null),
    // pts is derived from frame; rebuild once per frame
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [frame, px],
  );

  return (
    <group
      rotation={[-0.12 + 0.05 * Math.sin(t * 1.6), -0.38 + (1 - enter) * 1.4 + 0.12 * Math.sin(t * 1.9), 0]}
      scale={Math.max(0.001, enter * exit)}
    >
      <mesh castShadow geometry={card}>
        <meshPhysicalMaterial color="#FFFFFF" roughness={0.3} clearcoat={0.8} />
      </mesh>
      {HEIGHTS.map((hh, k) => {
        const g = Easing.out(Easing.cubic)(Math.min(1, Math.max(0, (t - 0.25 - k * 0.15) / 0.5)));
        const h = Math.max(0.001, hh * 200 * px * g);
        return (
          <mesh castShadow key={k} position={[barX(k), base + h / 2, bd / 2]}>
            <boxGeometry args={[bw, h, bd]} />
            <meshPhysicalMaterial color={COLORS[k]} emissive={COLORS[k]} emissiveIntensity={0.18} roughness={0.3} clearcoat={0.9} />
          </mesh>
        );
      })}
      {tube && (
        <mesh castShadow geometry={tube}>
          <meshPhysicalMaterial color="#16A34A" emissive="#16A34A" emissiveIntensity={0.25} roughness={0.3} clearcoat={1} />
        </mesh>
      )}
      {arrowP > 0.02 && (
        <mesh castShadow position={tip} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)}>
          <coneGeometry args={[18 * px, 34 * px, 24]} />
          <meshPhysicalMaterial color="#16A34A" emissive="#16A34A" emissiveIntensity={0.25} roughness={0.3} clearcoat={1} />
        </mesh>
      )}
    </group>
  );
};

const polyline = (pts: THREE.Vector3[]) => {
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 0; i < pts.length - 1; i++) path.add(new THREE.LineCurve3(pts[i], pts[i + 1]));
  return path;
};
