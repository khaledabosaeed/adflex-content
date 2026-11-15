# ALFA Agent: حملة كاملة من سطر واحد: production notes

## v3 (current): alfa-reel-v3.mp4
Same picture as v2, with the audio fixed.
- In v2, take B's narration started at 0 s instead of 8.0 s, because adelay didn't apply to the pre-rendered voice track. It overlapped take A in the opening.
- v3 rebuilds each voice track by prepending exact silence (anullsrc concat). Each start was checked: A at 1.4 s, B at 8.0 s, C at 17.6 s.
- STT of the first 8 s now returns only take A's sentence.
- 23.8 s, -15.1 LUFS, peak -2.5 dBFS.


## v2 picture
Changes after Adnan's feedback on v1:
1. **ALFA's real platform theme** instead of dark and gold. Values read from adflex.ai/ar/alfa:
   - background: lavender gradient #D9C1FB → #F5F5FA
   - cards: white glass with a purple border rgba(156,71,255,.45) and 16 px radius (doubled for the video)
   - text #333 and accent #8738F5 (the send button)
   - font: IBM Plex Sans Arabic
2. **Faster.** A hero montage of 4 cuts (about 1.1 s each), pauses trimmed, narration at 1.07×, typing at 0.2 s per word, cards about 1 s each.
3. **«حملتك» mispronounced in take C, so it was cut.** The creator now says only «روح اعملها على ألفا» (C 4.75–7.0, with the pointing). «تاب واحد… وكيل واحد» plays over the recap.

Timeline:
| t | Section |
|---|---|
| 0–4.7 | Hero montage |
| 4.7–8.0 | Prompt |
| 8.0–15.3 | Step cards (the publish card runs 12.95–15.3) |
| 15.3–17.6 | «0 settings touched» chip |
| 17.6–19.7 | Recap |
| 19.7–22.0 | Creator on camera |
| 22.0–23.8 | End card |

v1 (replaced) was 33.6 s with a dark/gold theme and used the full take C, including the mispronounced «حملتك».


## Prompt screen
A real ALFA recording (adflex.ai/ar/alfa, Arabic UI) of «محل عطور عود بجدة، بدي إعلان يحسّس الناس بليلة شتوية فخمة.» typed word by word. It was **never sent**: the text was cleared and the page reloaded. The input column was scaled up in the browser for readability.


## Build
Session-local and now gone: `scratchpad/cards/build_reel2.py`, `card.html` (light theme), `overlay.html`.
- Audio was pre-rendered into separate WAV files, because an inline voice-trim filter graph deadlocked ffmpeg.
- When rebuilding voice tracks, offset them by prepending silence, not with adelay.


## Honesty notes before publishing
- Cards 01 (brand) and 06 (publish) are designed, and nothing was published. Cards 02–05 show real outputs.
- The assets were generated through the AdFlex MCP, not from inside ALFA. Before running the ad, confirm that ALFA does all six steps, including publishing, from one prompt.
