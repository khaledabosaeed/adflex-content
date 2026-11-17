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
- 2026-11-16 (later): **Repo cleanup, no new render.**
  - Removed the v1 HTML pipeline (`build/comp.html`, `render.cjs`, `extract.sh`, `encode.sh`, `motion-preview.src.html`, `build/assets/`; still in git history) and the unused `public/` files. Deleted the v1 frame dumps (`renders/frames`, `renders/out`).
  - The build's clips and audio are listed in `build/remotion/media.tsv` and fetched with `tools/fetch_media.sh`. `build/remotion/render.sh <version>` does render + limiter + WebM + poster + loudness check.
  - The ALFA clips in the build were made privacy-safe: the sidebar (chat history, avatar) and the name in the greeting are painted out. The composition looks the same.
- 2026-11-17: **v7** (`renders/workflow-hero-v7.mp4` / `.webm` / `-poster.png`, 25.6 s). Team feedback on v6: "some shots feel incomplete; the result doesn't land, and it isn't clear that ALFA produces it."
  - New **ALFA reply** beat (4 · 3.2 s) from the real Take A2: Approve → ALFA's card "Product Photo to 3 Ads and a Music Story · Draft saved" appears and lifts toward the camera → click **Open workflow** → whip into the canvas. Text: "ALFA PLANS / THE WHOLE WORKFLOW." Canvas text is now "EVERY STEP, / ALREADY WIRED."
  - New **Results** beat (6 · 3.5 s): the outputs leave the canvas as big 3D cards. The story video (with music) and ad 1 (ALUNE) are big; ads 2–3 stay small and pushed back (team choice: "Ad 1 big, rest small"); a music chip. Text: "MADE BY ALFA: / 3 ADS + A STORY VIDEO." The old story-video lift-out on the canvas is gone.
  - 20 s → 25.6 s. Music: a fourth bar-aligned segment fades out at the loop. New SFX cues for Approve, the card, Open workflow and the result cards.
  - Mix: −15.1 LUFS, peak −1.0 dBFS. No credits spent.
- 2026-11-17 (later): **v8** (`renders/workflow-hero-v8.mp4` / `.webm` / `-poster.png`, 25.6 s). Team feedback on v7: "you've put in a lot of motion and icons of your own."
  - Removed the invented tool windows (Image tool, Video editor, Upscaler, Music, Voice, Story maker) and file chips from the problem scene, and their pop SFX. The scene is now the girl, the text and a slow push-in.
  - Much calmer motion: UI windows sit flat (no tilt, swing or orbit), the canvas no longer follows the node with the camera, lift-outs are smaller and flat, and the result cards fade in place instead of flying in from depth. Whips stay only between scenes.
  - Kept on purpose (the team chose not to remove them): the × and selection handles in the title, the glowing node on the canvas, the music chip and the tags on the result cards.
  - Limiter lowered to 0.8: −15.1 LUFS, peak −1.4 dBFS.
- 2026-11-17 (later): **v9 script approved: INPUT → OUTPUT, modelled on the Genjutsu promo's structure.** Team feedback on v8: "make it more real; the shots and motion you added aren't the best and the idea isn't 100 % clear; can we do something like the reference?" The reference works because it is almost all real output footage, every beat is one idea in 2–3 words, its strongest beat is a one-click swap, and it ends on the product. The girl scene is dropped.

  | # | Time | Picture | Text |
  |---|---|---|---|
  | 1 | 0–2 | Current WORKFLOW × ALFA glitch title | — |
  | 2 | 2–5 | INPUT: the product photo card next to the real ALFA composer, the sentence typing | ONE PHOTO. / ONE SENTENCE. |
  | 3 | 5–9 | Diagonal split, INPUT left (the photo), OUTPUT right, matched cuts every 0.5 s through the real outputs (ad, story video, ad…) | 3 ADS + A STORY VIDEO |
  | 4 | 9–13 | Three quick whip cards, real UI only: ALFA's workflow card → the canvas → the Run button | ALFA BUILDS IT · ONE WORKFLOW · RUN IT EVERY WEEK |
  | 5 | 13–17 | The swap: same workflow on the real canvas, the product photo changes to a new product (an unbranded candle in a glass jar), Run, new outputs | NEW PRODUCT. SAME WORKFLOW. |
  | 6 | 17–20 | End card | — |

  Needs: a new product photo (quoted 30 cr, nano-banana-2-lite, 4:5) and one more run of workflow `6afb2498539c3a84eb106c27` on the dev canvas (510 cr last time), recorded with `tools/screen-rec` through the local FE. The workflow was built in the FE, so MCP can't run it.
