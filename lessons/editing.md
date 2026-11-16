# Editing lessons

## Arabic text
- This ffmpeg's libass shapes Arabic badly. Render text to PNG with Pillow + raqm, or use ASS with `shaping=complex` and separate RTL lines.
- Cairo comes from npm `@fontsource/cairo`. The Arabic subset has no ASCII digits or punctuation, so set times like 8:00 in the Latin font.
- Wrap mixed Arabic/Latin captions in RTL embedding.
- Time captions to the measured speech in each clip (speech bursts at -22 dB from peak), not to the whole shot. Split two-part lines into phrases.

## Timing
- Use `librosa.beat_track` for beat sync. Raw spectral-flux autocorrelation picked a 3/4-beat subdivision.
- Trim dead air at both ends of every talking clip, and let a last line's audio tail run into the next shot.
- A 0.22 s dissolve with an audio crossfade works well at narrated joins. Hero videos use hard cuts.

## Audio
- Target about -14 LUFS for social and -16 LUFS for voice-led reels, with a limiter at 48 kHz.
- Duck music under the voice with sidechaincompress (threshold 0.025, ratio 5, attack 25 ms, release 350 ms).
- To offset a voice track, **prepend silence** (anullsrc concat). `adelay` silently failed on a pre-rendered track.
- Pre-render voice trims into separate WAVs. One big inline filter graph deadlocked ffmpeg.
- If one word is mispronounced, splice a good take of that word in from another clip.

## Layout
- Screen demo over a talking head: a floating rounded box (720×440 layer at y=770, white border, shadow), with captions at y=762. Shrink close-ups to 0.76 on a blurred fill.
- In a mosaic or grid, every cell must be a different asset. A still and the video made from it count as the same asset.
- Protect the product with a box mask when luminance-keying.

## Performance
Render heavy composites one at a time. Two in parallel ran out of memory.

## Remotion
- Hero videos are built in Remotion now (first: `videos/hero/workflow-hero/build/remotion/`). Preview with `npx remotion studio --port 3003` (port 3000 is the local AdFlex FE), render with `npx remotion render <Comp> out.mp4 --concurrency=8 --crf=16`.
- **Clips must have square pixels.** Chrome honours a video's sample aspect ratio (SAR) and letterboxes the frame, but ffmpeg-extracted stills ignore it, so a still and its video drew ~57 px apart. Re-encode every clip with `setsar=1`. The screen recorder now writes `setsar=1` too.
- Use `OffthreadVideo` (wrapped in `<Sequence from layout="none">`) for exact frames; give recordings full 1920x1080 frames and crop in the composition, not with odd ffmpeg crop sizes.
- Lift a UI part out of a floating window by rendering the same clip a second time inside a clipped box that sits in the window's `preserve-3d` overlay, then `translateZ` it toward the camera. Never put `filter`, `opacity < 1` or `overflow: hidden` on an ancestor of the lifted part: they flatten 3D.
- Parallel `remotion still` calls can crash the bundler; run them one after another or render the whole video once at `--scale=0.5`.
- Hard transitions in Remotion (workflow-hero v3):
  - Put a 2D camera wrapper (scale, roll, shake, blur) *outside* the `perspective` layer. A transform or filter there acts on the projected image and doesn't flatten the 3D lift-outs inside.
  - Dive *through* an element: give the camera's `transformOrigin` the element's on-screen point, then use `scale = Math.pow(10, p)` with an ease-in. This accelerates the zoom far better than a linear zoom.
  - Hide the cut under a light flash (~10 frames) plus speed streaks from the same point. Land the next scene out of a 2–3× zoom with blur, so the motion keeps going forward.
  - Fade the outgoing scene to 0 right after the flash peaks, or it lingers behind the next one.
  - Use the real logo: `brand/adflex-logo-1820.png`. The FE's `landing-logo*.png` files are not the brand logo.
- Sound in Remotion (workflow-hero v6):
  - Place each cue as `<Sequence from={frame} durationInFrames layout="none"><Audio src volume /></Sequence>`.
  - Re-cut music on bar lines with the same pattern plus `trimBefore` (in frames).
  - Remotion's AAC mix can peak above 0 dBFS. Re-mux with `-c:v copy -af alimiter=limit=0.84` and check `ebur128=peak=true`. Aim for about −15 LUFS on the web.

## Talking-head reel with a 3D overlay (Nov 2026)
Full recipes are in `motion-styles/3d-icon-pops.md`, `word-synced-captions.md` and `talking-head-punch.md`, and the code is in `tools/talking-head-reel/`.
- Remotion's headless Chrome uses the Intel iGPU unless you set `__EGL_VENDOR_LIBRARY_FILENAMES=/usr/share/glvnd/egl_vendor.d/10_nvidia.json` with `--gl=angle-egl`.
  - `--gl=angle` and `--gl=egl` fail with a WebGL context error.
  - `npx remotion gpu` fails; check the renderer with a one-frame composition that prints `WEBGL_debug_renderer_info`.
- Render a 3D layer only at the size of the box it lives in, as transparent ProRes 4444, and overlay it with ffmpeg. That's faster than a full-frame 3D render, and it can't leave the box.
- Motion blur for WebGL: render at 120 fps, then `premultiply → tmix=frames=2 → select every 4th → unpremultiply`, which gives a 180° shutter at 30 fps. `<HtmlInCanvasMotionBlur>` is for HTML, not WebGL.
- Whisper word starts after a pause are early, by up to 1 s, so snap them to `silencedetect` ends. Use Whisper as the clock, never as the caption text.
- Fluent 3D emoji (github.com/microsoft/fluentui-emoji, MIT) look far better than system emoji next to 3D objects. Recolour near-black ones for dark clothes.
- Unify motion: one spring and one exit curve for every element (see "House motion rules" in `motion-styles/README.md`). Run the `12-principles-of-animation` skill on animation code before a final render.
