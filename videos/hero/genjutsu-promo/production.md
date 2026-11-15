# AdFlex Genjutsu promo: production notes

## Look (final)
- Fonts: Unbounded Black for wide headlines, Anton for condensed lines.
- Colours:
  - Navy #07051a for the title and end card.
  - Scene backgrounds use a pink #ff2ea6 → violet #a12bff → blue #2f6bff gradient with white text.
  - GENJUTSU uses a white → cyan → pink gradient.
- An earlier light version (Archivo, pastel backgrounds) was replaced.


## Timeline
| Time | Scene | Footage (all real Genjutsu input→output) |
|---|---|---|
| 0–2s | GENJUTSU title, glitch | — |
| 2–5s | Scale your viral trends | Orange-studio clip → @techman and @masood swaps |
| 5–8.3s | INPUT / OUTPUT diagonal split | Animated Zaatar → real Zaatar (recast) |
| 8.3–9.6s | KEEP camera movement | ATV caveman → @techman (recast, tracking camera) |
| 9.6–10.9s | KEEP lipsync | Orange-studio clip → @techman |
| 10.9–12.2s | KEEP motion | Orange-studio clip → @masood |
| 12.2–16.9s | One-click object swap | Coffee cup → cat mug (swap), light-sweep reveal |
| 16.9–20s | End card | Logo, "Swap anyone. Keep everything.", "Try it on adflex.ai" |

The inputs reuse footage from other videos in this project: Zaatar ([zaatar-cat-reel.md](../../ad/zaatar-cat-reel/brief.md)) and the ATV caveman ([mammoth-wash-reel.md](../../social/mammoth-wash-reel/brief.md)).


## Notes
- The orange-studio source is a third-party performance clip. Its watermark is cropped out. **Replace it before any official ad use.**
- The video was built as an HTML/GSAP page (`?theme=neon`) and rendered frame by frame with ffmpeg, so scenes can be re-rendered one at a time. The page itself was session-local and is gone.
