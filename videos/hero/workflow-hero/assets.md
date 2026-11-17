# Workflows in one sentence: assets

Stills: devAdflex (`6acb3fb640ba55f116584c78`), because prod ran out of credits on 2026-11-16. ALFA and canvas recordings must still be made on prod.

## Stills
| Shot | Model / cost | Link | Notes |
|---|---|---|---|
| Lama sheet v1 (prod) | nano-banana-2 / 60 | https://cdn.adflex.ai/ai-content/images/9138d4e8-14d0-4dfe-9b19-3677293d73ea.jpg | **Rejected:** looked about 30; the team wanted a younger girl |
| Lama sheet v2 (dev) | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/fa5403a7-48a2-4183-95cd-736e98550ed8.jpg | About 22–24, claw clip, cardigan, jeans, white sneakers. Front, 3/4, side, sigh, smile |
| 1 · laptop at night | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/a8a3ad54-1c36-4f57-b01c-6bfcece0806f.jpg | Good mood. Laptop screen faces away (we see the lid, a plain ring mark), so the tangled-nodes screen must be a separate insert. Odd breath mist near her mouth . **Replaced** by 1 v2 (team wanted a different, prettier girl in a lighter outfit) |
| 1 v2 · new girl, laptop at night | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/591c8698-0df0-45af-ac6a-ad3c0521f425.jpg | Early 20s, hair down, white sleeveless ribbed top, jeans, gold necklace. Tired, chin on hand. Laptop lid faces camera again (plain, no logo), so the screen isn't visible; fine for the glow → tabs transition . **Replaced** by 1 v3 (team wanted an office and on-brand colours) |
| 1 v3 · office, brand colours (**current**) | gpt-image-2-6-sunburst edit of 1 v2 / 70 | https://cdn-dev.adflex.ai/ai-content/images/0976dd18-a816-4ad0-8533-9763fd9d54da.jpg | Same girl and pose; modern home office at night, lavender/violet LED shelves, desk lamp, city window. Laptop lid plain, screen faces away |
| 2a · photographing a candle | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/b581a9c9-5582-49ce-a26a-9e2ccfc9e669.jpg | Clock at 9:00 (has numerals). Good . **Unused** in the hero (Lama only in shot 1); keep for a social cut |
| 2b · editing on phone | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/8ebcb768-5a9e-418b-a1ed-e07c440323bb.jpg | Clock at about 11:55. Good . **Unused** in the hero (Lama only in shot 1); keep for a social cut |
| 2c · tired story | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/72c1ed7c-a0f5-4b10-a496-dedc8f5dccfd.jpg | Rubbing her eye, works. Room reads as a kitchen, not the shop; no clock . **Unused** in the hero (Lama only in shot 1); keep for a social cut |
| 6 · sofa with tea | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/8251f6b2-2835-4f6b-8977-027b7af1fd79.jpg | Lavender phone, upper-right wall free for the title. Good . **Unused** in the hero (Lama only in shot 1); keep for a social cut |
| 9 · Lama photographs her candle (v11, **current**) | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/4f3ab4ca-59a7-4217-97dd-d727938e5f5c.jpg | Same girl and office as 1 v3 (refs: 1 v3 + the candle product photo). The candle sits lit on a travertine ledge, right foreground; she shoots it with her phone. The phone has an iPhone-like triple camera but no logo. Animated below (`lama-candle.mp4`). |
| 3 · Lama photographs the serum (v13) | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/f7db77b0-7865-48f9-9a3c-fe766682db8d.jpg | Same girl, desk and laptop as 1 v3 (refs: 1 v3 + the serum input photo). Seated, shooting the serum on a travertine block in the right foreground, phone held level in both hands. Opens the story: her photo flies into the ALFA prompt. |
| Workflow input · serum bottle (dev) | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/a3767bff-6c36-482d-a86d-4c0d88e7f33a.jpg | Logo-free frosted serum bottle, lavender dropper, lilac backdrop, 4:5. Attached in ALFA as the product photo for the recorded workflow. |

