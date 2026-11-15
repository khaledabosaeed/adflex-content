# Motion styles

A library of motion styles copied from references: how the camera moves, how shots cut and transition, how text and graphics animate, and how the footage is graded. Each style is one file, so a new video can pick from it instead of starting from scratch.

## What a motion style is
**Copy freely:** camera moves, shot lengths and cut rhythm, transitions, text and graphics animation, grade and texture, sound-design cues (whooshes, hits, risers).

**Never copy:** the reference's story or characters, its footage, its licensed music, or its logos and brand assets. Those rules still come from `CLAUDE.md`.

## Types
Every style has one `type`:

| Type | Covers | Example |
|---|---|---|
| `camera` | How the camera moves and frames | handheld selfie, drone push-in, locked-off wide |
| `transition` | How one shot becomes the next | white bloom → colour flood, whip pan, match cut |
| `edit` | Cut rhythm and pacing | 1.2 s hard cuts on the beat, multi-shot gag montage |
| `graphics` | Text, UI and card animation | typed prompt, numbered step cards, popping ad cards, PiP screens |
| `look` | Grade and texture | faded 1990s 35 mm film with grain, neon gradient |

Each style also lists the video types it `fits`: `ad`, `social`, `hero`.

## Adding a style
1. Copy `templates/motion-style.md` to `motion-styles/<slug>.md`.
2. Fill in the breakdown from the reference (timings, moves, colours), the paste-ready prompt wording and the edit recipe.
3. Add a row to the index below, under its type.
4. When a video uses it, add the slug to that video's `motion_styles` field in `brief.md` and to the style's `used_in`.

## Index
| Style | Type | Fits | Source | Used in |
|---|---|---|---|---|
