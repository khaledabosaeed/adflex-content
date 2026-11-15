# الحجة and the cheetah: assets

All links are full AdFlex CDN URLs (verified 2026-11-15).

## Assets (full links)
**Stills** (nano-banana-2, character_consistency; refs = الحجة sheet plus a fareej/pier still):
| Shot | Use | Link |
|---|---|---|
| s1b | Lunge start, cheetah crouched by the men (v4 hook) | https://cdn-dev.adflex.ai/ai-content/images/72f5dc42-b7fa-4014-b4a4-ecf1a9cbc507.jpg |
| s1 | Calm walk (unused since v4) | https://cdn-dev.adflex.ai/ai-content/images/053a0d47-0bd0-4253-a847-eb779179739c.jpg |
| s2 | ATM in an old wall | https://cdn-dev.adflex.ai/ai-content/images/5c7aba73-4a04-4b57-8aec-79476b535560.jpg |
| s3 | Sneaker shop | https://cdn-dev.adflex.ai/ai-content/images/73aa22ad-0d83-4e6b-880f-7727910a2363.jpg |
| s4 (v2) | Eidiya in a courtyard | https://cdn-dev.adflex.ai/ai-content/images/b323c9c1-a9cb-4449-be3a-c3b60ff1654f.jpg |
| s5 | Baby camel and sedan | https://cdn-dev.adflex.ai/ai-content/images/87970508-11e1-47ec-9539-0b371e9705f1.jpg |
| s6 | Drone in a palm farm | https://cdn-dev.adflex.ai/ai-content/images/daef18ab-a6a8-40d1-857d-12eb55ee25bf.jpg |
| s7 (v2) | Pickup in boutique "NOOR" (has a Toyota badge) | https://cdn-dev.adflex.ai/ai-content/images/082a8899-c77b-4ce1-91a2-0b0074b3faf5.jpg |
| s7 clean | Same, with the badge painted out locally | https://adflex-dev-storage.s3.us-east-1.amazonaws.com/uploaded-images/6acb3fb640ba55f116584c78/69eca7882576b44126acaece/6af20118812b6618dc14c429.jpg |
| s8 | Poster shot | https://cdn-dev.adflex.ai/ai-content/images/ad9edc6d-e5e4-4cdd-97db-2f2419d8ee80.jpg |
| rejected s4 v1 | The Dubai skyline leaked in from the pier ref | https://cdn-dev.adflex.ai/ai-content/images/212a7a4c-34d1-4b79-8872-8a2ef2c17478.jpg |
| rejected s7 v1 | Garbled Arabic signage | https://cdn-dev.adflex.ai/ai-content/images/4d8336ca-b5f1-4f32-aee9-9578f238eed0.jpg |

The references for الحجة are the character sheet in the devAdflex brand library (ID prefix 7ae2c068) and a pier photo (5514b48c, which caused the skyline leak). Find them with `list_brand_elements` on devAdflex.

**Clips** (Wan 3.0 Prime, image-to-video, 3 s, 720p, no audio):
| Clip | Link |
|---|---|
| c1b (lunge) | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/4a92e44d-49c4-42e9-99d8-4e26d9ed343e.mp4 |
| c1 (calm walk, unused) | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/b9d14ed9-46ef-47cc-86af-b6d9ab9bb892.mp4 |
| c2 ATM | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/8e150a79-07d8-4835-8086-b3ff9b7934a3.mp4 |
| c3 sneakers | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/e898fbb6-3d6c-435c-a68d-1df6ba03a7c9.mp4 |
| c4 eidiya | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/c1c71f5b-e117-44e3-bc6c-8026ea1ed1db.mp4 |
| c5 camel | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/b7216fec-a072-43f2-af8a-88526f5895ed.mp4 |
| c6 drone | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/bcf55ca7-8167-46bf-9c43-dfde3648bba2.mp4 |
| c7 boutique | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/a9bad376-e24d-4d9d-852d-4a14f10f692a.mp4 |
| c8 poster | https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/da827c8a-95cd-44af-8ec2-8ae6c7406385.mp4 |

**Audio:**
- Music (Khaleeji trap, a 14 s file; the music ends about 12.8 s): https://cdn-dev.adflex.ai/ai-music/6acb3fb640ba55f116584c78/generated-audio/edac82b9-7a01-4bad-9c57-841f100609ff.mp3
- SFX, cheetah snarl and cup clatter: https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/63fd8c88-be6e-4554-b2a8-18eb31e8aaf2.mp3
- SFX, ATM: https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/5768b544-896f-4a95-90ac-a18b01b3bf5e.mp3
- SFX, glass shatter: https://cdn-dev.adflex.ai/ai-sound-effects/6acb3fb640ba55f116584c78/generated-audio/c2d81154-bd60-4700-a28e-178de6719595.mp3

**Build:** the scripts were session-local (`/home/claude/hajja/build.py`, run as `python3 build.py out.mp4 0.05` where the 2nd argument is the snarl time, plus `textimg.py`). They are gone and would need rewriting from the timeline above.
