# Al's Diner hero (superseded by bloom-hero): production notes

## v5–v6 changes (Adnan, 2026-11-09)
- **Faster motion.** Plates were time-compressed 1.2–1.8× with setpts. The hero went from 24.5 s to 17.4 s and the social cut from 28.1 s to 19.4 s.
- **Reference-style opening (0–2.2 s)** over the V0 plate, where a semi-truck passes the diner:
  - a small "AdFlex × GPT Image" row at the top;
  - **GPT IMAGE** lands word by word, then a large gradient **2.6** with overshoot;
  - an **ON ADFLEX** pill, PNG/SVG/"Al's Diner" chips and sparkles;
  - a zoom-blur exit.
- **v6 softer colours:** gradient #88B0EC → #AC94E8, title white #F4F3F8, glow roughly halved.
- Social music (ElevenLabs v2.5, 19.5 s, 118 BPM): https://cdn.adflex.ai/ai-music/6adc7785123283962dbffc92/generated-audio/af5f7b47-eb01-456b-b411-692520387b8d.mp3


## v4 (kept): real AdFlex UI
- Real captures of adflex.ai/en/user/ai-images (model=gpt-image-2-6-sunburst), taken in the built-in browser while not signed in. **Nothing was generated or submitted.**
- The flying sprite is the OpenAI knot from Adnan's file (`gpt_logo.png`).


## Timeline (seconds)
| t | Segment | Event |
|---|---|---|
| 0–2.2 | V0 truck | Opening title |
| 2.2–4.0 | V1 exterior | "Billboard for grandpa's diner: huge burger, $6.99" → knot to the billboard |
| 4.0–6.4 | V2 billboard builds | at 5.3: "Now a glowing roof sign: AL'S DINER" |
| 6.4–8.6 | V3 roof sign | Neon and chrome flashes at 6.7 and 6.9 |
| 8.6–10.2 | V4 interior | "Redesign the menu and uniforms to match" |
| 10.2–12.2 | V5 menu | PERFECT TEXT. / EVERY TIME. |
| 12.2–14.0 | V6 uniform → JUNE | |
| 14.0–15.4 | V7 truck back seat | "Turn it into a social post: The Big One, $6.99" → knot into the phone |
| 15.4–17.4 | V8 phone ad | ADS FROM / ONE PROMPT. (the V8 middle 1.0–2.9 s morphs "$6.99", so it's cut) |


## Cost
- Images: 16 × 70 = 1,120.
- Plates: 2 × 455 + 7 × 364 = 3,458.
- Music: 46 + 54.5 + 37.5.
- **Total ≈ 4,716 credits.**


## Notes
- The OpenAI logo and the "GPT Image 2.6" name are OpenAI trademarks. Check OpenAI's brand guidelines before running paid ads that pair them with AdFlex.
