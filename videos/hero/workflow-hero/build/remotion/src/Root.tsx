import {Composition} from 'remotion';
import {WorkflowHero} from './WorkflowHero';
import {SCENES} from './timeline';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="WorkflowHero" component={WorkflowHero} durationInFrames={SCENES.total} fps={30} width={1920} height={1080} />
    </>
  );
};
