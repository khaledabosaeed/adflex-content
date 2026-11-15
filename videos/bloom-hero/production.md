# Bloom · بلوم coffee cart hero: production notes

## Prompt beat (from v2): a logical sequence
1. A laptop close-up (VL plate) with a push-in.
2. The real AdFlex page appears **on the laptop screen**. Her fingers stay masked on top of the screen.
3. The form card lifts out of the screen and fades from it as it lifts.
4. The prompt types character by character with a caret: left to right in English, right to left in Arabic.
5. A cursor clicks Generate.
6. The GPT knot pops from the button and flies out of frame.

The card only appears in the laptop shots. Continuity patches on the laptop background: the awning turns green from prompt 2, and the poster turns green in prompt 5.


## Adnan's later feedback and what changed
- **Show the object plain first, then the edit** (v3). Every object shot opens on a clean "before" for about 0.38 s, and nothing changes until the knot lands.
- **Brand purple instead of lilac.** The AdFlex Generate-button purple, #8337F1 → #6730D4, is used for titles (line 2), the 2.6 numeral, the pill, glows, the end card and the transformation colours.
- **Faster.** Laptop beats run 1.05–1.6 s and object beats 1.45–1.95 s.
- **Phone white layer.** The blank screen mask now comes from the real bezel shape (scipy fill of the dark ring), not a rectangle.
- **v4: transitions and transformation copied from the reference, soft and not cheap.**
  - Hard cuts between shots. No zoom-blur whips, white flashes, camera shake or burst rings.
  - Continuity comes from the knot itself:
    - It pops from the button and exits toward the top right.
    - In the next shot it enters from the left and glides to the object.
    - It collapses into a bright point, then re-forms after the reveal and flies off. On the phone it doesn't re-form.
    - A small soft motion trail follows it.
  - The transformation is a flood clipped to a solid object mask:
    1. About 0.17 s of white-hot bloom spreading from the hit point.
    2. Neon brand purple with a wide soft halo, from 0.07 to 0.30 s.
    3. A matte purple tint that fades out by about 0.55 s.
    4. The true colours, with a slow push-in.
  - Titles type on character by character in Archivo Black. The first line is white and the second #8B3EF7.


## Timeline (hero, seconds)
| t | Shot | Prompt / title |
|---|---|---|
| 0–1.85 | V0 tram | GPT IMAGE 2.6 title |
| 1.85–3.4 | Laptop p1 | "Logo and awning for my coffee cart: Bloom" |
| 3.4–4.9 | V2 awning/panel | |
| 4.9–6.0 | Laptop p2 | "Matching cups and sleeves" |
| 6.0–7.5 | V3 cups | |
| 7.5–8.8 | Laptop p3 (Arabic form) | "ومنيو على اللوح، عربي وإنجليزي" |
| 8.8–10.75 | V4 chalkboard | PERFECT TEXT. / ANY LANGUAGE. / حتى بالعربي |
| 10.75–12.0 | Laptop p4 | "Poster for the bus stop: $2 iced latte" |
| 12.0–13.4 | V5 poster | |
| 13.4–14.5 | Laptop p5 | "Now a social post" |
| 14.5–16.9 | Phone | ADS FROM / ONE PROMPT. |

The social cut adds a 2 s end card and uses music v2 (atempo 1.08, -14 LUFS).


## Deliverables (files that existed in the session)
adflex-bloom-hero-1920x1080.mp4 (6.1 MB) · .webm (5.0 MB) · -poster.jpg · adflex-bloom-social-420x280.mp4 (2.3 MB)


## Notes
- The OpenAI logo and the "GPT Image 2.6" name are OpenAI trademarks. Check OpenAI's brand guidelines before running paid ads that pair them with AdFlex.
- After Bloom, Adnan uploaded `genjutsu.webm` (1920×1080, 10 s) and asked about reframing videos to other aspect ratios. That led to [adflex-genjutsu-promo.md](../genjutsu-promo/brief.md).
