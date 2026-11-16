# Workflows in one sentence: production notes

## Script / shot list (v1, approved 2026-11-16)
20 s, 16:9, silent, seamless loop. All on-screen text in English.

| # | Time | Picture | Motion | On-screen text |
|---|---|---|---|---|
| 1 | 0–3 | Lama at night in her candle shop, laptop full of tangled nodes; she sighs and closes it | Slow push-in on the screen; text types on | "Workflows looked like this?" → "…so you closed it." |
| 2 | 3–6 | Hard cuts every 0.75 s: photographing a candle, editing on the phone, making a story, rubbing her eyes; clock 9 PM → 1 AM | Lines stack and link with node lines (a tired workflow) | "Every Thursday." / "Same work." / "From scratch." |
| 3 | 6–9 | Real ALFA recording (prod, English UI), prompt typed | Typed prompt | "Build me a workflow: I give you a product photo, you make 3 ads and a story video with music." |
| 4 | 9–13 | Glowing purple node leaves Send, flies in and builds the canvas (real canvas recording) | Nodes pop, edges draw | "Nodes placed by hand: 0" |
| 5 | 13–16 | The canvas collapses into one button; click; outputs spread | Morph graph → button | "One click." |
| 6 | 16–18 | Lama on the sofa with tea, content ready on her phone | Still + parallax, text behind her | "Thursday's yours again." (handwritten) |
| 7 | 18–20 | End card: AdFlex logo, chips ALFA · Claude · ChatGPT · MCP | Words link with clean node lines; fades to the glowing node, which becomes the laptop glow of frame 1 | "Build workflows in one sentence." / "Works inside the AI you already use." / adflex.ai |

Motion rules (hero): Archivo Black type-on, white line + #8B3EF7 line; the glowing node is the continuity object between shots; hard cuts only; reveal = white-hot bloom → brand purple → true colours. No shake, flashes or rings (Bloom v4 feedback).