## Clips
| Shot | Model / cost | Link | Notes |
|---|---|---|---|
| 1 · girl sighs (anim v1, dev) | gemini_omni_flash_1_2, image_to_video from still 1 v3, 3 s, 1080p, 24 fps / 273 | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/79358632-b94c-4444-a596-2be4aeb19408.mp4 | Sighs/yawns with her hand on her cheek, then her eyes go back to the laptop; slow push-in. No logos. The model added audio; the silent copy is `renders/shot1-anim-v1.mp4` (git-ignored). |
| Screen rec · Take A (failed attach, dev, local FE) | screen recording / 0 | `renders/rec/takeA-fail-attach/take.mp4` (local, git-ignored) | Photo attached straight in chat; ALFA refused to save the workflow ("product photo needs to be saved as a reusable source asset"). Typing segment may be reusable. |
| Screen rec · Take A2+B (dev, local FE) | screen recording / 0 | `renders/rec/takeA2/take.mp4` (local, git-ignored), marks in `marks.json` | 1920x1080 30 fps, dark UI, AdFlex.ai brand, Ask mode. My assets → serum → typed prompt → ALFA plans (~1m30) → "Run this plan? Free" → draft saved → Open workflow → auto-layout + fit. |
| Screen rec · Take C (dev, local FE) | screen recording / 510 run | `renders/rec/takeC/take.mp4` (local, git-ignored), marks in `marks.json` | Box-select 8 steps → "Run selected · 510 cr" → Review and run (Total 510) → all steps complete in ~85 s → outputs opened in the lightbox → story video plays. |

## Build clips (privacy-safe edits used by the Remotion build)
Uploaded to dev on 2026-11-16 so anyone can rebuild: `bash tools/fetch_media.sh videos/hero/workflow-hero/build/remotion/media.tsv` (checks each sha256).
Recorded on the **dev** account; record again on prod before the public version.

| File in `build/remotion/public/` | Link | Notes |
|---|---|---|
| `alfa.mp4` | https://cdn-dev.adflex.ai/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6afb44cc539c3a84eb10febf.mp4 | ALFA chat from Take A2. Sidebar (chat history, avatar) and the greeting name painted out. |
| `runsel.mp4` | https://cdn-dev.adflex.ai/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6afb44cc539c3a84eb10fece.mp4 | Box-select + "Run selected" from Take C. |
| `girl.mp4` | https://cdn-dev.adflex.ai/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6afb44cc539c3a84eb10fedd.mp4 | Shot 1 anim v1, silent. |
| `alfa-reply.mp4` | https://cdn-dev.adflex.ai/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6afc4818c816325700ff9a00.mp4 | ALFA's answer from Take A2 (v7): 165.9–169.6 s at 2.6× (Approve → workflow card appears) + 209.3–211.45 s at 1.2× (click Open workflow). Cropped to x 72–1536 (no sidebar, no avatar). |
| `ad1.jpg` … `ad3.jpg` | the three ad outputs below (originals, 2048², via `media.tsv`) | Ad 1 is shown big in v7; ads 2–3 stay small. |
| `serum.jpg` | the "Workflow input · serum bottle" still below (928×1152, via `media.tsv`) | The INPUT shots (v9). |
| (no file) ALFA card, Run-click hold | `<Still>` of `alfa-reply.mp4` frame 70 (card at 58,413, 658×298) and `runsel.mp4` frame 103 | v9 cards; frame 103 is the last frame before the dialog that shows the balance. |
| `candle.jpg`, `candle-ad1.jpg` … `candle-ad3.jpg` | the "Second product · candle" outputs below (originals, via `media.tsv`) | v10 swap. The story thumbnail is a `<Still>` of `candle-story.mp4` frame 138. |
| `candle-story.mp4` | https://cdn-dev.adflex.ai/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6afc5d57c816325700ffe0bf.mp4 | The candle story video re-encoded to 30 fps, square pixels, no audio. |
| `lama-candle.mp4` | https://cdn-dev.adflex.ai/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6afc812fd6d610203f300f2a.mp4 | v11 shot 9, silent, 30 fps. Raw: https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/5050e5c9-da03-4a17-bf30-d23e9d171f16.mp4 (gemini_omni_flash_1_2 image_to_video from the still, 3 s 1080p 24 fps, 273 cr, came with audio). She shoots the candle, smiles, brings the phone at the lens; the camera eases back a little although the prompt said locked-off. The edit pushes into the phone back for the last 14 frames. |
| `lama-serum.mp4` | https://cdn-dev.adflex.ai/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6afca8c8d6d610203f30a8fd.mp4 | v13 shot 3, silent, 30 fps with every source frame shown once (setpts 24/30, so it plays 1.25x faster with no doubled frames). Raw: https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/72b0f892-ccbf-49dd-8ddb-b5f145ab2e47.mp4 (gemini_omni_flash_1_2 image_to_video from the serum still, 3 s 1080p 24 fps, 273 cr, came with audio). She frames the serum, taps at source ~30, lowers the phone and smiles at the photo; the camera eases back although the prompt said locked-off. |
| `alfa-edit.mp4` | https://cdn-dev.adflex.ai/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6afc8dbfd6d610203f304abb.mp4 | v11 shot 7. Real screencast of ALFA on localhost (dev API, AdFlex.ai brand), 2026-11-17: "Also make a winter version of the ads." typed, sent, then "Understanding the request" → "Planning the steps…". 36 s, silent, 30 fps. **ALFA did not finish the edit:** in that chat the build before it failed ("product photo was not bound to a supported saved source") and the winter request ended with "I couldn't prepare the winter versions" (0 credits). In the older serum chat ALFA asked for the link, then could not read the draft: ALFA only edits drafts it built in the same conversation (adflex-be `alfa-workflow-bridge.service.ts`, `draft()`). The edit uses only the typing and the status line (band crop), never the replies. |
| `winter-ad1.jpg` … `winter-ad3.jpg` | https://cdn-dev.adflex.ai/ai-content/images/e7aa9ab9-4f83-4b02-94da-4769ca0bcec7.jpg · https://cdn-dev.adflex.ai/ai-content/images/78e4a974-c2b8-4a7d-b557-d44f3e07de0a.jpg · https://cdn-dev.adflex.ai/ai-content/images/54a55b9f-e5a1-4ff1-b7d2-cd5db4c701d0.jpg | v11 shot 8. Winter versions of serum ads 1–3 (seedream-5-5 edit_existing, 2K, 56 cr each = 168), same layouts, snow and cold light. Made directly with gen_image, not by an ALFA workflow run (ALFA's edit failed on dev, see `alfa-edit.mp4`). Label text is model gibberish, as in the originals. Originals via `media.tsv`. |
| `story.mp4` | https://cdn-dev.adflex.ai/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6afcb3bbd6d610203f30ca8f.mp4 | v18: the story video output upscaled to 1080×1920 (raw upscale https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/0d929c90-4a89-44ef-90a1-b8dcca3dfb7f.mp4, bytedance_video_enhancement_standard, 30 cr, from the "Story video + music" output), audio stripped. The upscaler interpolated it to 30 fps: 147 of 149 frames unique, against 113 of 150 in the old 720p copy (https://cdn-dev.adflex.ai/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6afb44cc539c3a84eb10feec.mp4), so it no longer judders. |

