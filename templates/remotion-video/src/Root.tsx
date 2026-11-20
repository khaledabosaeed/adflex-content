import {Composition} from 'remotion';
import {Video} from './Video';
import {AlfaTypeDemo, DEMO_S} from './AlfaTypeDemo';

// Rename the id per video (render.sh reads COMP). 16:9 hero: 1920x1080; reel: 1080x1920.
// AlfaTypeDemo previews the ALFA brand type (motion-styles/alfa-brand-type.md); delete it if the video doesn't use it.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Video" component={Video} durationInFrames={300} fps={30} width={1920} height={1080} />
    <Composition id="AlfaTypeDemo" component={AlfaTypeDemo} durationInFrames={Math.round(DEMO_S * 30)} fps={30} width={1920} height={1080} />
  </>
);
