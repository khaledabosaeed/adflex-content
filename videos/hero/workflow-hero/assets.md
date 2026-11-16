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
| Workflow input · serum bottle (dev) | nano-banana-2 / 60 | https://cdn-dev.adflex.ai/ai-content/images/a3767bff-6c36-482d-a86d-4c0d88e7f33a.jpg | Logo-free frosted serum bottle, lavender dropper, lilac backdrop, 4:5. Attached in ALFA as the product photo for the recorded workflow. |

## Clips
| Shot | Model / cost | Link | Notes |
|---|---|---|---|
| 1 · girl sighs (anim v1, dev) | gemini_omni_flash_1_2, image_to_video from still 1 v3, 3 s, 1080p, 24 fps / 273 | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/79358632-b94c-4444-a596-2be4aeb19408.mp4 | Sighs/yawns with her hand on her cheek, then her eyes go back to the laptop; slow push-in. No logos. The model added audio; the silent copy is `renders/shot1-anim-v1.mp4` (git-ignored). |
| Screen rec · Take A (failed attach, dev, local FE) | screen recording / 0 | `renders/rec/takeA-fail-attach/take.mp4` (local, git-ignored) | Photo attached straight in chat; ALFA refused to save the workflow ("product photo needs to be saved as a reusable source asset"). Typing segment may be reusable. |
| Screen rec · Take A2+B (dev, local FE) | screen recording / 0 | `renders/rec/takeA2/take.mp4` (local, git-ignored), marks in `marks.json` | 1920x1080 30 fps, dark UI, AdFlex.ai brand, Ask mode. My assets → serum → typed prompt → ALFA plans (~1m30) → "Run this plan? Free" → draft saved → Open workflow → auto-layout + fit. |
| Screen rec · Take C (dev, local FE) | screen recording / 510 run | `renders/rec/takeC/take.mp4` (local, git-ignored), marks in `marks.json` | Box-select 8 steps → "Run selected · 510 cr" → Review and run (Total 510) → all steps complete in ~85 s → outputs opened in the lightbox → story video plays. |

## Audio
All on dev, generated 2026-11-16 for v6 (80 credits). Local copies are in `build/remotion/public/audio/`.

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

## Workflow run outputs (dev, workflow `6afb2498539c3a84eb106c27`, run 2026-11-16, 510 credits)
| Output | Link | Notes |
|---|---|---|
| Ad image | https://cdn-dev.adflex.ai/workflow/6acb3fb640ba55f116584c78/outputs/images/499fb9e0-3039-4c74-9295-6cd719c72f1f.jpg | Seedream 5.5, 2K. One of the 3 ads. |
| Ad image | https://cdn-dev.adflex.ai/workflow/6acb3fb640ba55f116584c78/outputs/images/3fec9c5e-3a70-4cfd-8bd0-bef835c47951.jpg | Seedream 5.5, 2K. |
| Ad image | https://cdn-dev.adflex.ai/workflow/6acb3fb640ba55f116584c78/outputs/images/5041e4ec-62e0-4fae-aafc-26ba406dbebd.jpg | Seedream 5.5, 2K. |
| Story video (raw) | https://cdn-dev.adflex.ai/workflow/6acb3fb640ba55f116584c78/outputs/videos/7cedc1d1-4bcd-48af-82cf-4d17caecf5f9.mp4 | Gemini Omni Flash 1.2, 5 s, 720x1280. |
| Story video + music | https://cdn-dev.adflex.ai/workflow/6acb3fb640ba55f116584c78/outputs/videos/0125be73-575f-4b3e-b76b-68a018a66246.mp4 | Merge-audio output; local copy `renders/rec/outputs/story-music.mp4`. Clean pull-back from dropper to full bottle, no label. **Usable.** |

Ads problem: the model invented label text on a logo-free bottle (ad 1 "ALCUNE" + garbled copy) and ads 2–3 came out as 2x2 / 3-up grids of bottles with different invented names ("SLANE", "PEICR/PEXAR/PEIDA/PEIZA"). Not usable as-is in the hero.
