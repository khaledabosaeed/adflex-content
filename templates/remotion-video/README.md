# Remotion video template

The default for any edited video (hero, ad, social) that needs motion graphics, UI lift-outs or exact timing.
It carries the house helpers from workflow-hero (`src/lib.tsx`), a sound pattern (`src/Sound.tsx`) and the render pipeline.

## Start
```bash
cp -r templates/new-video videos/<type>/<slug>        # brief, production, assets first
bash templates/remotion-video/setup.sh videos/<type>/<slug>
cd videos/<type>/<slug>/build/remotion
npx remotion studio --port 3003                        # port 3000 is the local AdFlex FE
```
`setup.sh` copies this folder to `build/remotion/`, puts the brand logo, fonts (`brand/fonts`), marks (`brand/marks`) and `brand/sfx/click.wav` in `public/`, and runs `npm i`.

## Media
Git ignores `*.mp4`, `*.mp3`, `*.wav`. For every clip or sound in `public/`:
1. Upload it (AdFlex upload library on the video's account) or use its generation URL.
2. Add `path<TAB>url<TAB>sha256` to `media.tsv` (`sha256sum public/<file>`).

Anyone can then rebuild with `bash tools/fetch_media.sh media.tsv`; `render.sh` runs it first.

## Render
`bash render.sh v1` writes `../../renders/<slug>-v1.mp4` (audio peak-limited), `.webm` and `-poster.png`, then prints the loudness (aim for about −15 LUFS, true peak under −0.5 dBFS).
Set `COMP=<id>` if you renamed the composition. Run `remotion still` frames one at a time.

## Files
- `src/lib.tsx`: fonts, brand colours `C`, easings (`ip`, `springAt`), `Background`, `Grain`, `UIWindow` (3D window with lift-outs), `Crop`, `Clip`, `MBlur`, `whipIn`/`whipOut`, `Wipe`, `Label`, `Kicker`, `ScanLine`.
- `src/Video.tsx`: a two-scene starter timeline; replace it with the shot list.
- `src/Sound.tsx`: music re-cut on bar lines plus SFX cues on absolute frames.

Read `lessons/editing.md` (Remotion section) and the chosen `motion-styles/*.md` before building, and audit animation code with the `12-principles-of-animation` skill.
