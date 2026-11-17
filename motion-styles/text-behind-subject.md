---
name: "Text behind the subject"
slug: "text-behind-subject"
type: "graphics"
fits: [hero, ad, social]
source: "Katana — aura farming is open to everyone (72 s), 21.12–21.21 s (also 38.12–38.16 s): https://video.twimg.com/amplify_video/2109728424172699648/vid/avc1/1920x1080/F99Pr5kRGW6c5d1y.mp4 · page https://whatships.com/videos/higgsfield-katana/. Higgsfield — Gemini Omni 1.1 Flash is live (77 s), 11.5–12.0 s: https://video.twimg.com/amplify_video/2093448096311382016/vid/avc1/1920x1080/tm6lzTYZJQoIdEzn.mp4 · page https://whatships.com/videos/higgsfield-omni-1-1-flash/. Claude + Higgsfield MCP — 18-minute breakdown of… (1134 s), 99.17 s: https://video.twimg.com/amplify_video/2056404580619919361/vid/avc1/1920x1080/wT7FGshDUzNLLoiU.mp4 · page https://whatships.com/videos/claude-higgsfield-mcp/"
used_in: []
---

# Text behind the subject

## What it looks like
One huge word sits in the scene *behind* the person. "GOAT" slams in behind a celebrating football player. "NOTHING" sits behind a man whose pointing hand crosses in front of the letters. "START & END FRAME" smears in behind a model. "LIMITLESS" grows behind a presenter, and his head and hands cover the middle letters. The word looks like part of the set, as if the subject were standing in front of their own billboard.

## Breakdown
- **Text and graphics:**
  - Huge, frame-wide caps: bold grotesque with some letters outlined (Katana), italic gradient sans (Omni), lime condensed caps (the MCP film).
  - The subject's head, hands or body overlap the middle letters. The ends stay readable.
- **Entrances:**
  - "GOAT" (21.12–21.21 s): the letters zoom in with heavy motion blur and lock in about 0.1 s.
  - "NOTHING" (38.16 s): after a one-frame vertical slit-scan reveal at 38.12 s.
  - "START & END" streaks in from the right and "FRAME" from the left with long horizontal smears, settled by about 12.0 s.
  - "LIMITLESS" (99.17 s): fades and scales up behind the presenter.
- **Where it sits:** the hero beat. "GOAT" is Katana's biggest moment (29 %) and "NOTHING" its second peak (53 %).

## How to make it
- **Matte (the hard part):** three layers: the plate, the word, and the subject cut out on top.
  - Locked shot, subject barely moving (presenter at a desk, product on a table): `extract_video_frame`, then `remove_background` on that frame, gives one PNG cut-out to lay on top. One model call; quote the credits first.
  - Moving subject: a per-frame matte from a video segmentation or matting model, exported as an alpha video. Run it locally (no credits, only GPU time) or through a paid model (quote it per second before running). Check the edges on hair and fast hands.
- **Edit recipe (Remotion):**
  - Plate: `Clip`. Word: a div in `cond(900, 125)` or Archivo Black (`DISP`). Matte: a second `OffthreadVideo` with `transparent` (alpha webm), or an `Img` for the still cut-out, at the plate's exact position and size.
  - "GOAT" entrance: scale 1.6 → 1 with `ip(..., OUT)` over 0.1 s, plus `MBlur`. Smear entrance: `whipIn` per word from opposite sides, through `MBlur`. Soft entrance: opacity and scale 0.95 → 1 on the house spring.
  - Exit: 0.2 s ease-in (`IN`).

## Watch out for
- A visible matte edge kills the effect. If the edge is bad, put the word in front instead, or pick a shot with a clean silhouette.
- Hide at most the middle 1–2 letters, or the word stops reading.
- AdFlex version: the word in Archivo (wide 900 or Black), white or in the Generate purple (#8337F1 → #6730D4), with a soft sparkle-gradient glow (#C95AC5 → #55AAFF) behind it. Cairo Black for Arabic. The subject is our real product or presenter, never anyone from the reference.

## Examples
- Reference only so far. Related: [chrome-title-in-scene](chrome-title-in-scene.md) (a 3D title inside the scene), [accent-word-headline](accent-word-headline.md) (the wrapped-gradient variant), [talking-head-punch](talking-head-punch.md).
