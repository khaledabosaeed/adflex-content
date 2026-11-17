---
name: "Deliverables parade"
slug: "deliverables-parade"
type: "edit"              # also covers graphics
fits: [hero, ad, social]
source: "Higgsfield MCP × Claude 'Burger Queen' launch (32 s), 8–28 s: https://video.twimg.com/amplify_video/2049477398757093376/vid/avc1/1280x720/ykIOQVez0ksKD2Wf.mp4?tag=14 · page https://whatships.com/videos/higgsfield-mcp-claude-connector/"
used_in: []
---

# Deliverables parade

## What it looks like
One prompt ("Make a full marketing campaign for this burger"), a short "Designing… / Helping…" status, and then the whole campaign arrives one deliverable at a time: brand book, TV spot, motion shots, UGC creators, menu, mockups, photoshoot, landing page. Each one fills the frame for 1–3 s with a small labelled pill under it that names what it is. The pace says "all of this, from one sentence".

## Breakdown
- **Structure:**
  1. 0–3 s: a hook from the product itself (the burger in macro footage). A selection box lifts the product image out.
  2. 3–6 s: the image drops into the chat. The prompt types in.
  3. 6–8 s: a status line in italic serif ("Designing…", "Helping…") with the assistant's mark spinning.
  4. 8–28 s: the parade. Eight deliverables, about 2.5 s each.
  5. 28–32 s: "Available now at Higgsfield.ai/mcp".
- **Text and graphics:**
  - The pill under each deliverable: small, rounded, in the accent colour, with an icon + the name ("Brandbook", "TV Spot", "UGC", "Menu", "Mockups", "Photoshoot", "Web Landing").
  - The original product photo stays as a small thumbnail in the top-left corner of the video deliverables, so you always see the input.
- **Cuts and timing:** a hard cut or a short slide between deliverables. Groups (UGC, mockups) come in as a row or grid that scrolls sideways.
- **Grade and texture:** the frame around the deliverables is the assistant's theme (here Claude's beige). The deliverables keep their own look.
- **Sound cues:** music with a beat; a cut on every beat.

## How to make it
- **Model:** the deliverables are the real outputs of one AdFlex or ALFA run. Most of the credits go here; quote them first.
- **Edit recipe (Remotion):** one `Sequence` per deliverable, each with a `Pill` (icon + label) at the bottom centre. The input thumbnail is a small `Img` at the top left with a soft shadow. Cut on the music's beats (`librosa.beat_track`, see `lessons/editing.md`).

## Watch out for
- Each deliverable must be a different asset (`lessons/editing.md`: in a grid, a still and the video made from it count as the same asset).
- Eight is the most. Six reads better at 16–20 s for a hero.
- AdFlex version: the pill in the Generate purple. The chat is the real ALFA or Claude chat with AdFlex, and the end line says AdFlex works with the AI you already use.

## Examples
- Reference only so far. Our closest: alfa-agent-reel's numbered step cards.