- 2026-11-17 (later): the team chose **not to run anything new** ("do your idea with what we already have"), so the swap beat (shot 5) became the payoff on the real story video. No credits spent.
- 2026-11-17 (later): **v9** (`renders/workflow-hero-v9.mp4` / `.webm` / `-poster.png`, 20.5 s), built with existing material only:
  1. 0–2.1 s: WORKFLOW × ALFA title; the chip now opens on the real input photo (serum) instead of the girl.
  2. 2.1–3.6 s: ONE PHOTO.: the input photo full frame (contained over a blurred copy, so the bottle isn't cropped), tag INPUT.
  3. 3.6–6.7 s: ONE SENTENCE.: the real ALFA composer, the prompt typing, Send.
  4. 6.7–10.3 s: INPUT | OUTPUT diagonal split: the photo left; right, hard cuts every 0.5 s through ad 1, the story video, ad 2 (its left, one-bottle panel) and ad 1 close. "MADE BY ALFA / 3 ADS + A STORY VIDEO." Ad 3 (the 4-bottle grid) is left out.
  5. 10.3–14.1 s: three real-UI cards with whips: ALFA BUILDS IT. (ALFA's workflow card), ONE WORKFLOW. (the canvas after the run), RUN IT EVERY WEEK. (slow push to Run selected · 510 cr and the click). The clip stops on a clean frame right after the click, because the "Review and run" dialog shows the account balance.
  6. 14.1–17.3 s: the story video big over a blurred copy of itself: "FROM ONE SENTENCE / TO A STORY VIDEO."
  7. 17.3–20.5 s: end card.
  - The girl, the reply/canvas/results scenes of v7–v8 are out of the timeline (`Reply.tsx`, `Canvas.tsx`, `Results.tsx` stay in `src/scenes/` unused; `Problem.tsx` deleted). Scene starts live in `src/timeline.ts`.
  - Music drop moved to the whip into INPUT | OUTPUT (6.5 s). Limiter at 0.7 because 0.8 still hit −0.0 dBFS true peak after AAC: −15.7 LUFS, peak −2.5 dBFS.
- 2026-11-17 (later): team feedback on v9: "I want the shot where this photo turns into the workflow, and inside the workflow the shots change and it becomes a different product; edit it or generate." The team chose **one new product, 513 credits** (photo 30 + 3 ads 168 + story video 315). The workflow can't be re-run over MCP (built in the FE), so the new product's outputs were generated directly and swapped into the real canvas screenshot in the edit.
- 2026-11-17 (later): **v10** (`renders/workflow-hero-v10.mp4` / `.webm` / `-poster.png`, 22.8 s). Shots 1–4 as v9, then:
  5. 10.3–11.6 s: ALFA BUILDS IT. (the ALFA workflow card only; the ONE WORKFLOW / RUN IT EVERY WEEK cards are out).
  6. 11.6–16.4 s, new `Flow` scene: the serum photo full frame, then the camera pulls back and the photo lands in the real canvas's "Your product photo" node, with the real workflow around it: ONE WORKFLOW. Then a new product (unbranded candle) wipes into the photo node and, following the wires, every output node wipes to the candle's outputs: the brief text, the story video, the music + video node, and the 4 thumbnails of the final node. NEW PRODUCT. / SAME WORKFLOW. The canvas is the real `runout.png`; only the media inside the nodes is replaced at the measured rects, and the play icons stay visible through a hole in each overlay. The brief node's text is re-written for the candle in the node's own font (Cairo 9 px). The mouse cursor is painted out.
  7. 16.4–19.6 s: both story videos side by side (serum and candle): "FROM ONE SENTENCE / A STORY VIDEO / FOR EACH PRODUCT."
  8. 19.6–22.8 s: end card.
  - Mix: −15.4 LUFS, peak −2.4 dBFS. Concurrency 8 timed out on a frame; rendered with `CONC=4 bash render.sh v10 --timeout=120000`.
  - Team rule after v10: no images in git and no re-uploaded copies. The build's stills now come from their original CDN links in `media.tsv`, and the frames (ALFA card, story thumbnail, the Prompt holds) are `<Still>`s of the uploaded clips. This also fixed a Prompt bug: `alfa-send.png` was drawn from frame 0 (an `<Img>` has no `from`), so the full sentence showed before the typing started.

- 2026-11-17 (later): **v11** (`renders/workflow-hero-v11.mp4`, 27.1 s): the v11 script (Lama alone, ALFA as the hero: problem → TELL ALFA → ALFA PLANS IT → ALFA BUILDS THE WORKFLOW → 3 ads + story → ALFA EDITS IT → winter ads → Lama photographs her candle → ALFA RUNS IT AGAIN → end card), hard cuts with a short blur settle and small corner labels. The edit beat uses the real recording `alfa-edit.mp4`, band-cropped to the sent bubble and ALFA's status; ALFA did not finish the edit on dev, the winter ads were made directly with seedream (see assets.md).
- 2026-11-17 (later): team feedback on v11: "the video stutters, I don't like the transitions and the motion, change the transition style; make the girl shot more exciting and faster; make the whole video a bit faster." Chosen direction: **fast and punchy**.
- 2026-11-17 (later): **v12** (`renders/workflow-hero-v12.mp4`, 21.3 s):
  - Stutter fix: girl.mp4 and lama-candle.mp4 are 24 fps sources converted to 30 fps (every 5th frame doubled). Played at **1.25x**, each output frame shows one real source frame, so they run smooth and faster.
  - Every cut sits on the music's beat grid (15 frames). Scenes join with **whip-pan cuts** (lib `Pan`: 3 smeared, over-exposed frames in, 2 out, same direction, short whoosh). UI beats get **punch-ins** (instant 1.9x onto Send and onto Approve and run; `punch()`). Each scene's line now **slams in big in the centre** for ~0.4 s (lib `Slam`) instead of the small corner labels.
  - The girl shot: three beats, EVERY WEEK. → punch on her face, SAME WORK. → tighter punch, whip out. Lama's candle shot: shutter flash + punch on the tap, cut on the beat to the phone coming at the lens.
  - The music drop now lands on ALFA BUILDS THE WORKFLOW. (8.0 s); the intro plays from source 0.

- 2026-11-17 (later): team feedback on v12: "I want the photo she takes to move and land in the prompt too; some shots are in an order that isn't logical." Chosen: **two Lama shots** (a new one photographing the serum at the start, 333 credits) and **drop the winter edit** (it broke the story, and ALFA had not really done it).
- 2026-11-17 (later): **v13** (21.3 s): title → problem → Lama photographs her serum (shutter flash + punch on the tap) → flash to white, the photo flies out full frame and lands on the real attachment thumbnail in ALFA's composer → the sentence types, punch on Send → ALFA plans it (the music drop lands on the Approve click) → builds the workflow → 3 ads + a story video → next week: Lama photographs a new candle → its photo flies into the composer the same way, "Same workflow, new product." → ALFA runs it again (the photo shrinks into the node, outputs swap) → end card. `Edit.tsx` and `Winter.tsx` are out of the timeline (files kept).

- 2026-11-17 (later): team feedback on v13: "the steps inside ALFA aren't the best: improve them with motion and strong transitions" (chosen: 3D motion on the real UI, no credits); then "after the generation, make the transition special and focus on the final result; and after the photo, make it feel easy and move from the scene to the product."
- 2026-11-17 (later): **v14** (21.8 s), all edit-only:
  - Scene → product: each Lama shot ends with a match-cut zoom onto the product in the room, landing exactly where and as big as the product is in its photo (serum ×2.2, candle ×1.6 with the photo opening shifted right), then the photo flies into the composer. The white flashes are gone.
  - The prompt: once the photo lands, the composer turns into a tilted 3D panel and the camera follows the typing (ui-macro-dolly), then punches onto Send.
  - ALFA plans it (new `Plan.tsx`): ALFA's real status "Understanding the request…" fills the frame and slides (status-line-zoom), snaps back to the tilted chat; the real "Run this plan?" card lifts off the page, punch onto Approve, the button sinks and springs back lit with a lavender ring (button-press); the reply page slides down the three outputs and flattens onto the real workflow card, "Open workflow" lights, and the card opens into the canvas (card-to-fullbleed).
  - After the run: the camera dives at the workflow's last node (the deliverables), it lights up, and its story-video thumbnail grows into a big player (button-to-player-morph). New `Result.tsx`: the story plays front and centre with the real ads swinging in as 3D cards (ad1, ad2's left half; ad3 has invented label text, so it stays out), "3 ADS + A STORY VIDEO." under them. `Split.tsx` is out of the timeline.

- 2026-11-17 (later): team feedback on v14: "remove the dots above ALFA, Claude and MCP; at the end mention only ALFA." **v15**: the end card keeps the AdFlex logo, BUILD WORKFLOWS IN ONE SENTENCE., one ALFA chip, "Works inside the AI you already use." and the CTA; the three dots and the Claude / MCP chips are gone (a team call for this hero, against the usual equal-weight chips rule).

- 2026-11-17 (later): team feedback on v15: "make ALFA clearer in the closing shot; it's a hero, two words on it are enough." **v16**: the end card is only the AdFlex logo (top) and ALFA: its real mark springs in big with a glow and one ring, and "ALFA" sharpens in under it in the brand gradient. The tagline, the "works inside the AI you already use" line and the CTA are gone (the website around the hero carries them).

- 2026-11-17 (later): team: "find a better style for the transition into the ending." **v17**: object carry into the end card instead of the whip. ALFA's mark, which walked the canvas nodes, doesn't leave: after the last node it flies to the centre and grows (the disc and glow fade, leaving the bare mark at the end card's size and place) while the canvas pulls back, blurs and goes dark; the end card starts with that mark already in place, a ring goes out, "ALFA" sharpens in under it and the AdFlex logo settles on top. Riser + whoosh on the carry, impact on the landing.

- 2026-11-17 (later): team: "render it at the highest quality, add music and transitions, and generate whatever is needed if the quality is poor." Approved 97 credits (music 43, story upscale 30, 4 SFX 24). **v18** (21.8 s), same picture edit as v17:
  - Quality: `render.sh` now renders a **ProRes 422 HQ master** (`-master.mov`, PCM audio, ~560 MB) and makes every deliverable from it: MP4 H.264 High CRF 12 preset slow + AAC 256k (~35 MB), WebM VP9 CRF 24 + Opus 160k (~8.5 MB), poster.
  - The story video is the 1080×1920 upscale (it was 720p with doubled frames, so it juddered in the big Result player).
  - Music: a new 120 BPM bed, arranged by `make_music.sh` (low-passed intro, half a beat of silence, drop on the Approve click at 8.0 s, high-passed breakdown under Lama's second product, second drop into the end card).
  - Transitions: a new whip SFX on every whip-pan cut, a riser + a card-lift swoosh into the drop, a morph swell as the story thumbnail grows into the player, a logo hit on the end card.
  - Mix: −15.6 LUFS integrated, true peak −2.0 dBFS.

## Credits
Earlier versions: 1,473 credits (see the entries above). From v10 on, every paid generation is logged here.

| Date | Account | What | Model | Credits |
|---|---|---|---|---|
| 2026-11-17 | dev | Candle product photo (4:5) | nano-banana-2-lite | 30 |
| 2026-11-17 | dev | Candle ads 1–3 (1:1, 2K) | seedream-5-5 | 168 |
| 2026-11-17 | dev | Candle story video (5 s, 720p, 9:16) | gemini_omni_flash_1_2 | 315 |
| | | **Total for v10** | | **513** |
| 2026-11-17 | dev | v11 shot 9: Lama photographs her candle (16:9) | nano-banana-2 | 60 |
| 2026-11-17 | dev | v11 shot 9 animated (3 s, 1080p, image_to_video; record 6afc8003d6d610203f3009ee) | gemini_omni_flash_1_2 | 273 |
| 2026-11-17 | dev | v11 shot 8: winter versions of serum ads 1–3 (edit_existing, 2K) | seedream-5-5 | 168 |
| 2026-11-17 | dev | v13 shot 3: Lama photographs the serum (16:9) | nano-banana-2 | 60 |
| 2026-11-17 | dev | v13 shot 3 animated (3 s, 1080p, image_to_video; record 6afca643d6d610203f30a184) | gemini_omni_flash_1_2 | 273 |
| 2026-11-17 | dev | v18 music bed (22.6 s, 120 BPM) | elevenlabs music | 43 |
| 2026-11-17 | dev | v18 story video upscale to 1080×1920 (record 6afcb2a4d6d610203f30c574) | bytedance_video_enhancement_standard | 30 |
| 2026-11-17 | dev | v18 SFX: whip, card lift, morph, logo hit | sound effects | 24 |
| | | **Running total for this video** | | **2917** |

## v11 script (proposed 2026-11-17, awaiting approval)
Team feedback on v10: a human element in the transitions, more than one change in the same workspace, ALFA's role clear, built on a problem and its fix (no competitor comparison), and show a prompt **editing** the workflow. ALFA really edits saved workflows (`get_workflow_context` → `prepare_workflow_graph` with `workflowId`, in adflex-be `src/modules/alfa/tools/workflow/workflow.tools.ts`), so the edit beat is honest.

- **Problem:** every week a small business redoes the same content by hand. Workflows fix that, but a node canvas is scary to build and harder to change.
- **Idea:** you don't touch the canvas, you talk to it. One sentence builds the workflow, one sentence edits it.
- **People:** Lama only (team decision, 2026-11-17): the girl in `girl.mp4` (still 1 v3), who owns the candle shop. The earlier Karim + Lama option was dropped.
- **Motion:** [ui-step-walkthrough](../../../motion-styles/ui-step-walkthrough.md) structure with a fixed AdFlex lockup, [in-world-oner](../../../motion-styles/in-world-oner.md) for the people, [accent-typed-prompt](../../../motion-styles/accent-typed-prompt.md) for both prompts, [corner-type-labels](../../../motion-styles/corner-type-labels.md) (typed) for every label, the existing glitch title. Transitions: [hard-cut-blur-settle](../../../transitions/hard-cut-blur-settle.md) by default, [foreground-wipe](../../../transitions/foreground-wipe.md) + [object-carry](../../../transitions/object-carry.md) (the product photo is the thread: phone → composer attachment → canvas node), [style-swap-cut](../../../transitions/style-swap-cut.md) for summer → winter ads, and one [whip-push](../../../transitions/whip-push.md) into the end card.

| # | Time (s) | Picture | Source | Label (bottom left, typed) | In |
|---|---|---|---|---|---|
| 1 | 0–2.1 | WORKFLOW × ALFA glitch title | existing | — | — |
| 2 | 2.1–4.6 | **Problem.** Karim in his small skincare studio at night, shelves of unlabeled bottles, exhales, lifts his phone and photographs the serum on the stone ledge; the phone comes toward the lens and fills the frame | generated (still + 3 s anim) | EVERY WEEK. SAME WORK. | hard cut + blur settle |
| 3 | 4.6–7.4 | The real ALFA composer; the photo from his phone shrinks into the attachment; the sentence types with a purple wake: "Build me a workflow: I give you a product photo, you make 3 ads and a story video with music." Send | `alfa.mp4` (field cleared, text re-typed over it) | ONE SENTENCE BUILDS IT. | foreground wipe (the phone) |
| 4 | 7.4–8.6 | ALFA's workflow card, "Open workflow" | `alfa-reply.mp4` | — | hard cut |
| 5 | 8.6–11.0 | The real canvas; the attached photo lands in "Your product photo"; slow push along the wires | `runout.png` + v10 morph | ONE WORKFLOW. | object carry |
| 6 | 11.0–13.0 | INPUT \| OUTPUT split, the real serum outputs (shortened) | existing | 3 ADS + A STORY VIDEO. | hard cut |
| 7 | 13.0–16.0 | ALFA beside the canvas: "Also make a winter version of the ads." types with the wake; the canvas gets a new, wired ads node | **new real recording** | ONE SENTENCE EDITS IT. | hard cut |
| 8 | 16.0–17.6 | Only the new node runs; a summer ad cuts to its winter version | new recording + its real outputs | — | style-swap cut |
| 9 | 17.6–20.8 | Lama in her candle shop photographs her candle; phone to the lens; the photo lands in the same canvas node and every output flips to the candle, in wire order | generated (still + 3 s anim) + v10 swap | SAME WORKFLOW. HER PRODUCT. | foreground wipe → object carry |
| 10 | 20.8–23.2 | Everything made: both story videos + the winter ads | existing + new outputs | FROM ONE SENTENCE. | hard cut |
| 11 | 23.2–26.4 | End card | existing | — | whip push (the only one) |

Needs (credits quoted on dev; get a yes before each):
- Karim: still 60 + animation 273 (Omni Flash 1.2, 3 s, 1080p). Lama: the same, 333. Stills first, reviewed before animating.
- Shot 7–8: a real recording of ALFA editing the saved workflow and running only the new node (~168 for 3 Seedream ads; ALFA quotes it in the recording). Public version on prod.
