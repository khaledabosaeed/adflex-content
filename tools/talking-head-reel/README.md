# Talking-head reel pipeline

This is the build behind the motion styles [3d-icon-pops](../../motion-styles/3d-icon-pops.md), [word-synced-captions](../../motion-styles/word-synced-captions.md) and [talking-head-punch](../../motion-styles/talking-head-punch.md). It takes 4K iPhone takes of someone talking to camera and turns them into a 9:16 reel with:
- 3D graphics in a safe box
- word-synced Arabic captions
- a virtual camera
- synthesized SFX

Copied from the Claude talking-head reel (Nov 2026, v12). The edit list, storyboard and cues are still that reel's, so treat them as a worked example and replace them.

## Layout
| Path | What |
|---|---|
| `scripts/build.py` | Edit list (`EDL`: clip, in/out, caption chunks), 1080×1920 proxies, first caption pass → `work/edl.json`, `work/captions.ass` |
| `scripts/whisper_words.py` | faster-whisper large-v3 word timestamps on CUDA → `work/words.json` |
| `scripts/align.py` | Snaps words to silences, aligns the edited caption text to them, writes `work/captions.ass` + `work/cues.json` (the word clock for every graphic) |
| `scripts/motion.py` | 4K re-cut, virtual camera, 2D graphics (Fluent emoji, pills, flies), storyboard, SFX, 3D overlay blur + composite, final NVENC encode → `out/reel_<version>.mp4` |
| `remotion/` | The 3D layer: `BrandIcons3D` (872×348, 120 fps, transparent ProRes 4444) built from `Logo3D`, `Coin3D`, `Cards3D`, `Bars3D`; `motionTokens.ts` holds the house motion rules |
| `assets/` | Brand SVGs from the AdFlex FE, Fluent 3D emoji PNGs (MIT, see `assets/fluent/LICENSE`; 👥 is recoloured blue) |

## Use it for a video
1. Copy this folder to `videos/<type>/<slug>/build/`. Install the Remotion project there with `cd remotion && npm install`.
2. Set `REEL_ROOT` to that build folder and `REEL_SRC` to the folder with the original `.MOV` takes (the default is `<build>/footage`).
3. Edit `EDL` in `scripts/build.py` (clips, trims, caption text), then run `python3 scripts/build.py`.
4. Extract the timeline audio as 16 kHz mono (`work/timeline.wav`). Then run `python3 scripts/whisper_words.py` and `python3 scripts/align.py`. Edit the cue words at the bottom of `align.py` to match the new script.
5. Edit `storyboard()` in `scripts/motion.py` and the `EVENTS`/`COINS` in `remotion/src/BrandIcons3D.tsx`. Both read `cues.json`.
6. Render the 3D layer on the NVIDIA GPU:
   ```bash
   cd remotion
   __EGL_VENDOR_LIBRARY_FILENAMES=/usr/share/glvnd/egl_vendor.d/10_nvidia.json \
     npx remotion render BrandIcons3D ../work/overlay3d.mov --gl=angle-egl --concurrency=6
   ```
7. Run `python3 scripts/motion.py v1` to get `out/reel_v1.mp4` (~3 min for 60 s).

## Needs
- An NVIDIA GPU. Everything heavy runs on it: NVDEC/NVENC, WebGL and Whisper.
- ffmpeg built with cuvid/nvenc.
- Python with `numpy`, `Pillow` (raqm) and `skia-python`.
- `faster-whisper` plus the `nvidia-cublas-cu12` and `nvidia-cudnn-cu12` wheels. `whisper_words.py` preloads them itself.
- Node.js for Remotion.
- Fonts (found via `fc-match`): IBM Plex Sans Arabic Bold, Anton, Noto Color Emoji.

See [SETUP.md](../../SETUP.md).