## Versions and feedback
- 2026-11-16: started as a 9:16 Instagram reel (Arabic, spoken), then moved to the website hero: 16:9, silent, loop, English text.
- 2026-11-16 (later): the team narrowed it: **Lama only in shot 1**, the rest is a showcase of the real workflow on screen. New plan: Lama hook (0–3 s) → real ALFA prompt → canvas builds itself → Run → real outputs → end card. Stills 2a, 2b, 2c and 6 are unused here (kept for a future social cut). Recording steps and the Run price (427 credits with Omni Flash; 1,087 with Seedance 720p) are in [recording-steps.md](recording-steps.md).
- 2026-11-16 (later): added a **tabs chaos → merge** beat (separate image / video / music tabs collapse into nodes, colour-coded blue #3292FF / pink #F83AAE / green #06b58a) and an **"ALFA × Workflow"** centre title after the merge. The girl was replaced with a new one-off character (early 20s, lighter outfit): only shot 1 uses her, so no sheet. Lama's files stay in `characters/lama.md` for other videos.
- 2026-11-16 (later): shot 1 animated from still 1 v3 with Gemini Omni Flash 1.2 (3 s, 1080p, 273 credits on dev): she sighs, then looks back at the laptop. It replaces the code push-in; the edit still adds the type-on titles and the laptop-glow bloom on top. Link in [assets.md](assets.md) under "Clips".
- 2026-11-16 (later): **new order from the team**: (1) "Workflow × ALFA" title typed on in a distinctive style, then the camera dives into the screens; (2) the girl's problem (animated shot 1) + the open-tabs chaos; (3) the prompt typed into ALFA; (4) the workflow builds and runs; (5) end card.
- 2026-11-16 (later): **real screen recordings done on dev** through the local FE (`localhost:3000`, backend `dev.adflex.ai`), brand **AdFlex.ai**, dark UI, ALFA in **Ask** mode, with the new `tools/screen-rec/` helper (Chrome + copied login, 1920x1080 at 125 %, drawn cursor, CDP screencast → 30 fps H.264, timestamp marks). Takes and outputs are listed in [assets.md](assets.md).
  - Attaching the photo directly in the chat made ALFA refuse to save the workflow; picking it from **My assets** worked. (Product issue to report.)
  - ALFA's default video step was Wan 3.0, 12 s (≈960 cr, run ≈1,155). Switched on the canvas to **Gemini Omni Flash 1.2, 5 s, 720p**: run = **510** (approved by the team, spent).
  - Auto-layout overlaps the video node and the ads node, again after the run (stale node heights). Worked around by dragging before the run; the post-run layout still overlaps. (Product issue to report.)
  - Ads came out with invented label text and multi-bottle grids (see assets.md). Video + music is clean.

- 2026-11-16 (later): **v1 rendered** (`renders/workflow-hero-v1.mp4` / `.webm` / `-poster.png`, git-ignored). Built as an HTML composition: `build/extract.sh` dumps JPEG frames from the takes, `build/comp.html` lays out the 20 s timeline with a virtual camera over the recordings, `build/render.cjs` screenshots it frame by frame (6 Chromium pages in parallel, ~42 s), and `build/encode.sh` encodes the MP4 on NVENC plus the VP9 WebM.
  - Order: "Workflow × ALFA" typed title (small AdFlex logo above) → dive through the × into the girl ("Same content. / Every week.") → tabs chaos → "Now it's one place." → ALFA prompt typed ("Just say it.") → Approve + result ("ALFA builds the workflow.") → canvas → "Run selected · 510 cr" → run timelapse ("Run it.") → real story-video output ("3 ads + a story video.") → dark end card (logo, "Build workflows in one sentence.", ALFA · Claude · MCP, "Works inside the AI you already use.", "Try it at adflex.ai"), fading back to the title background for the loop.
  - Privacy: the ALFA greeting's account name is covered with a blurred patch that reads "Good afternoon"; the 44.0–44.85 s stretch of Take A2 (the sidebar briefly opened and showed chat history) is cut; the avatar stays out of frame.
  - The bad ads only appear as small canvas thumbnails, never close up. ChatGPT chip left out until the integration is confirmed live.
  - Open: re-run the ads step with a no-text prompt (needs a quote and a yes), then show the ads in the output beat.
- 2026-11-16 (later): **v1 feedback from the team: the motion, the transitions and the scenes are weak.** Cause: recordings shown full screen with only a zoom, 11 beats crammed into 20 s, and 0.1 s crossfades. The team chose the **floating 3D UI** style and asked for references (now in [references/hero/README.md](../../../references/hero/README.md): ElevenLabs Flows Agent, Bolt × Skale, Krea Bots, Luma Agents, Runway Agent Workflows, Linear Loops).
- 2026-11-16 (later): **v2 rebuilt in Remotion** (`build/remotion/`, preview with `npx remotion studio --port 3003`). Five scenes, no crossfades; a glowing node carries every hand-off. Output: `renders/workflow-hero-v2.mp4` / `.webm` / `-poster.png`.
  1. 0–2.8 s: "Workflow × ALFA" types on with a caret, then the × collapses into the glowing node.
  2. 2.1–6.3 s: the girl opens out of the node ("Same content. / Every week. / Six tools. One post."). Six tool windows and file chips pile up around her in 3D, then everything is pulled into the node.
  3. 6.0–9.7 s: the node opens into a floating, tilted ALFA window. The real composer lifts out toward the camera while the prompt types, and Send blooms. The node leaves top-right as the camera pans to the next window.
  4. 9.4–17 s: the canvas window swings in. The node lands on the product photo (which lifts) and sweeps through the graph while it is revealed ("ALFA builds the workflow."). The camera pushes to "Run selected · 510 cr", which lifts out and is clicked; a bloom turns into the run timelapse ("Run it."). The story video lifts out of its node as a 9:16 card ("3 ads + a story video.").
  5. 16.5–20 s: end card (logo, "Build workflows in one sentence.", ALFA · Claude · MCP, "Works inside the AI you already use.", "Try it at adflex.ai"), then a fade to the shared background so the loop is seamless.
  - Privacy: the greeting's name is covered, the frame is held at Send (after Send the greeting moves), and the sidebar (avatar, chat history) is cropped off the ALFA clip.
  - The canvas take (`takeA2` 258 s) still showed the old Wan 3.0 / 1,155 cr settings, so the canvas beat uses Take C (510 cr) instead.
- 2026-11-16 (later): **v2 feedback from the team:** the logo was not the AdFlex logo, and the moves into the screens needed much stronger motion.
- 2026-11-16 (later): **v3** (`renders/workflow-hero-v3.mp4` / `.webm` / `-poster.png`).
  - Logo: the real wordmark (blue «Ad» with the sparkles, purple «Flex»), rebuilt at 1820×524 from the FE's `authLogo.webp`. Saved as `brand/adflex-logo-1820.png` and used on the title and the end card.
  - Every scene change is now one hard push forward, with a light flash and speed streaks on the cut (`scenes/Fx.tsx`; `Cam`, `Flash` and `Streaks` in `lib.tsx`).
    - Node → ALFA: the window flies in from deep space (translateZ −1700, 70° yaw, 16° roll) with a spring overshoot, plus a camera punch-in.
    - ALFA → canvas: after Send the camera dives 11× through the lifted send button with an accelerating zoom, a roll and blur. Flash. The canvas lands out of a 3.4× zoom with blur and roll.
    - Canvas: a stronger follow (1.65×) and an orbit while it builds. A camera shake and kick on the Run click, then a whip swing on the pull-back.
    - Canvas → end card: the story card flies at the camera (3.6×) while the camera dives into it. Flash. The logo lands from 1.9× with blur.
  - Timing: the result beat is 8 frames longer (the end card starts at 16.8 s), so "3 ads + a story video." can be read.
- 2026-11-16 (later): the team asked to take the **text and transition motion style from the Higgsfield Genjutsu promo** (`references/hero/README.md`). Saved it as the motion style [glitch-split-whip](../../../motion-styles/glitch-split-whip.md).
- 2026-11-16 (later): **v4** (`renders/workflow-hero-v4.mp4` / `.webm` / `-poster.png`). The v3 flashes, streaks and dives were replaced with the reference's grammar:
  - Title: "WORKFLOW × ALFA" in wide Archivo Black (wdth 125).
    - It goes outline → glitch fill with a chromatic split and jumping letters.
    - A light streak leaves the lower half in the brand gradient.
    - The × gives way to a selected chip (handles) with the girl in it. The chip grows to full frame and shoves the words off with motion blur, and scene 2 continues the same clip.
  - Every scene change is a horizontal whip push with directional motion blur: girl → ALFA → canvas → end card. Windows brake with a Y-swing.
  - The tool cards fly in blurred and spinning and land with a bounce.
  - Run: a light line sweeps down the canvas and converts the selected graph into the running timelapse.
  - Text: condensed uppercase in two weights with a left-to-right wipe ("SAME CONTENT. / **EVERY WEEK.**", "ALFA BUILDS / **THE WORKFLOW.**", "FROM ONE SENTENCE: / **3 ADS + A STORY VIDEO.**", "BUILD WORKFLOWS / **IN ONE SENTENCE.**"). Big words rise out of a mask ("JUST SAY IT.", "RUN IT.").
  - Kept: the dark brand background, the real logo, the real recordings, and the privacy masks.
- 2026-11-16 (later): **v5** (`renders/workflow-hero-v5.mp4` / `.webm` / `-poster.png`), from the team's feedback on v4.
  - End-card chips now carry the real marks from the AdFlex FE:
    - ALFA: the site favicon, `public/android-chrome-512x512.png` (the gradient sparkle; the FE's `AlfaMark` uses the same file).
    - Claude: `public/icons/ai-clients/claude.svg`.
  - **The FE has no MCP mark**, so MCP stays text-only until we get the official file.
  - No loading states on the canvas any more. The Run scanline now reveals the **finished** run directly (`runout.png`, the last frame of the run take).
  - Then the music, story-video and music-attached nodes pop toward the camera one by one, and the story video lifts out as before.
  - The ads node stays small: the ads are still not good enough for a close-up.
- 2026-11-16 (later): **v6: music + sound effects** (`renders/workflow-hero-v6.mp4` / `.webm` with Opus audio / `-poster.png`). The team approved 80 credits on dev: music 38 + 7 SFX × 6. Links are in [assets.md](assets.md).
  - The sound layer is `build/remotion/src/scenes/Sound.tsx`. Every cue sits on an absolute frame.
  - Music (120 BPM, one beat = 15 frames) is re-cut on bar lines, because the model put the drop at 8 s and stopped at 16 s:
    - 0–6 s: the intro from source 2 s, so the drop lands on the whip into ALFA at 6.0 s.
    - 6–14 s: the drop (source 8–16 s).
    - 14–20 s: the drop again from 8 s, so it restarts on the Run click, with a fade over the last second for the loop.
  - SFX:
    - Glitch on the title fill (+ a small blip).
    - Riser into the chip, and a whoosh when it shoves the words off.
    - Soft pops as the tool cards land.
    - A whoosh on each whip (girl → ALFA, ALFA → canvas, canvas → end card).
    - Clicks on Send and Run.
    - A shimmer on the scan line, three pops for the results, and an impact on the end-card logo.
  - The generated click came out silent, so a free synthesized click is used instead.
  - Mix: −15.2 LUFS integrated, true peak −0.4 dBFS (after an `alimiter` pass on the AAC).
