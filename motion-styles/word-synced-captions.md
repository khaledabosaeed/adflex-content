---
name: "Word-synced Arabic pop captions"
slug: "word-synced-captions"
type: "graphics"
fits: [social, ad]
source: "Claude analysis/creative/report talking-head reel (Nov 2026)"
used_in: [claude-talking-head-reel]
---

# Word-synced Arabic pop captions

## What it looks like
Big white Arabic captions, three words at a time, pop in exactly when the first word is spoken. Key words (numbers, money, brand names) are yellow. Section titles ("أول شي: التحليل") are larger and all yellow. Captions step aside while an icon is on screen.

## Breakdown
- **Text and graphics:**
  - IBM Plex Sans Arabic Bold 100 px, white, 7 px black outline, soft shadow, bottom-centred with `MarginV 560` (above Instagram's caption area). Titles are 124 px in yellow `#FFD700`.
  - Up to 3 words per caption. Keep "الـ X" together, and fold a single leftover word into the previous group.
  - Highlight words are coloured `#FFD700` inline.
  - Pop: scale 85 % → 100 % in 90 ms (`{\fscx85\fscy85\t(0,90,\fscx100\fscy100)}`).
  - A caption holds until the next one when the gap is under 0.35 s, and stays on screen for at least 0.55 s.
- **Cuts and timing:** every caption starts on its first word's real speech onset and ends on its last word's end. Graphics use the same word clock (onset − 60 ms).

## How to make it
- **Model:** none. Transcription is local (faster-whisper on the GPU) or AdFlex `inspect_audio` if Whisper isn't installed.
- **Edit recipe:** [`tools/talking-head-reel/`](../tools/talking-head-reel/README.md):
  1. `scripts/whisper_words.py <16k mono wav> <words.json>` gets faster-whisper large-v3 word timestamps on CUDA (~18 s for 60 s of audio).
  2. `scripts/align.py`:
     - Snaps each word's start and end to `silencedetect=n=-35dB:d=0.1`.
     - Aligns the *edited* caption text to Whisper's words with a Needleman–Wunsch on fuzzy token similarity. Brand names are mapped (Claude↔كلود, MCP↔MCB, TikTok↔تيك, …) and clitics stripped (و، ال، لل).
     - Writes `captions.ass` and `cues.json`.
  3. Burn in with ffmpeg `ass=captions.ass:shaping=complex`.

## Watch out for
- **Whisper glues the pause before a word onto that word,** so after any pause its start is early, by up to 1 s ("عشر نسخ" was a full second early). Always snap starts to the silence ends.
- The caption text is the edited text, not Whisper's. Whisper is only the clock. Keep dialect edits and English brand names (Claude, Snapchat) in the captions.
- Arabic in ASS: use the `ass` filter with `shaping=complex`, wrap each line in RTL embedding (`‫ … ‬`) and set `Encoding -1`. Cairo's variable font drops glyphs, so use IBM Plex Sans Arabic.
- Strip U+FE0F from emoji strings, or a bracket glyph appears next to ✏️-style emoji.

## Examples
- Claude talking-head reel v12 (see [3d-icon-pops](3d-icon-pops.md)).
