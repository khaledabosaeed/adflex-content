import {Composition} from 'remotion';
import {WorkflowHero} from './WorkflowHero';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="WorkflowHero" component={WorkflowHero} durationInFrames={600} fps={30} width={1920} height={1080} />
    </>
  );
};
