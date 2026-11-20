---
name: "ALFA brand type: drop-in wordmark, gradient-box captions, campaign timer"
slug: "alfa-brand-type"
type: "graphics"
fits: [hero, ad, social]
source: "Our ORRA watch ALFA hero (v16/v17, 23 s, Python + Pillow). Source code: tools/alfa-motion-source/"
used_in: []
---

# ALFA brand type: drop-in wordmark, gradient-box captions, campaign timer

## What it looks like
A deep violet background with a soft blue and violet aurora. ALFA, in Unbounded Black with the AdFlex logo gradient, a glossy top half and a glow, drops in from the camera one letter at a time with a glitch tick on each landing. Then "by AdFlex" locks up under it. Every line of copy is a white Outfit word next to a blue-to-violet rounded box that wipes open, with the key word rising inside it ("Any **Size.**"). A small timer pill in the corner counts the campaign time, ticks off each output with a white toast, and at the end flies to the centre and stops: "Full **campaign.** / Under **1 hour.**"

## Breakdown
All times are in seconds. Positions are for a 1920×1080 frame.

### Colours and type
| Part | Value |
|---|---|
| Background | base `#0B0520`. Additive glows: blue `#3292FF` top-left (r 0.55 H, 42 %), violet `#9848FE` bottom-right (r 0.65 H, 48 %), pink `#FF69C8` top-right (10 %), `#5A32BE` spotlight behind the title (30 %). A faint diagonal light streak, a vignette to about 45 % at the corners, and grain. Everything drifts slowly (`sin 0.9t`, `cos 0.7t`). |
| ALFA wordmark | Unbounded 900, 0.02 em tracking. Fill `#8EC5FF → #3C96FF → #A058FF → #BE82FF` left to right, with white gloss on the top half (47 % at the top, 19 % at the middle, then none). Two glows `#3C96FF → #9848FE`: blur 0.16 em at 85 % and blur 0.05 em at 60 %. On the title the gradient flows at 0.30 word widths per second. |
| Captions | Outfit 700 (the tagline is 600). Box `#3292FF → #9848FE → #6730D4`, radius 0.2 × size, padding 0.10 × 0.24 size, a 13 % white highlight on its top half, and a violet glow. Gap 0.26 × size. |
| Sizes | Scene labels and titles 104 px. "Under 1 hour." 96. "Full campaign." 76. Tagline under ALFA 56. |
| Scene labels | Bottom-left, left edge at x 90, centre y = H − 135 (on top of footage). Section titles are centred near the top. |
| Chip | `#0D0624` at 88 %, a lavender `#D9C1FB` border at 45 %, 68 px tall. Clock icon (blue ring, violet hand that turns). Fixed-width digits `hh:mm:ss` in Outfit 600 at 38 px, a divider, `n/5` in lavender at 24 px, and a 4 px progress bar in the logo gradient along the bottom. |

### Title card (1.4 s)
| Time | What happens |
|---|---|
| 0–0.12 | Background fades up from black. |
| 0.08 + i × 0.055 | Letter i drops in over 0.24 s (ease-out cubic): scale 3.6 → 1, blur 20 → 0 px, rotation (−16 + 9i)° → 0, falling 40 px. On landing (+0.2): a squash, a glitch tick (RGB split + slices), and a camera shake of 14 × 9 px. |
| 0.36–0.52 | "by" rises out of a mask. |
| 0.40–0.62 | The AdFlex logo wipes in left to right with a glowing edge. |
| 0.455 | After the last landing, a violet ring (stroke 36 → 4 px) bursts out to 1250 px over 0.35 s, with a soft blue flash behind it. |
| 0.45–1.15 | The word pushes in to 1.06×. |
| 0.6–0.85 | A white light band sweeps across the letters. |
| 0.6–0.92 | The logo's pink sparkle flashes and turns 90°. |
| 1.0–1.22 | The lockup drops 30 px and fades. |
| 1.05 + i × 0.035 | Letter i flies past the camera over 0.2 s (ease-in): scale × 4, spreading 1.6×, blur 14 px. |
| 1.24–1.4 | Glitch out, then fade to black. The next shot starts with 3–4 glitchy frames (strength 0.6, fading over 0.12 s). |

### ALFA beat (about 2 s, over the dimmed scene)
- The scene behind blurs 12 px (at 75 %) and darkens 38 %, with a dark elliptical halo behind the word so it reads over busy footage.
- ALFA rises letter by letter: each letter slides up 24 % of the size and fades in, 0.14 of the move apart (0.65 s in total), and the word settles from 1.04×.
- At +0.6 s the tagline caption arrives under it: **"No MCP. No setup. [Just ALFA.]"**
- The timer chip is born under the tagline ("Campaign started" above it, at 1.3×), then lifts to the corner over 0.55 s.
- ALFA fades out over 0.2 s.

### Caption entrance (`BoxCaption`)
| Time | What happens |
|---|---|
| +0 → +0.32 | The white word rises 45 % of its line out of a mask (ease-out cubic), and its opacity reaches full at 60 % of the move. |
| +0.10 → +0.42 | The box wipes open from the left. |
| +0.24 → +0.52 | The boxed word rises inside the box. |
| +0.5 → +0.72 | One pulse up to 1.035×. |
| Exit | The caption fades and lifts 18 px over the last 0.2 s before the cut, so no half words are left inside a transition. |

