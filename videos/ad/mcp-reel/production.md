# AdFlex MCP Reel (Arabic): production notes

## Flow
Talking hook with ad cards around Adnan → fast full-screen ad montage → back to Adnan → messy idea in the chat → editing inside the chat → **publishing to social media** → connector card → **simple connect: "Connect in Claude" on adflex.ai** → CTA → **multi-assistant end card**.


## v12 hook (2026-11-15): AdFlex-centred, Adnan talks from frame 1
- **Take K** (Omni Flash 1.2, 8 s, 720p, 504 cr, from take A's first frame): «كل هالإعلانات اللي حواليّ… ولا وحدة فيهم انصوّرت. كلها طلعت من رسالة وحدة لـ AdFlex.» The STT matches.
  - "AdFlex" runs to about 6.84 s. Cutting earlier clips the word.
- **0–3.5 s:** take K 0–3.5 with ad **cards popping around him**, clear of his face (which spans roughly x 110–515, y 75–760).
  - Card slots: bottom-left, bottom-right, and a small one at top-right by the bookshelf.
  - Each card is a white rounded frame with a shadow and an ease-back pop. Two cards hit on frame 1.
  - Captions sit at the top (y=96).
- **3.5–6.06 s:** a **fast full-screen montage**: 8 shots of 0.32 s at 1.3×, with a punch-in zoom and white flashes on 3 cuts, using the ads' own sound.
- **6.06–8.9 s:** back to Adnan, take K 4.05–6.90: «كلها طلعت من رسالة وحدة لـ AdFlex».
- The old Claude-centred line «صار فيك تحوّل Claude لاستوديو إعلانات…» (take A) is no longer used.


## v12 screens: no cutout
- Every screen-recording shot (idea, edit, social, connect and the CTA's connected page) shows **Adnan's full original take**.
- The real Claude screen pops in with a 0.25 s fade as a floating rounded box over his chest. The box layer is 720×440 RGBA at y=770.
- Take C is a close-up, so it's shrunk to 0.76 on a blurred fill.
- Captions in these shots sit at y=762.


## Earlier changes still in place
- v11: «حملتك…» was mispronounced, so it was cut. The ending is «وخلص، صار مربوط.» then «جرّب AdFlex هلّأ.» (take H 0.40–2.00 and 3.72–5.10).
- v10 end card:
  - AdFlex logo
  - «شغّال جوّا المساعد اللي بتستعمله»
  - Claude and ChatGPT chips
  - «وبأي مساعد ذكاء اصطناعي بيدعم MCP»
  - «حملتك الجاية / بتبلش من الشات»
  - adflex.ai
  - Adnan rejected «أي موديل».
- v9: no comments CTA, because this is a campaign ad. Take G is cut before the mispronounced «وبينربط».
- v6: simple connect through «Connect in Claude», from a real recording (**Continue was not clicked**).
- B-roll after the chat screens (coffee-campaign outputs) is re-cut fast.


## Real screen recordings
- Chat «إعلان فيديو لمحل قهوة» (link above): messy idea → devAdflex quote → Kling O3 Pro video → neon edit → draft post shown. **Nothing was published.**
- Connect flow: adflex.ai/en/mcp → «Connect in Claude» → the prefilled add-connector modal (Cancel was clicked) → the existing Adflex connector page.
- The typed prompt and the tool rows in the chat demo show "devAdflex".


## AdFlex MCP facts
- MCP URL: https://api.adflex.ai/api/mcp
- adflex.ai/en/mcp has a «Connect in Claude» button that opens Claude's add-connector dialog prefilled. The page also has ChatGPT and Claude Code tabs.
- Publishing supports Facebook, Instagram, TikTok, LinkedIn, X and YouTube Shorts. Snapchat is connect-only.


## Edit and audio
- Captions: Arabic in Cairo ExtraBold, white on a dark box, phrase-timed, wrapped in RTL embedding.
- Fixed per-clip gain: voice at -16 LUFS and montage at -17, plus a limiter at 48 kHz.
- The hook cards' own sound sits under the voice, side-chain ducked.
- The whole reel measures -16.0 LUFS.
- The build scripts were session-local and are gone (`/home/claude/edit/build.py`, `hook.py`, `/home/claude/rec/recbuild_box.py`).
