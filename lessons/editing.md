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
- Edited videos are built in Remotion now (first: `videos/hero/workflow-hero/build/remotion/`). Start new ones with `bash templates/remotion-video/setup.sh videos/<type>/<slug>`.
- Git ignores clips, audio and images, so a build that lives only on one laptop can't be rebuilt. List every file it uses in `media.tsv`; images by their original CDN link (size/crop them in code, never re-upload a resize), frames of clips via `<Still src frame>` rather than saved PNGs; `tools/fetch_media.sh` restores them. Paint out names, avatars and chat history in screen recordings **before** uploading. Preview with `npx remotion studio --port 3003` (port 3000 is the local AdFlex FE), render with `npx remotion render <Comp> out.mp4 --concurrency=8 --crf=16`.
- **Clips must have square pixels.** Chrome honours a video's sample aspect ratio (SAR) and letterboxes the frame, but ffmpeg-extracted stills ignore it, so a still and its video drew ~57 px apart. Re-encode every clip with `setsar=1`. The screen recorder now writes `setsar=1` too.
- Use `OffthreadVideo` (wrapped in `<Sequence from layout="none">`) for exact frames; give recordings full 1920x1080 frames and crop in the composition, not with odd ffmpeg crop sizes.
- Lift a UI part out of a floating window by rendering the same clip a second time inside a clipped box that sits in the window's `preserve-3d` overlay, then `translateZ` it toward the camera. Never put `filter`, `opacity < 1` or `overflow: hidden` on an ancestor of the lifted part: they flatten 3D.
- When you freeze a frame of a screen recording, grab that exact frame with ffmpeg first: layouts shift mid-recording (alfa-plan.mp4 slides its chat left at 3.55 s when the Results panel opens), so a crop measured at 3.6 s was wrong at 3.58 s.
- In a shell `while read` loop, ffmpeg eats stdin and truncates the next names (`knockout` → `nockout`). Use `ffmpeg -nostdin` inside loops.
- A generated laptop clip with "locked-off camera on a tripod … screen plain bright white" (Gemini Omni Flash 1.2, image-to-video) held the screen to ±1 px for 5 s, so a real screen recording can be corner-pinned (`matrix3d`) with fixed corners, no tracking (alfa-hero G1, C1).
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
  - `render.sh` (template and builds made from it) now sets both by default; `GL=swangle` forces the CPU path. Measured on a 3 s DOM-only preview: CPU (swangle) 20 s, angle-egl on the RTX 3060 10.7 s.
  - `npx remotion gpu` fails; check the renderer with a one-frame composition that prints `WEBGL_debug_renderer_info`.
- Render a 3D layer only at the size of the box it lives in, as transparent ProRes 4444, and overlay it with ffmpeg. That's faster than a full-frame 3D render, and it can't leave the box.
- Motion blur for WebGL: render at 120 fps, then `premultiply → tmix=frames=2 → select every 4th → unpremultiply`, which gives a 180° shutter at 30 fps. `<HtmlInCanvasMotionBlur>` is for HTML, not WebGL.
- Whisper word starts after a pause are early, by up to 1 s, so snap them to `silencedetect` ends. Use Whisper as the clock, never as the caption text.
- Fluent 3D emoji (github.com/microsoft/fluentui-emoji, MIT) look far better than system emoji next to 3D objects. Recolour near-black ones for dark clothes.
- Unify motion: one spring and one exit curve for every element (see "House motion rules" in `motion-styles/README.md`). Run the `12-principles-of-animation` skill on animation code before a final render.

## House taste (workflow-hero v7 → v8 feedback)
- Don't add made-up UI (fake tool windows, file chips, icons) to "explain" a point. Show real AdFlex UI, the real footage, and text.
- Keep motion calm: flat windows with a slow push-in, whips only between scenes, and fade-in/settle entrances. Tilts, orbits, follow-cams and depth fly-ins read as "too much motion".

