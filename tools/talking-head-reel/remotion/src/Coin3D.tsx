import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { enterSpring, exitScale } from "./motionTokens";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { digitSvgs } from "./digitSvgs";

const YELLOW = "#FFD600";
const BLACK = "#121212";

// Extruded number, centred, `height` world units tall, sitting at z >= 0
export const numberGeometry = (num: string, height: number, depth: number) => {
  const data = new SVGLoader().parse(digitSvgs[num]);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const g = new THREE.ExtrudeGeometry(shapes, {
    depth,
    bevelEnabled: true,
    bevelThickness: depth * 0.3,
    bevelSize: depth * 0.12,
    bevelSegments: 3,
    curveSegments: 16,
  });
  g.computeBoundingBox();
  const b = g.boundingBox!;
  const s = height / (b.max.y - b.min.y);
  g.translate(-(b.min.x + b.max.x) / 2, -(b.min.y + b.max.y) / 2, 0);
  g.scale(s, s, s);
  g.rotateX(Math.PI); // SVG y points down
  g.computeBoundingBox();
  g.translate(0, 0, -g.boundingBox!.min.z);
  return g;
};

/**
 * Section-number coin: yellow disc with a black rim and the number extruded on
 * both faces. Flips in on a spring, then idles with a gentle wobble.
 */
export const Coin3D: React.FC<{
  num: string;
  diameter: number; // world units
  x: number;
  y: number;
  durationInFrames: number;
}> = ({ num, diameter, x, y, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const r = diameter / 2;
  const thick = diameter * 0.16;

  const digits = useMemo(() => numberGeometry(num, diameter * 0.5, thick * 0.35), [num, diameter, thick]);

  const enter = enterSpring(frame, fps);
  const exit = exitScale(frame, durationInFrames, fps);
  const t = frame / fps;
  // two full flips while entering, then a slow wobble that never shows the edge-on view
  const rotY = (1 - enter) * Math.PI * 4 + 0.28 * Math.sin(t * 2.2);
  const rotX = 0.12 * Math.sin(t * 1.7 + 1.1);
  const scale = enter * exit;

  return (
    <group position={[x, y, 0]} rotation={[rotX, rotY, 0]} scale={scale}>
      {/* black rim */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r, r, thick, 64]} />
        <meshPhysicalMaterial color={BLACK} roughness={0.35} clearcoat={0.6} />
      </mesh>
      {/* yellow faces, slightly smaller and proud of the rim */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[r * 0.9, r * 0.9, thick * 1.08, 64]} />
        <meshPhysicalMaterial color={YELLOW} emissive={YELLOW} emissiveIntensity={0.3} roughness={0.25} metalness={0.05} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <mesh castShadow geometry={digits} position={[0, 0, thick * 0.54]}>
        <meshPhysicalMaterial color={BLACK} roughness={0.3} clearcoat={0.8} />
      </mesh>
      <mesh castShadow geometry={digits} position={[0, 0, -thick * 0.54]} rotation={[0, Math.PI, 0]}>
        <meshPhysicalMaterial color={BLACK} roughness={0.3} clearcoat={0.8} />
      </mesh>
    </group>
  );
};
