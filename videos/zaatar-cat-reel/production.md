# زعتر عمل إعلان بمحادثة وحدة: production notes

## Current cut: zaatar-reel-v4-anyai.mp4
This is the draft 5 picture plus music. Only the end card changed from v2.

### End card v4 (2026-11-14): "works with the AI you use"
What Adnan asked for, in order:
1. The reel only talks about Claude, so put the GPT logo at the end.
2. Drop the «وأي AI» chip; find a nicer way.
3. v3 («مش بس جوّا Claude… وكمان جوّا ChatGPT») was wrong, because it implies only Claude and GPT.

The message to keep: AdFlex works with any AI you use. Claude and ChatGPT are examples only.
- Layout:
  - AdFlex logo.
  - Headline «اربطه بالـ AI اللي بتستخدمه» (#1C1824, Cairo ExtraBold 64).
  - A row of white pills, read right to left: [GPT knot + ChatGPT] [Claude] [round «+» badge in #9848FE = "and more"].
  - adflex.ai (#9848FE).
- Pills: Cairo SemiBold 58, 120 px tall, #E0D0FB border, soft purple shadow.
- Timing: logo in at +0.25 s, headline at +0.6, pills at +0.95 / 1.1 / 1.25, URL at +1.6. The end card is 3.2 s.
- GPT knot: Adnan's own SVG (`sora.svg`, white fill), recoloured #111111. Claude appears as text only.
- Rejected:
  - «بيشتغل مع» with the chips ChatGPT / Claude / وأي AI.
  - The v3 twist «مش بس جوّا Claude… وكمان جوّا ChatGPT».

### AdFlex logo (from v2)
- Source: the brand-kit logo, only 133×36 px: https://cdn-dev.adflex.ai/business/6acb3fb640ba55f116584c78/logos/cea297f5-ba03-4f5f-a856-bf5332d6c36e.png
- Real colours: «Ad» #3292FF blue, «Flex» #9848FE purple, big sparkle gradient #C95AC5 → #55AAFF, small sparkle #F83AAE → #D453C2.
- Rebuilt at 1338×368: letters upscaled 10× and snapped to the two flat colours, sparkles redrawn as vector superellipse stars. A true vector logo from AdFlex would still be better for paid ads.
- Background #F7F5FC with soft #D9C1FB glows at the top and bottom only.

### Music
- ElevenLabs Music v2.5, 42 s instrumental (oud, darbuka/riq, mellow bass, Rhodes, about 92 BPM), 80 cr: https://cdn.adflex.ai/ai-music/6adc7785123283962dbffc92/generated-audio/3256a30b-be35-4e78-b27e-5753a2be6a4c.mp3
- Mix:
  - Music at -5 dB, ducked under the voice (sidechaincompress threshold 0.025, ratio 5, attack 25 ms, release 350 ms), so it sits about 10–12.5 dB below the voice during speech.
  - Raised ×1.7 on the end card (from 38.7 s).
  - 0.5 s fade in, 1.5 s fade out.
  - Final loudnorm to -14 LUFS.

### Picture (AdFlex colours from the adflex.ai/ar/alfa theme)
- Captions: white Cairo ExtraBold on a rounded #8738F5 box, at the bottom.
- Titles: white Cairo Black with a deep-purple glow at the top: «محادثة وحدة.», and in s8 «فكرة · فيديو · نشر» → «أسرع · أرخص» → «والقرار إلك».
- Screen cards: 6 px #8738F5 frame with a purple-tinted shadow. No coffee videos (Adnan: only the cat and screen captures).
  - s3: the prod Adflex connector page.
  - s4: the messy prompt.
  - s5: the quote, then «الريل جاهز».
  - s6: the neon request, then «النسخة الليلية بالنيون جاهزة».
  - s7: the publish request and draft caption.
- Structure: dead air trimmed at both ends of every scene, and a 0.22 s dissolve plus audio crossfade at every join. Full-reel STT: all lines present, in order.
- **Placeholders:** the s4–s7 screens come from the dev chat and show "devAdflex". The s7 screen shows a draft, while the line says it was scheduled.
- The build was session-local and is gone (`/home/claude/zaatar/build_edit3.py`, `textimg.py`).

Earlier versions, now replaced:
- Draft 1: 52.7 s, hard cuts, coffee videos.
- Draft 2: black captions.
- Draft 3: text wordmark.
- v2-logo: end card «اربطه بـ Claude… وجرّب».
- v3-gpt: the two-AI twist ending.


## Cost
Sheets 120 + hooks 945 + scenes 2–8 2,835 + retakes 3/5/7 1,197 + scheduling scene 7 ×3 1,134 + music 80 = **6,311 credits**. The prod balance before was 30,546.


## Still to do
- Re-record the chat on prod Adflex for the public version. Scene 7 needs a scheduled post: schedule it, capture the screen, then cancel it before it goes live.
- Confirm that ChatGPT and other clients are supported, and check OpenAI's logo-usage rules, before publishing.
