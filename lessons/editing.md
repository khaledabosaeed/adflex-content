# Editing lessons

## Arabic text
- This ffmpeg's libass shapes Arabic badly. Render text to PNG with Pillow + raqm, or use ASS with `shaping=complex` and separate RTL lines.
- Cairo comes from npm `@fontsource/cairo`. The Arabic subset has no ASCII digits or punctuation, so set times like 8:00 in the Latin font.
- Wrap mixed Arabic/Latin captions in RTL embedding.
- Time captions to the measured speech in each clip (speech bursts at -22 dB from peak), not to the whole shot. Split two-part lines into phrases.

## Timing
- Use `librosa.beat_track` for beat sync. Raw spectral-flux autocorrelation picked a 3/4-beat subdivision.
- Trim dead air at both ends of every talking clip, and let a last line's audio tail run into the next shot.
- A 0.22 s dissolve with an audio crossfade works well at narrated joins. Hero videos use hard cuts.

## Audio
- Target about -14 LUFS for social and -16 LUFS for voice-led reels, with a limiter at 48 kHz.
- Duck music under the voice with sidechaincompress (threshold 0.025, ratio 5, attack 25 ms, release 350 ms).
- To offset a voice track, **prepend silence** (anullsrc concat). `adelay` silently failed on a pre-rendered track.
- Pre-render voice trims into separate WAVs. One big inline filter graph deadlocked ffmpeg.
- If one word is mispronounced, splice a good take of that word in from another clip.

## Layout
- Screen demo over a talking head: a floating rounded box (720×440 layer at y=770, white border, shadow), with captions at y=762. Shrink close-ups to 0.76 on a blurred fill.
- In a mosaic or grid, every cell must be a different asset. A still and the video made from it count as the same asset.
- Protect the product with a box mask when luminance-keying.

## Performance
Render heavy composites one at a time. Two in parallel ran out of memory.