## Swapping media inside a real UI screenshot (workflow-hero v10)
- To show "same workflow, new product" without re-running or mocking the UI: keep the real canvas screenshot and replace only the media inside each node. Measure each node's image rect in the screenshot (threshold the bright pixels with PIL), draw the new media there with the node's corner radius, and leave the real play icons visible through a `radial-gradient` mask hole.
- Swap in the order of the wires (input → brief → story → final node), a 12-frame top-to-bottom wipe each, a few frames apart. It reads as the workflow running without any made-up UI.
- Readable UI text that describes the old product must change too. Re-type it in the node's own font and size (the AdFlex canvas uses Cairo, ~9 px at 1×) over the node's background colour.
- Photo → node "becomes the workflow" move: animate the photo rect from the full frame to the node's on-screen rect, and move the canvas camera so the node stays centred under it at the same height (`scale = R.h / T.h`). Hand off to the in-canvas overlay on the landing frame, so it needs no cut.
- If `remotion render` times out on a frame, lower the concurrency: `CONC=4 bash render.sh vN --timeout=120000`.

- **Corner-pinning onto a generated white laptop screen:** a `>225` brightness threshold finds the corners to ±1 px, but it misses the screen's anti-aliased rim, so a thin white line shows around the pinned UI. Push each corner ~8 px (at 1920) out from the quad's centre. Check by drawing the quad on a frame and by a full-res still crop (alfa-hero v2).
- **Shell loops over "name url" pairs:** the Bash tool runs zsh, where `set -- $pair` does not split words. Wrap the loop in `bash -c '…'` (and keep `ffmpeg -nostdin`). A failed run had already appended bad lines to `media.tsv`, so clean it before retrying.

- **Rendering on the GPU (Remotion, RTX 3060, measured 2026-11-18 in an isolated cgroup):** Chrome on `--gl=vulkan` with `--concurrency=4` draws with about half the CPU of `angle-egl` ×8 at the same wall time, with matching frames (mean diff < 1/255). Render JPEG frames (`--sequence`) and encode with `h264_nvenc` (5 s CPU vs ~37 s for x264 per 96 frames). The 3060 has no VP9/AV1 encoder, so WebM is CPU-only (opt in). Remotion still decodes source clips on the CPU. Measure CPU per cgroup (`systemd-run --user --scope`), not system-wide: another job on the machine skews `/proc/stat`. `--chromium-flags` wants JSON and failed both ways; not needed.
- **Typing Arabic with Latin words (2026-11-18, alfa-hero v7):** never split a Latin word (a brand name) across two spans while it's being typed, e.g. to colour the newest letters. Each span is its own LTR island inside the RTL line, and the islands swap places: «VOLT» half-typed showed as «OLTV». Keep each Latin run in one span (`unicode-bidi: isolate`); splitting Arabic runs across spans is fine (the letters still join in Chrome). See `alfa-hero/build/remotion/src/PromptBox.tsx` (`Typed`).

## Web files for a hero (alfa-hero, Nov 2026)
- `tools/web_hero.sh <silent master>` makes the site files on the GPU: H.264 NVENC with `-multipass fullres -spatial-aq 1 -temporal-aq 1` at a 3 Mbps VBR target is 6.8 MB for 18 s of heavy generated footage at SSIM 0.986 (no visible difference in crops). Constant quality (`-cq 24`) came out at 12 MB, so cap the bitrate instead.
- Make the poster from frame 0, not a later frame, so the poster-to-video swap doesn't jump. Strip the audio (`-an`) on the site files.
- **WebM can't be made on this machine's GPUs** (checked 2026-11-18): the RTX 3060 (Ampere) NVENC encodes only H.264/HEVC (no NVIDIA card encodes VP9; AV1 encode starts with RTX 40). The Intel Tiger Lake-H GT1 iGPU, even with RPM Fusion's full `intel-media-driver`, exposes H.264/HEVC (incl. low-power VDEnc) but no VP9 or AV1 encode entrypoint. WebM here means a CPU encode (libvpx-vp9 / SVT-AV1), or a machine with an RTX 40 / Intel Arc GPU (AV1 in WebM).
