import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { enterSpring, exitScale } from "./motionTokens";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { claudeSvg, metaSvg, snapchatSvg, tiktokSvg } from "./brandSvgs";

export type LogoKind = "snapchat" | "meta" | "tiktok" | "claude";

type ShapeSet = { shapes: THREE.Shape[]; index: number }[];

const parseSvg = (svg: string, fillHoles: boolean): ShapeSet => {
  const data = new SVGLoader().parse(svg);
  const out: ShapeSet = [];
  data.paths.forEach((p, index) => {
    const fill = (p.userData as { style?: { fill?: string } } | undefined)?.style?.fill;
    if (fill === "none") return;
    const shapes = SVGLoader.createShapes(p);
    if (fillHoles) shapes.forEach((s) => (s.holes = []));
    out.push({ shapes, index });
  });
  return out;
};

// Extrude every shape, then center + normalise so the glyph is `size` wide/high
const glyphGeometry = (set: ShapeSet, depth: number, size: number) => {
  const geos = set.map(({ shapes }) =>
    new THREE.ExtrudeGeometry(shapes, {
      depth,
      bevelEnabled: true,
      bevelThickness: depth * 0.35,
      bevelSize: depth * 0.25,
      bevelSegments: 3,
      curveSegments: 24,
    }),
  );
  const box = new THREE.Box3();
  geos.forEach((g) => {
    g.computeBoundingBox();
    box.union(g.boundingBox!);
  });
  const c = box.getCenter(new THREE.Vector3());
  const dim = box.getSize(new THREE.Vector3());
  const s = size / Math.max(dim.x, dim.y);
  geos.forEach((g) => {
    g.translate(-c.x, -c.y, 0);
    g.scale(s, s, s);
    // SVG y points down: flip with a rotation (a negative scale would invert the
    // triangle winding and hide the front faces), then sit the glyph at z >= 0
    g.rotateX(Math.PI);
    g.computeBoundingBox();
    g.translate(0, 0, -g.boundingBox!.min.z);
  });
  return geos;
};

const roundedTile = (size: number, radius: number) => {
  const h = size / 2;
  const s = new THREE.Shape();
  s.moveTo(-h + radius, -h);
  s.lineTo(h - radius, -h);
  s.quadraticCurveTo(h, -h, h, -h + radius);
  s.lineTo(h, h - radius);
  s.quadraticCurveTo(h, h, h - radius, h);
  s.lineTo(-h + radius, h);
  s.quadraticCurveTo(-h, h, -h, h - radius);
  s.lineTo(-h, -h + radius);
  s.quadraticCurveTo(-h, -h, -h + radius, -h);
  return s;
};

const TILE_BG: Record<LogoKind, string> = {
  snapchat: "#FFFC00",
  meta: "#FFFFFF",
  tiktok: "#111111",
  claude: "#FAF9F5",
};

const Glyph: React.FC<{ kind: LogoKind; z: number; size: number }> = ({ kind, z, size }) => {
  const parts = useMemo(() => {
    const depth = 0.05 * size;
    if (kind === "snapchat") {
      const filled = glyphGeometry(parseSvg(snapchatSvg, true), depth, size);
      const outline = glyphGeometry(parseSvg(snapchatSvg, false), depth * 1.3, size);
      return [
        ...filled.map((g) => ({ g, color: "#FFFFFF", dz: 0, dx: 0, dy: 0 })),
        ...outline.map((g) => ({ g, color: "#000000", dz: depth * 0.4, dx: 0, dy: 0 })),
      ];
    }
    if (kind === "tiktok") {
      const g = glyphGeometry(parseSvg(tiktokSvg, false), depth, size * 0.92);
      const o = size * 0.035;
      return [
        // stacked front-to-back so the cyan/red offsets peek out around the white note
        ...g.map((x) => ({ g: x, color: "#25F4EE", dz: 0, dx: -o, dy: o })),
        ...g.map((x) => ({ g: x, color: "#FE2C55", dz: depth * 0.25, dx: o, dy: -o })),
        ...g.map((x) => ({ g: x, color: "#FFFFFF", dz: depth * 0.5, dx: 0, dy: 0 })),
      ];
    }
    if (kind === "meta") {
      const blues = ["#0064E1", "#0081FB", "#0082FB"];
      return glyphGeometry(parseSvg(metaSvg, false), depth, size).map((g, i) => ({
        g,
        color: blues[i % blues.length],
        dz: 0,
        dx: 0,
        dy: 0,
      }));
    }
    return glyphGeometry(parseSvg(claudeSvg, false), depth, size).map((g) => ({
      g,
      color: "#D97757",
      dz: 0,
      dx: 0,
      dy: 0,
    }));
  }, [kind, size]);

  return (
    <group position={[0, 0, z]}>
      {parts.map(({ g, color, dz, dx, dy }, i) => (
        <mesh castShadow key={i} geometry={g} position={[dx, dy, dz]}>
          <meshPhysicalMaterial color={color} roughness={0.32} metalness={0.05} clearcoat={0.8} clearcoatRoughness={0.25} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * One app-icon tile: rounded extruded body in the brand colour with the extruded
 * brand glyph on its face. Animation is driven only by useCurrentFrame().
 */
export const Logo3D: React.FC<{
  kind: LogoKind;
  size: number; // world units
  x: number;
  y: number;
  durationInFrames: number;
}> = ({ kind, size, x, y, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const depth = size * 0.16;

  const tile = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(roundedTile(size, size * 0.24), {
      depth,
      bevelEnabled: true,
      bevelThickness: size * 0.04,
      bevelSize: size * 0.04,
      bevelSegments: 6,
      curveSegments: 24,
    });
    g.translate(0, 0, -depth / 2);
    return g;
  }, [size, depth]);

  const enter = enterSpring(frame, fps);
  const exit = exitScale(frame, durationInFrames, fps);
  const t = frame / fps;
  const scale = enter * exit;
  const rotY = (1 - enter) * -Math.PI * 1.6 + 0.22 * Math.sin(t * 2.4);
  const rotX = 0.14 * Math.sin(t * 1.9 + 0.6);
  const lift = (1 - enter) * -0.6;

  return (
    <group position={[x, y + lift, 0]} rotation={[rotX, rotY, 0]} scale={scale}>
      <mesh castShadow geometry={tile}>
        <meshPhysicalMaterial color={TILE_BG[kind]} roughness={0.28} clearcoat={1} clearcoatRoughness={0.15} />
      </mesh>
      <Glyph kind={kind} size={size * 0.62} z={depth / 2 + size * 0.04} />
    </group>
  );
};
