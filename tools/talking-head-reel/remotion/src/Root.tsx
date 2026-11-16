import { CalculateMetadataFunction, Composition } from "remotion";
import { BrandIcons3D } from "./BrandIcons3D";

const transparent: CalculateMetadataFunction<Record<string, unknown>> = async () => ({
  defaultCodec: "prores",
  defaultVideoImageFormat: "png",
  defaultPixelFormat: "yuva444p10le",
  defaultProResProfile: "4444",
});

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BrandIcons3D"
        component={BrandIcons3D}
        // rendered at 4x the reel's 30fps; scripts/motion.py blends sub-frames into a
        // 180-degree-shutter motion blur and drops back to 30fps
        durationInFrames={1815 * 4}
        fps={120}
        width={872}
        height={348}
        calculateMetadata={transparent}
      />
    </>
  );
};
