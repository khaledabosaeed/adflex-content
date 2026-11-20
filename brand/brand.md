# AdFlex brand

## Logo
- «Ad» #3292FF blue, «Flex» #9848FE purple.
- Big sparkle gradient #C95AC5 → #55AAFF. Small sparkle #F83AAE → #D453C2.
- **Best local file: [adflex-logo-1820.png](adflex-logo-1820.png)** (1820×524, transparent, for dark or light backgrounds). Made from the FE's `public/images/authLogo.webp` (456×238, the wordmark + "Adaptive Flexibility"): wordmark cropped, 4× Lanczos, alpha re-thresholded for crisp edges. Use it at up to ~700 px wide.
- Not the brand logo: the FE's `public/landing-logo.png` (purple "Ad", white "Flex") and `landing-logo-light-mode.png` (purple "Ad", black "Flex"). Don't use them in videos.
- **TODO:** get a real SVG or high-res logo from AdFlex before running paid ads.

## Marks (small icons for chips and end cards)
In [marks/](marks/). Use them at small, equal size next to each other; AdFlex stays the hero.
| File | What | Source |
|---|---|---|
| `alfa-mark.png` | ALFA (512×512) | the AdFlex site favicon, FE `public/android-chrome-512x512.png` |
| `claude-mark.svg` | Claude | FE `public/icons/ai-clients/claude.svg` |
| *(missing)* | MCP | the FE has no MCP mark; keep MCP as a text chip until we get the official file |

Copy a mark into a Remotion project's `public/` (the `templates/remotion-video` setup step does this).

## Colours
| Use | Value |
|---|---|
| Generate-button purple (titles, glows, pills) | #8337F1 → #6730D4 |
| ALFA accent / caption box | #8738F5 |
| ALFA background | lavender gradient #D9C1FB → #F5F5FA |
| ALFA card border | rgba(156,71,255,.45), 16 px radius |
| Light end-card background | #F7F5FC with soft #D9C1FB glows |
| Dark text | #1C1824 / #333 |

## Fonts
Font files (all SIL OFL) are in [fonts/](fonts/): `Archivo-var.ttf` (variable, wght 100–900 × wdth 62–125, from google/fonts `ofl/archivo`), `ArchivoBlack-Regular.ttf`, `Cairo-var.ttf` (wght 200–1000), `Unbounded-900.ttf` and `Outfit-500/600/700/800.ttf` (the ALFA brand type).
- **Latin labels and titles in motion graphics:** Archivo variable. Condensed labels at wdth 68–72 (light 300 over bold 860); wide titles at wght 900 / wdth 125.
- **ALFA wordmark and ALFA captions:** Unbounded Black for the ALFA wordmark (logo gradient + gloss), Outfit 600–800 for captions, chips and UI text. Recipe: `motion-styles/alfa-brand-type.md`.
- **Arabic:** Cairo (ExtraBold for captions, Black for titles) from npm `@fontsource/cairo`, or IBM Plex Sans Arabic for ALFA UI. The Arabic subsets have no ASCII digits, so set numbers in the Latin font.
- **Latin display:** Archivo Black, Unbounded Black, Anton, Playfair (used on the الحجة signature).

## Captions
White Cairo ExtraBold on a rounded purple (#8738F5) or dark box at the bottom, phrase-timed to the measured speech. Wrap mixed Arabic/Latin lines in RTL embedding.

## End card rules
- The AdFlex logo is the hero.
- AdFlex works inside **the AI you already use**: show Claude and ChatGPT chips plus an MCP / «+» badge, all small and equal weight.
- Don't use «أي موديل» or «أي ذكاء اصطناعي».
- Approved lines so far:
  - «اربطه بالـ AI اللي بتستخدمه»
  - «شغّال جوّا المساعد اللي بتستعمله»
  - «حملتك كاملة، بليلة وحدة»
  - «ابدأ حملتك الحين»
- End with adflex.ai.

## Tone
Confident, fast, a bit cheeky. The speaker is a creator showing a friend something cool, not a corporate narrator. Use dialect (Levantine or Gulf) depending on the video, never MSA.

## Third-party marks
The OpenAI knot and the "GPT Image" name appear in several cuts. Check OpenAI's brand guidelines before paid ads, and confirm the ChatGPT integration is live before claiming it.