The raw screen takes (`renders/rec/`, 931 MB) are still **local only**.

## Audio
All on dev, generated 2026-11-16 for v6 (80 credits). Local copies are in `build/remotion/public/audio/` (fetched from `media.tsv`; `click.wav` is tracked in git and in `brand/sfx/`).

| What | Link | Notes |
|---|---|---|
| Music, 20 s, 120 BPM | https://cdn-dev.adflex.ai/ai-music/6acb3fb640ba55f116584c78/generated-audio/fc374f3e-05e0-4b07-92d7-970274a55f57.mp3 | ElevenLabs Music v2.5, composition plan intro 6 s / drop 8 s / payoff 6 s, 38 cr. The model put the drop at **8.0 s** and went silent at **16 s**, so the edit re-cuts it (see production.md). |
| SFX whoosh (0.8 s) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/f182f328-25ec-4215-a87a-a33131ae145b.mp3 | Whip transitions. Very short and punchy. 6 cr. |
| SFX glitch (0.6 s) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/1dce844a-73ee-4072-8d04-13aa078441ac.mp3 | Title fill. Quiet (two small blips), so use it at full volume. 6 cr. |
| SFX riser (1 s) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/30d42380-b8de-49c6-bf0d-e412bfee4ee1.mp3 | Builds to the end, so it peaks at 1.0 s. Chip growing. 6 cr. |
| SFX click (0.5 s) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/a1c28994-2da4-45c0-9892-08aea2916914.mp3 | **Unusable: silent** (peak −60 dB). Replaced with a free synthesized `click.wav` (ffmpeg sine + noise). 6 cr. |
| SFX scan shimmer (0.8 s) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/3c2f51f2-dfa4-4dec-85e1-a24fd0de325a.mp3 | Run scanline. Loud at the start, then decays. 6 cr. |
| SFX pop (0.5 s) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/b811b525-20de-4ddc-95a5-4a0c6a9bfac2.mp3 | Tool cards and result pops. 6 cr. |
| SFX logo impact (1.5 s) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/8bb1643d-a73a-42c2-a695-465eac3b440d.mp3 | End-card logo. 6 cr. |
| Music v18, 22.6 s, 120 BPM (`music2.mp3`) | https://cdn-dev.adflex.ai/ai-music/6acb3fb640ba55f116584c78/generated-audio/ac83c5c9-d1cb-4efb-adcf-195c7e0a2233.mp3 | 43 cr. Ignored its composition plan: a flat loop, chords in at 8.0 s, a crash every 4 s, decays from 20.0 s, kick phase +0.03 s, peak −0.7 dB. `build/remotion/make_music.sh` arranges it with filters into `music-shaped.wav` (low-passed intro, gap, drop at 8.0 s, high-passed breakdown 13.5–16.5 s, second drop). |
| SFX whip (0.6 s, `sfx-whip.mp3`) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/4db12d21-3c6b-4f55-ad93-0768f76a4f2f.mp3 | v18 whip-pan cuts. Peaks 2 frames in, −0.5 dB. 6 cr. |
| SFX card lift (0.8 s, `sfx-lift.mp3`) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/eb702248-0b90-4963-b36b-02647879840f.mp3 | v18 Approve card lifting (Plan B). Quieter (peak −9.5 dB), so use it at full volume. Peaks 6 frames in. 6 cr. |
| SFX morph (1.0 s, `sfx-morph.mp3`) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/c53e834a-2965-48c4-bf4f-c48100bb29b9.mp3 | v18 story thumbnail growing into the player. Hot (peak +0.8 dB), use ≤ 0.55. Peaks 6 frames in. 6 cr. |
| SFX logo hit (2.5 s, `sfx-logo.mp3`) | https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/552cdd69-d80c-4a8d-b260-45b105f6c56b.mp3 | v18 end card landing (replaces the impact). Peaks 4 frames in, −0.4 dB. 6 cr. |

