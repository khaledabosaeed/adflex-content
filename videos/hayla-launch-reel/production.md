# الإطلاق بكرا: the هيلة coffee can: production notes

## v16 (current, long): hayla-reel-v16.mp4, 40.2 s
Same as v15, with captions synced to the speech. Adnan said the text was out of step with the voice.
- Before, each caption showed for the whole shot from 0.12 s, so it appeared 1–2.5 s before the line was spoken.
- Now each clip carries timed chunks, measured from its own audio (speech bursts at -22 dB from peak). Times are seconds into each segment:
  - whisper 1.05–2.65
  - Faisal «اسمها هيلة…» 1.75–2.95, then «قهوة باردة بالهيل.» 2.95–4.35
  - sip 2.5–4.75
  - creative director «ما عندنا وقت…» 1.3–2.45, then «لا وكالة ولا تصوير.» 2.45–3.95
  - designer 0.6–2.15
  - majlis 1.65–3.95
  - payoff «أدفلكس…» 0.45–2.4, then «أدفلكس… وكلود.» 2.4–3.65 (cumulative, so AdFlex stays on screen)
- Audio placement was measured too: 0 ms offset in every dialogue clip.


## v15: AdFlex becomes the centre (Adnan, 2026-11-14)
Adnan noticed the v14 cut read like a Claude ad.
- **Payoff regenerated** on Omni Flash 1.2: image-to-video from the 0.7 s frame of the old payoff, 5 s, 720p, 315 cr.
  - New clip: https://cdn-dev.adflex.ai/ai-video/6acb3fb640ba55f116584c78/generated-videos/22fe2301-0431-4604-80fc-a3dd3893cf68.mp4 (record 6af8cf357a262f5e3137aabc).
  - The designer now says «أدفلكس… وكلود»: AdFlex at about 1.4–2.1 s, Claude at about 3.2–3.85 s. The edit uses 0.9–3.7 s plus a 0.75 s audio tail.
  - STT heard "AdFlicks وClaude". Claude is fine; the AdFlex vowel is worth a listen.
- **End card v4:**
  - A bigger AdFlex logo, as the hero.
  - The tagline «حملتك كاملة، بليلة وحدة» (no "conversation" wording that credits the chat assistant).
  - Smaller, quieter «يشتغل مع» chips, ordered MCP, then ChatGPT, then Claude (RTL).
  - The second line «وكل مساعد يدعم MCP» was dropped.


## v14: no repeats in the grid, AdFlex end card
- The zoom-out ends on a **3×5 mosaic** (15 cells) instead of 6×9. The 9 extra cells are all different assets: the prod billboards, the prod post «من الدلّة… للعلبة» and the old campaign videos. None repeats the central six.
- End card:
  - The real AdFlex logo (replacing «Claude × AdFlex»).
  - «حملتك كاملة، من محادثة وحدة».
  - «يشتغل مع» with Claude and ChatGPT chips (the OpenAI icon from Adnan's SVG) and a lime «+ MCP» chip.
  - The lime CTA «ابدأ حملتك الحين», then adflex.ai.
- Adnan asked **not** to use «أي ذكاء اصطناعي».


## Timeline (v15/v16)
| Time | Segment |
|---|---|
| 0.0–2.7 | Whisper «وصل أبو فيصل.» |
| 2.7–7.3 | Walk-in |
| 7.3–11.7 | Faisal «اسمها هيلة… قهوة باردة بالهيل.» |
| 11.7–16.5 | Sip «أبيها بالسوق بكرة الصبح.» (fade out) |
| 16.5–20.5 | Creative director «ما عندنا وقت… لا وكالة ولا تصوير.», with a «١١:٠٠ م» stamp |
| 20.5–22.7 | Designer «فيه طريقة واحدة.» (from 1.8 s, skipping the warped laptop) |
| 22.7–28.9 | Results grid |
| 28.9–32.9 | Majlis «مين سوّى هذا كله في ليلة؟» |
| 32.9–36.6 | Designer payoff «أدفلكس… وكلود.» (audio tail 0.75 s) |
| 36.6–40.2 | AdFlex end card |

Grid timeline (seconds into the grid):
- 0–1.1: the AdFlex prompt screen; the prompt types out and «ولّد» is pressed.
- 1.1–3.2: 2×3 placeholders fill one by one with an LED-block dissolve. The post cell is last: «مجدول 8:00 ص» → «تم النشر ✓».
- 4.05–5.35: zoom-out to the 3×5 mosaic. The extra column sits on the left, and the zoom centre drifts to x=272.
- Then a hold, and a lime burst cuts to the majlis.

The «تم النشر» cell is an ad dramatization for the fictional brand. In the real chat the post was only saved as a draft.


## v6 (short version, 34.7 s): hayla-reel-v6.mp4
Whisper, walk-in, Faisal and sip → AdFlex title card → the real Claude screen recording → 6 older campaign videos → majlis → the old lavender end card with the comments CTA.


## Earlier cuts
- v1–v5: a stills montage, then real video, Higgsfield-style lime transitions, title and end cards.
- v7 (47.85 s): a long cut with grid v1, the title card and the screen recording after the payoff.
- v8: without the title card.
- v9: without the screen recording.
- v10: payoff audio tail, dark end card with the ad CTA.
- v11: designer trimmed past the laptop warp.
- v12: grid v2 (6×9 mosaic with repeats) and the «Claude × AdFlex» logo end card.
- v13: v14 without the MCP chip.


## Open items
- Get the AdFlex logo as an SVG or high-res PNG. The brand-kit file is only 133×36 and was rebuilt at 16×.
- The end card claims AdFlex works with ChatGPT. Confirm the integration is live before running paid ads. Third-party logo use in ads should follow OpenAI's brand guidelines.


## Lessons
- Omni Flash 1.2:
  - Write lines with tashkeel, and give a ~4 s line 5 s.
  - Watch for burned-in subtitles; remove them with delogo.
  - Text-to-video with the can sheet as a product reference keeps the label well.
- Pronunciation hint for Claude: the vowel of "clawed", never "klawd".
- Captions: ASS + shaping=complex, with separate RTL lines. The Plex/Cairo Arabic subsets lack ASCII digits, so set 8:00 in the Latin font.
- Let a last line's audio tail run into the next shot.
- Time captions to the measured speech in each clip, not to the whole shot. Split two-part lines into phrases.
- Protect the product with a box mask when luminance-keying. Check hands and props frame by frame; trimming past a warp is free.
- In a mosaic, every cell must be a different asset. Count stills and the videos made from them as the same asset.
- Ads get an ad CTA. Use the real brand logo.
- In an AdFlex ad, AdFlex comes first everywhere: the spoken answer, the captions and the end card. AI partners appear as small, equal-weight integrations.
- Check a model's observations against the source. Never claim a post went live when it did not.
