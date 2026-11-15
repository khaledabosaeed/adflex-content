# الحجة and the cheetah: production notes

## Adnan's direction
- v3: no Arabic anywhere in the video.
- v4: no English text at the start either. The cheetah attacks the old men as the hook.
- The only on-screen text is "NOOR" on the shop and the end signature.


## Cut v4 (current): hajja-rich-reel.mp4
- 12.9 s, 1080×1920, 30 fps, -14.4 LUFS, peak -1.6 dBFS.
- Cuts land every 2 beats on the music's real beat grid (about 99 BPM, beat ≈ 0.605 s, measured with librosa).
- The video ends just after the track's final stab (12.05 s).

| Time | Shot |
|---|---|
| 0–1.86 | Cold open, no text. The cheetah rears up and lunges at the three old men on the bench (springing by 0.2 s). They leap up, the dallah flies and coffee spills. الحجة just stands holding the leash, bored. Snarl and cup-clatter SFX at 0.05 s. (c1b from 0.6 s) |
| 1.86–3.07 | She pulls a stack of notes from an ATM built into an old wooden-door wall (ATM SFX) |
| 3.07–4.25 | Sneaker shop: she hands white-and-violet sneakers to kids |
| 4.25–5.46 | Eidiya: notes from a quilted violet handbag to a line of boys in thobes |
| 5.46–6.66 | Baby camel (sunglasses and violet bow) beside a black luxury sedan, الحجة in the back seat |
| 6.66–7.85 | She flies a drone in a date-palm farm while the camel walks along |
| 7.85–9.06 | An old white pickup through the glass front of perfume boutique "NOOR" (glass SFX on the 7.85 beat) |
| 9.06–12.9 | Poster shot (clip slowed to 0.77×): arms crossed between the sedan and the pickup, with the cheetah and the camel. "MADE WITH / AdFlex" (Playfair) lands on the 9.66 beat |

Grade: warm curves, lifted blacks, saturation 0.88, vignette, grain.

Earlier cuts, now replaced:
- v3 had an English two-stage hook, "NOBODY ASKS GRANDMA / where the money comes from.", over a punch-in on the calm cheetah walk.
- v2 had an Arabic hook: «محد يسأل الحجة / من وين لها؟».
- v1 was 13.7 s on an off-beat 0.453 s grid, and its last 0.7 s was silent.


## Cost
- v1: 3,277 credits (stills 600, clips 2,640, music 25, SFX 12).
- v4 lunge: 396 credits (still 60, clip 330, snarl 6).
- **Total: 3,673 credits.** The v2 and v3 re-cuts cost 0.


## Lessons
- Wan 3.0 Prime costs 110 credits/s at 720p (5 s = 550, 3 s = 330). 3 s is enough for cuts of about 1.2 s. A render took about 5 minutes.
- In the lunge clip a fourth old man appears for a few frames after the men stand up. It's hard to see at speed.
- Use librosa `beat_track` for beat sync. A raw spectral-flux autocorrelation picked a 3/4-beat subdivision.
- Using the Dubai-pier photo as a second reference pulls the modern skyline into the scene. Use the sheet plus an old-fareej still instead.
- nano-banana-2 invents gibberish Arabic on signs, so say "no writing anywhere except …".
- Watch for real badges. The pickup came out as a Toyota (fixed). The sedan reads as a Mercedes S-Class shape with no visible badge. A few background shoes in s3 may carry tiny marks, and the banknotes look like USD.
