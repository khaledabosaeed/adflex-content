# workflow-hero (Remotion)

The AdFlex Workflows website hero: 1920×1080, 30 fps, 20 s seamless loop with music + SFX (autoplays muted on the site).

## Run it
```bash
npm i --loglevel=error
bash ../../../../../tools/fetch_media.sh media.tsv   # clips + audio git ignores (checked by sha256)
npx remotion studio --port 3003                       # preview (port 3000 is the local AdFlex FE)
bash render.sh v7                                     # ../../renders/workflow-hero-v7.{mp4,webm} + poster
```
Render single frames one at a time (`npx remotion still WorkflowHero out.png --frame=N`); parallel stills crash the bundler.

## Layout
- `src/WorkflowHero.tsx`: the timeline (Title → Problem → Prompt → Canvas → EndCard, then Grain and Sound).
- `src/lib.tsx`: shared helpers (fonts, colours, `UIWindow`, `Clip`, `MBlur`, `whipIn/whipOut`, `Wipe`, `Label`, `ScanLine`).
- `src/scenes/`: one file per scene; `Sound.tsx` places music and SFX on absolute frames.
- `public/`: fonts and the brand marks are tracked; clips, audio and images come from `media.tsv` (images by their original CDN link, never a re-uploaded copy). Frames of clips are drawn with `<Still src frame>` (lib.tsx), not saved as PNGs. `audio/click.wav` is synthesized and tracked. A few older PNGs (`runout.png`, `runsel-0.png`, `alfa-0.png`, `alfa-send.png`) are still committed from before this rule.
- `media.tsv`: path, URL and sha256 for every git-ignored file. Add a line whenever you add a clip or sound.

Motion style: `motion-styles/glitch-split-whip.md`. History and feedback: `../../production.md`.
