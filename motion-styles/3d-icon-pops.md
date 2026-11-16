---
name: "3D icon pops in a safe box"
slug: "3d-icon-pops"
type: "graphics"
fits: [social, ad]
source: "Claude analysis/creative/report talking-head reel (Nov 2026), built outside the repo in ~/Videos/montage-reel"
used_in: [claude-talking-head-reel]
---

# 3D icon pops in a safe box

## What it looks like
While a person talks to camera, real 3D objects pop up in a fixed box on their chest, one idea at a time: glossy app-icon tiles of the platforms they name, a yellow coin that flips in with the section number, a fan of ten ad cards with a counter rolling to "10×", a bar chart whose columns grow out of a card, and Fluent 3D emoji. Each one lands on the word it illustrates, casts a soft shadow onto the footage and has light motion blur when it spins.

## Breakdown
- **Safe box:** every graphic stays inside x 104–976, y 1136–1484 of the 1080×1920 frame (the client's box: chest height, clear of the face and of Instagram's UI). The 3D layer is rendered at exactly that size (872×348) and overlaid there, so nothing can leave it.
- **Captions vs. icons:** while an icon is on screen, the caption for that moment is hidden. Icons alone are fine. Never show both in the box.
- **One idea at a time:** at most three items side by side (slots at box centre and ±220 px). They arrive right-to-left, the reading direction for Arabic.
- **Objects:**
  - *Brand tiles* (Snapchat, Meta, TikTok, Claude): a rounded extruded tile in the brand colour with the real logo extruded on its face (SVGs from the AdFlex FE `public/images/landing/media/` and `public/icons/ai-clients/`). Never redraw a logo. TikTok's cyan/red layers sit behind the white note, offset ±3.5 %.
  - *Section coin:* a yellow `#FFD600` disc with a black rim and the number in Anton, extruded on both faces. It sits at the right end of a white 2D title pill (`01 التحليل`).
  - *Ad-card fan + counter:* ten white cards (coloured image block, three grey text lines) fanned with ±4° tilt. Each card sits 0.2 world units in front of the previous one, scaled down by camera distance so the fan keeps its 2D layout. A yellow Anton counter rolls 1× → 10× and lands on the word "عشر".
  - *Growth chart:* a white card with four 3D columns rising in turn, then a green trend arrow that draws itself across the tops.
  - *Emoji:* Microsoft Fluent 3D emoji (MIT), not flat system emoji. Recolour dark ones (👥 is near black) so they read on dark clothes.
- **Timing:** every in-point is a spoken word's onset minus 60 ms (anticipation). See [word-synced-captions](word-synced-captions.md) for how the word times are measured.
- **Motion:** follows the house motion rules in [README.md](README.md#house-motion-rules): one spring for every entrance, 0.2 s ease-in exits, ≤ 50 ms stagger, ≤ 1.05 punches. Tiles enter spinning 1.6 turns; coins flip two full turns; idle objects wobble gently (±0.2 rad) and never go edge-on.
- **Light, shadow, blur:** flat (untone-mapped) colours, ambient 0.9 + two directional lights. A soft drop shadow from a light above and in front, caught by an invisible `shadowMaterial` plane (opacity 0.38) behind the objects, lands on the footage. 180° shutter motion blur.
- **Sound cues:** a synthesized pop on each arrival, ticks on each card, a ding when the counter hits 10×, a whoosh as the chart's arrow draws.

## How to make it
- **Model:** none. Everything is code; no paid generation.
- **Edit recipe:** [`tools/talking-head-reel/`](../tools/talking-head-reel/README.md).
  - 3D layer: Remotion + `@remotion/three` in `remotion/src/` (`Logo3D`, `Coin3D`, `Cards3D`, `Bars3D`, composed in `BrandIcons3D`). Rendered as transparent ProRes 4444 at **120 fps**.
  - `scripts/motion.py` blends each four 120 fps sub-frames into one 30 fps frame (180° shutter, premultiplied alpha), overlays it at (104, 1136), then burns captions and mixes the SFX.
  - Times come from `work/cues.json` (written by `scripts/align.py`), which both the 2D and 3D layers read.
- **Render on the NVIDIA GPU:** headless Chrome picks the Intel iGPU by default. Use
  `__EGL_VENDOR_LIBRARY_FILENAMES=/usr/share/glvnd/egl_vendor.d/10_nvidia.json npx remotion render BrandIcons3D out.mov --gl=angle-egl`
  (`--gl=vulkan` also lands on NVIDIA; `angle` and `egl` fail). ~2 min for 60 s at 120 fps on an RTX 3060.

## Watch out for
- Extruding an SVG: flip Y with `rotateX(Math.PI)`, not a negative scale. A negative scale reverses the triangle winding and the front faces vanish.
- Use the `flat` prop on `ThreeCanvas`, or brand colours come out washed out.
- Face details (image block, text lines) must sit in front of the slab's bevel (`depth/2 + 0.3·depth`), or they're buried.
- Write every timing in seconds (`fps`-aware), never in frames, so the 120 fps render keeps the same motion.
- Keep the `transparent` `calculateMetadata` (ProRes 4444, png frames, `yuva444p10le`), or the overlay gets a black background.
- Remotion licence: free for individuals and teams of up to 3; companies with 4+ people need a company licence.

## Examples
- Claude talking-head reel v12 (60 s, 9:16): `~/Videos/montage-reel/out/reel_v12.mp4` on Khaled's machine (not in the Drive yet).
