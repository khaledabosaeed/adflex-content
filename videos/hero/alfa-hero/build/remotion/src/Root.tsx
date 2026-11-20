import {Composition, Still} from 'remotion';
import {AlfaCover, AlfaCoverWide} from './Cover';
import {AlfaPreview} from './Preview';
import {AlfaHero} from './Hero';
import {AlfaHeroV10} from './HeroV10';
import {AlfaHeroV11, V11_SECONDS} from './HeroV11';
import {AlfaHeroV12, V12_SECONDS} from './HeroV12';
import {AlfaHeroV13, V13_SECONDS} from './HeroV13';
import {AlfaHeroV14, V14_SECONDS} from './HeroV14';
import {PromptTest} from './PromptBox';

// AlfaHeroV14: script v14, bored-Leen opening + the v13 sequence (render: SILENT=1 COMP=AlfaHeroV14 bash render.sh v11).
// AlfaHeroV13: script v13, Leen carries every transition (generated T1–T4) (render: SILENT=1 COMP=AlfaHeroV13 bash render.sh v10).
// AlfaHeroV12: script v12, English, Talent Contest transitions (render: SILENT=1 COMP=AlfaHeroV12 bash render.sh v9).
// AlfaHeroV11: script v11, "get me out of here" jams + floating prompt (render: COMP=AlfaHeroV11 bash render.sh v3).
// AlfaHeroV10: script v10, Leen in each client's world (render: COMP=AlfaHeroV10 bash render.sh v2).
// AlfaHero: script v7, all footage (render: COMP=AlfaHero bash render.sh v1).
// AlfaPreview: motion preview of script v5 with placeholders (kept for reference).
// V11 is 10.7 s (v8); the others 17 s. 1920x1080, 24 fps, silent loop.
export const RemotionRoot: React.FC = () => (
  <>
    <Still id="AlfaCover" component={AlfaCover} width={1080} height={1920} />
    <Still id="AlfaCoverWide" component={AlfaCoverWide} width={1920} height={1080} />
    <Composition id="AlfaHeroV14" component={AlfaHeroV14} durationInFrames={Math.round(V14_SECONDS * 24)} fps={24} width={1920} height={1080} />
    <Composition id="AlfaHeroV13" component={AlfaHeroV13} durationInFrames={Math.round(V13_SECONDS * 24)} fps={24} width={1920} height={1080} />
    <Composition id="AlfaHeroV12" component={AlfaHeroV12} durationInFrames={Math.round(V12_SECONDS * 24)} fps={24} width={1920} height={1080} />
    <Composition id="AlfaHeroV11" component={AlfaHeroV11} durationInFrames={Math.round(V11_SECONDS * 24)} fps={24} width={1920} height={1080} />
    <Composition id="AlfaHeroV10" component={AlfaHeroV10} durationInFrames={17 * 24} fps={24} width={1920} height={1080} />
    <Composition id="AlfaHero" component={AlfaHero} durationInFrames={17 * 24} fps={24} width={1920} height={1080} />
    <Composition id="AlfaPreview" component={AlfaPreview} durationInFrames={17 * 24} fps={24} width={1920} height={1080} />
    <Composition id="PromptTest" component={PromptTest} durationInFrames={108} fps={24} width={1920} height={1080} />
  </>
);