## Workflow run outputs (dev, workflow `6afb2498539c3a84eb106c27`, run 2026-11-16, 510 credits)
| Output | Link | Notes |
|---|---|---|
| Ad image | https://cdn-dev.adflex.ai/workflow/6acb3fb640ba55f116584c78/outputs/images/499fb9e0-3039-4c74-9295-6cd719c72f1f.jpg | Seedream 5.5, 2K. One of the 3 ads. |
| Ad image | https://cdn-dev.adflex.ai/workflow/6acb3fb640ba55f116584c78/outputs/images/3fec9c5e-3a70-4cfd-8bd0-bef835c47951.jpg | Seedream 5.5, 2K. |
| Ad image | https://cdn-dev.adflex.ai/workflow/6acb3fb640ba55f116584c78/outputs/images/5041e4ec-62e0-4fae-aafc-26ba406dbebd.jpg | Seedream 5.5, 2K. |
| Story video (raw) | https://cdn-dev.adflex.ai/workflow/6acb3fb640ba55f116584c78/outputs/videos/7cedc1d1-4bcd-48af-82cf-4d17caecf5f9.mp4 | Gemini Omni Flash 1.2, 5 s, 720x1280. |
| Story video + music | https://cdn-dev.adflex.ai/workflow/6acb3fb640ba55f116584c78/outputs/videos/0125be73-575f-4b3e-b76b-68a018a66246.mp4 | Merge-audio output; local copy `renders/rec/outputs/story-music.mp4`. Clean pull-back from dropper to full bottle, no label. **Usable.** |

Ads problem: the model invented label text on a logo-free bottle (ad 1 "ALCUNE" + garbled copy) and ads 2–3 came out as 2x2 / 3-up grids of bottles with different invented names ("SLANE", "PEICR/PEXAR/PEIDA/PEIZA"). Not usable as-is in the hero.

## Second product · candle (dev, generated 2026-11-17 for the v10 swap, 513 credits)
Generated directly (not a workflow run: the workflow is FE-built and can't be run over MCP). Logo-free, no text.
| Output | Model / credits | Link | Notes |
|---|---|---|---|
| Product photo | nano-banana-2-lite / 30 | https://cdn-dev.adflex.ai/ai-content/images/382c7f34-6a3f-41f7-a863-c3194d07a78d.jpg | Ribbed clear glass jar candle, cream wax, wooden lid leaning, travertine ledge, 4:5 (928×1152, same framing as the serum). |
| Ad 1 (centered) | seedream-5-5 2K / 56 | https://cdn-dev.adflex.ai/ai-content/images/4e019c8c-d28c-4ba1-b123-de381d9875c2.jpg | Travertine plinth, pampas. |
| Ad 2 (left) | seedream-5-5 2K / 56 | https://cdn-dev.adflex.ai/ai-content/images/a7651ad7-4e06-45be-a111-f886973c78a4.jpg | Oak side table, lamp, evening. |
| Ad 3 (right) | seedream-5-5 2K / 56 | https://cdn-dev.adflex.ai/ai-content/images/e9b91cc2-a636-40c1-9ee6-cfa29300ecbd.jpg | Bathroom ledge, towel, eucalyptus. |
| Story video (raw) | gemini_omni_flash_1_2 5 s 720p / 315 | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/abae2649-bde6-469b-878e-e10471dfe9e2.mp4 | Flame macro → slow pull-back to the full candle. 24 fps, with audio (unused). |