### Campaign timer
- The timer counts `3492 × p^1.1` seconds (to 00:58:12).
- On each finished output: the step fills over 0.35 s, the chip pulses, and a white toast with a gradient check shows the output name under the chip for about 1 s.
- **Finale:** the scene darkens 72 % and blurs. The chip flies to the centre at 3.1× over 0.55 s. It stops 0.8 s in: the digits turn bold and take the logo gradient, a glow comes up behind the chip, and it punches. "Full **campaign.**" sits above it and "Under **1 hour.**" lands under it on the stop.

### Transitions between shots (0.5 s each)
- **Hero-object match cut:** the product (the watch) stays locked on screen. Its position and size glide from shot A to shot B (log-scale size) while A dissolves into B (between 22 % and 78 % of the move). A soft diagonal light band crosses the frame. Same idea as [motion-match-cut](../transitions/motion-match-cut.md) and [object-carry](../transitions/object-carry.md).
- **UGC → "Any Size":** the full-frame clip shrinks into the 16:9 card, and the 9:16 and 1:1 cards slide in from the sides.
- **End card:** a crossfade from the timer, then ALFA rises (0.45 s), "by AdFlex" fades up 24 px, and the whole frame fades to black over the last 0.3 s.

### Sound cues (from `mix17.py`)
- **Title:** a reversed whoosh sucks in before the first letter. Each letter landing gets a pitched slam (−7 dB, slightly higher per letter) with a short glitch burst (−16 dB). The ring gets a sub boom and a logo hit. The wipe gets a soft whoosh and the sparkle a shimmer. The fly-out gets a whoosh and the exit a glitch burst. Three beats of music under the title, cut on the glitch.
- **Body:** a riser and a sub into the ALFA reveal, a pop on each toast, a timer-stop hit on the stop, and a logo hit on the end card. The music dips under the big hits.
- **Master:** −14 LUFS, true peak −1 dB.

## Copy (the ORRA lines, reusable)
| Where | Line (white / **boxed**) |
|---|---|
| Tagline under ALFA | No MCP. No setup. / **Just ALFA.** (an earlier cut used: Your AI / **marketing agent**) |
| Chat (one message) | User: "Launch our ORRA watch this week." + the product photo. ALFA: "On it. Here's the plan:" then Product video · Billboard ads · UGC videos · All sizes · Schedule |
| Chip at its birth | Campaign started |
| Scene labels | Product / **Video** · Billboard / **Ads** · UGC / **Videos** · Any / **Size.** · Auto / **Scheduled.** |
| Toasts | Product video · Billboard ads · UGC videos · All sizes · Scheduled |
| Finale | Full / **campaign.** · Under / **1 hour.** |
| End card | ALFA, then "by [AdFlex logo]" |
| Chores pile (before ALFA) | MCP setup: Configuring… · API keys: Expired · Prompts: Rewrite #7 · 10 tools: Switching… · Connectors: Failed (amber and red status dots), blown away when ALFA arrives |

Swap ORRA for the video's own invented brand. Keep the end-card rules in `brand/brand.md`. AdFlex comes first; Claude, ChatGPT and MCP appear only as small equal chips.

## How to make it
- **Model:** none. It is all graphics; no paid generation.
- **Edit recipe (Remotion):** `templates/remotion-video/src/alfaType.tsx` (every new build from `setup.sh` gets it, with the fonts):
  - `BrandBg`: the background.
  - `AlfaTitle at={0}`: the whole 1.4 s title card.
  - `AlfaWord at size cx cy out`: the letter rise.
  - `AlfaLetters`: the raw wordmark with per-letter poses.
  - `BoxCaption w1 w2 at out size x y anchor`: the captions.
  - `TimerChip secs done stopped t x y scale`, `Toast label x y` and `timerSecs(t, start, stop)`: the timer.
  - `ByLockup`: "by AdFlex".
  - `Glitch g seed`: RGB split and slices.
  - `Sparkle`: the logo's star.
- **Preview:** `npx remotion studio`, then the `AlfaTypeDemo` composition (8 s: title → ALFA beat → "Any Size." with toasts → timer finale → end card).
- **Fonts:** `brand/fonts/Unbounded-900.ttf` and `Outfit-500…800.ttf` (SIL OFL).
- **Original Python:** `tools/alfa-motion-source/` (`hero17.py` title, `hero13.py` captions and scenes, `hero14.py` chip and match cuts, `hero15.py` pile, `hero16.py` chat, `title_style.py` wordmark and background, `mix17*.py` sound). It is reference only: the paths point to the old machine, and the clips are not included.

## Watch out for
- **The source breaks some house motion rules on purpose:**
  - Letter stagger is 55 ms in the title and about 84 ms in the rise (the rule is ≤ 50 ms).
  - The source squash and chip pulse were 9 %.
  - The port caps the squash and punch at 5 % (`≤ 1.05×`). Keep the staggers: the letters dropping one by one is the look.
- **The title is the bold move of the video.** The team rejects shake, burst rings and flashes when they're everywhere (see `transitions/README.md`). Use the title once, then keep the body calm.
- **`Glitch` is costly:** it redraws its children up to 3 × (1 + 12) times. Wrap only graphics, and only for a few frames, never a video layer.
- **Background blobs use `mix-blend-mode: plus-lighter`.** They need a dark opaque layer under them.
- **No Arabic on screen in this style.** Outfit has no Arabic. For Arabic captions use Cairo (`brand/brand.md`).

## Examples
- The ORRA ALFA hero (v16 with SFX, 23 s), kept outside the repo: `~/Downloads/alfa-hero-v16-1920x1080-sfx (1).mp4` (not uploaded yet).
