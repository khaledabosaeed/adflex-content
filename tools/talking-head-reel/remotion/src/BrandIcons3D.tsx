import { ThreeCanvas } from "@remotion/three";
import { Sequence, useVideoConfig } from "remotion";
import { Bars3D } from "./Bars3D";
import { Cards3D } from "./Cards3D";
import { Coin3D } from "./Coin3D";
import cues from "./cues.json";
import { Logo3D, LogoKind } from "./Logo3D";

// The composition is exactly the client's safe box (872x348 px, placed at x=104 y=1136
// of the 1080x1920 reel). Camera: fov 30 at z=10 -> 5.36 world units of height.
const PX = 5.36 / 348;

type Ev = { kind: LogoKind; from: number; to: number; xPx: number; sizePx: number };

// Seconds on the reel timeline, anchored to spoken words (scripts/align.py writes
// cues.json; scripts/motion.py reads the same file for the 2D layer + sfx)
const EVENTS: Ev[] = [
  { kind: "claude", from: cues.claude1, to: cues.claude1 + 1.2, xPx: 0, sizePx: 210 },
  { kind: "snapchat", from: cues.snapchat, to: cues.logos_out, xPx: 220, sizePx: 180 },
  { kind: "meta", from: cues.meta, to: cues.logos_out, xPx: 0, sizePx: 180 },
  { kind: "tiktok", from: cues.tiktok, to: cues.logos_out, xPx: -220, sizePx: 180 },
  { kind: "claude", from: cues.claude2, to: 39.1, xPx: 0, sizePx: 200 },
  { kind: "claude", from: cues.claude3, to: 57.3, xPx: 0, sizePx: 210 },
];

// Section-number coins: right end of the 2D title pill drawn by motion.py
// (xPx = offset from the box centre, positive = right). Times = section start + 0.04.
const COINS = [
  { num: "01", from: 4.34, to: 5.55, xPx: 200 },
  { num: "02", from: 19.81, to: 21.15, xPx: 260.5 },
  { num: "03", from: 39.19, to: 40.7, xPx: 187 },
];

export const BrandIcons3D: React.FC = () => {
  const { width, height, fps } = useVideoConfig();
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ fov: 30, position: [0, 0, 10] }}
      gl={{ alpha: true, antialias: true }}
      flat
      shadows="variance"
    >
      {/* soft drop shadow: key light from above-front, caught by an invisible plane
          behind everything, so only the shadow lands on the footage */}
      <directionalLight
        position={[1.2, 4, 8]}
        intensity={0.0001}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={10}
        shadow-blurSamples={16}
        shadow-bias={-0.0005}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />
      <mesh position={[0, 0, -0.9]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <shadowMaterial opacity={0.38} />
      </mesh>
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#ffffff", "#666666", 0.6]} />
      <directionalLight position={[4, 5, 8]} intensity={1.6} />
      <directionalLight position={[-6, -2, 4]} intensity={0.5} />
      <pointLight position={[0, 0, 6]} intensity={8} distance={20} />
      {EVENTS.map((e, i) => {
        const from = Math.round(e.from * fps);
        const dur = Math.round(e.to * fps) - from;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <Logo3D kind={e.kind} size={e.sizePx * PX} x={-e.xPx * PX} y={0} durationInFrames={dur} />
          </Sequence>
        );
      })}
      {COINS.map((c) => {
        const from = Math.round(c.from * fps);
        const dur = Math.round(c.to * fps) - from;
        return (
          <Sequence key={c.num} from={from} durationInFrames={dur} layout="none">
            <Coin3D num={c.num} diameter={150 * PX} x={c.xPx * PX} y={0} durationInFrames={dur} />
          </Sequence>
        );
      })}
      {/* "ten versions": cards + 10x counter (24.05-25.62) */}
      <Sequence from={Math.round(cues.cards * fps)} durationInFrames={Math.round(cues.cards_out * fps) - Math.round(cues.cards * fps)} layout="none">
        <Cards3D px={PX} durationInFrames={Math.round(cues.cards_out * fps) - Math.round(cues.cards * fps)} countDur={cues.ten - cues.cards - 0.05} />
      </Sequence>
      {/* growth chart (41.25-42.95) */}
      <Sequence from={Math.round(cues.bars * fps)} durationInFrames={Math.round(1.7 * fps)} layout="none">
        <Bars3D px={PX} durationInFrames={Math.round(1.7 * fps)} />
      </Sequence>
    </ThreeCanvas>
  );
};
