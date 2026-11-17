import {Composition} from 'remotion';
import {Video} from './Video';

// Rename the id per video (render.sh reads COMP). 16:9 hero: 1920x1080; reel: 1080x1920.
export const RemotionRoot: React.FC = () => (
  <Composition id="Video" component={Video} durationInFrames={300} fps={30} width={1920} height={1080} />
);
