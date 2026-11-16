---
name: "Talking-head punch edit"
slug: "talking-head-punch"
type: "edit"              # also covers camera
fits: [social, ad]
source: "Claude analysis/creative/report talking-head reel (Nov 2026)"
used_in: [claude-talking-head-reel]
---

# Talking-head punch edit

## What it looks like
A one-minute talking head that never sits still. The frame creeps forward during every take. Each new section slams in with a quick zoom-out from a punch-in and a white flash. Key words get a tiny zoom bump, and hits get a short shake. Small synthesized sound effects (pops, ticks, dings, whooshes) sit under every graphic.

## Breakdown
- **Camera (virtual, cut from 4K):**
  - The 4K clips are cut at 1350×2400, so every zoom only ever *downscales* to 1080×1920 and stays sharp.
  - Each take slowly pushes in from 1.00 to 1.04.
  - Section starts punch from +16 % back to normal in 0.45 s (ease-out cubic).
  - Emphasis words get a +7 % sine bump over 0.32 s. Hits get a 0.4 s decaying shake.
- **Cuts and timing:** dead air is trimmed from both ends of every take. Sections are numbered (01 / 02 / 03 / الخلاصة), with a title caption and a 3D number coin (see [3d-icon-pops](3d-icon-pops.md)).
- **Transitions:** at each section start, a white flash (60 % peak, exponential decay τ = 60 ms) plus a whoosh 0.22 s before the cut.
- **Grade and texture:** none. Keep the natural footage.
- **Sound cues** (synthesized with ffmpeg `aevalsrc` / `anoisesrc`, so there are no licences to worry about):

  | Cue | Recipe | Gain |
  |---|---|---|
  | pop | chirp 420 Hz up, `exp(-30t)`, 0.14 s | 0.30 |
  | tick | 2.2 kHz, `exp(-140t)`, 0.05 s | 0.22 |
  | ding | 1568 + 2349 + 3136 Hz, `exp(-6t)`, 0.8 s | 0.22 |
  | thud | 140 Hz falling, `exp(-13t)` | 0.45 |
  | whoosh | pink noise 500–7000 Hz, exp fade in/out | 0.40 |
  | rise | brown noise high-passed 200 Hz, 1.1 s | 0.35 |

- **Audio:** the voice gets a high-pass at 80 Hz and a two-pass loudnorm to −14 LUFS / −1.5 dBTP. The SFX are mixed with `amix normalize=0`, then `alimiter 0.89`.

## How to make it
- **Model:** none.
- **Edit recipe:** [`tools/talking-head-reel/`](../tools/talking-head-reel/README.md). `scripts/build.py` holds the edit list and proxies. `scripts/motion.py` holds the camera (`make_camera`), the SFX table (`SFX`, `SFX_GAIN`), the storyboard and the final mix.
- **Everything on the GPU:**
  - Decode the HEVC iPhone clips with `hevc_cuvid -crop … -resize …`, which does the crop and zoom on the GPU.
  - Encode with `h264_nvenc -preset p7 -tune hq -cq 18`.
  - The per-frame Python compositing runs in 6 parallel workers (~2–3 min for 60 s).

## Watch out for
- **NVDEC crop offsets must be multiples of 16** (sizes multiples of 32), or the chroma shifts and faces turn blue.
- iPhone clips are rotated −90°: decode with `-noautorotate` and apply `transpose=clock` yourself (`transpose_cuda` doesn't exist).
- Secure Boot blocks the NVIDIA driver on Fedora. Disable it or enrol the key.

## Examples
- Claude talking-head reel v12 (see [3d-icon-pops](3d-icon-pops.md)).
