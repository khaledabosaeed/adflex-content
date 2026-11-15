# Claude + AdFlex = UGC machine: production notes

## Structure (v7, 2026-11-14)
1. **0–14 s, hook.** The girl's UGC ad plays full screen with her voice («يا جماعة، الساعة وحدة بالليل…»). No "Made by" badge.
2. **14–21 s, duet reveal.** Split screen, girl on top and Adnan at the bottom, both saying the same line in sync: «بدك تحوّل Claude لماكينة محتوى UGC؟ كل يوم فيديو، بدون تصوير ولا ممثلين، وكله من الشات مع AdFlex.»
3. **21–30 s, step 1.** Character-sheet request → Claude's brief → result.
4. **30–39 s, step 2.** Product and video request → quote → «مسك ليل» product shot → the video in the chat.
5. **39–45 s, step 3.** «انشره ريل» → draft post (**nothing published**). Ends on «وبينزل ريل على Instagram و TikTok».
6. **45.3–47.9 s, end card** with a fade-in and slow zoom-out:
   - AdFlex logo
   - «شغّال جوّا المساعد اللي بتستعمله»
   - two chips: [Claude icon] Claude and [OpenAI icon] ChatGPT
   - the small line «وبأي مساعد ذكاء اصطناعي بيدعم MCP»
   - «إعلانات UGC بدون تصوير / كلها من الشات»
   - adflex.ai
   - The OpenAI icon comes from Adnan's SVG (`sora.svg`). The Claude icon is the SVG used on adflex.ai/en/mcp.

**Steps layout (v7, "floating box"):**
- Adnan's full original take plays with **no cutout**, and his room is visible.
- The real Claude screen recording pops in with a 0.25 s fade as a floating rounded box over his chest. The box layer is 720×440 RGBA at y=770, with the window up to 650×370 centred near y≈990, a white border and a shadow.
- Take t4 is a close-up, so it's shrunk to 0.76 over a blurred, darkened copy of itself.
- Captions sit at y=762.

**History:**
- v3–v6 used a green-screen cutout (RVM matte) in front of a full-frame recording.
- v4 cut the comments CTA.
- v5–v6 reworked the end-card wording. Adnan rejected «أي موديل».
- An earlier split-screen version existed (v2).


## Audio
- Fixed per-clip gain to -16 LUFS plus a limiter at 48 kHz.
- Light denoise and a soft gate on the UGC pauses.
- The repeated "prompt" in t2 was cut, with a punch-in over the jump.


## Notes
- The screens show "devAdflex" in the typed prompt and the tool rows. Re-record on prod before a public release.
- Mixed Arabic/Latin captions are wrapped in RTL embedding.
- The build scripts were session-local and are gone (`/home/claude/rec2/rec_ugc_box.py`, `build_ugc_v6green.py`, `build_ugc_v2split.py`).
