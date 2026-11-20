# Model lessons (AdFlex)

## Images
- **nano-banana-2** (about 60–70 cr): best for character consistency (`task_type: character_consistency`, a sheet as reference).
  - It invents gibberish Arabic on signs, so say "no writing anywhere except …".
  - It sometimes adds real brand badges (a Toyota pickup). Check and paint them out.
  - A second reference image can leak its background (the Dubai skyline came in from a pier photo).
- **gpt-image-2-6-sunburst** (70 cr): best for edits that keep the photo and change one thing, such as filling a blank billboard or rebranding a cup (`task_type: edit_existing`, first frame + brand mark). It handles Arabic text well.

## Video
- **Gemini Omni Flash 1.2:** the go-to model.
  - Talking heads with native audio: write lines with tashkeel and romanization hints, and give a 4 s line 5 s.
  - Watch for burned-in subtitles and remove them with `delogo`.
  - Text-to-video with a product sheet as reference keeps labels readable.
  - It handles multi-shot prompts ("exactly four hard-cut shots, ~2 s each").
  - Image-to-video from a nano-banana still keeps the face, outfit and room well. "Locked-off camera" is not always obeyed (it eased back), and "brings the phone right at the lens until it fills the frame" stops short at about a third of the frame in 3 s: finish such a move with a digital push in the edit (workflow-hero v11, shot 9).
  - A start/end frame can't be combined with `reference_images` (the quote is refused). To bring a new character into an existing still, make the **last frame** first (nano-banana-2 `combine_multiple`: the still as `composition` + the sheet as `character`, 60 cr; it kept the framing and laptop exactly) and animate first → last frame (alfa-hero C1).
  - Costs about 504 cr for 8 s at 720p, 315 cr for 5 s at 720p, and 364–455 cr per 1080p plate.
- **Wan 3.0 Prime:** 110 cr/s at 720p, image-to-video, no audio. 3 s is enough for cuts of about 1.2 s.
- **Kling Video O3 Standard** (75 cr/s): works with `image_to_video` + one `source_url` + `multi_prompt_segments`. It **fails immediately (and refunds) when character `elements` are passed**.
- **Seedance 2.5:** used for the UGC girl video (14 s, 480p draft, 1,260 cr).
- Check hands and props frame by frame. Trimming past a warp is free; regenerating isn't.
- **Video upscale (`task_type: video_upscale`, bytedance_video_enhancement_standard):** 30 cr for a 5 s clip, about 2 min. A 720×1280 24 fps story came back 1080×1920 at 30 fps with **interpolated** frames (147 of 149 unique), so it also cures the judder of a 24→30 fps copy with doubled frames. Colour and motion unchanged. It returns an AAC track; strip it (`-map 0:v -c:v copy -an`). (workflow-hero v18)

## Audio
- **ElevenLabs Music v2.5:** 25–80 cr per track. Ask for an instant start, a clean final stab at a given second, and the BPM. Then check where it really goes silent.
  - On 2026-11-18 (alfa-hero v18) two 18 s prompt-mode tracks in a row ran ~5 min and ended `generation_failed` with no file and the refund "unverified". Healthy tracks come back in about a minute: after ~2 min of `running`, expect a failure, and ask before a paid retry (the first one's credits may not have come back). A third try on `elevenlabs-music-v2` failed the same way, so it was the music service, not the model or prompt: stop after two failures and report.
  - On 2026-11-19 a **9 s** prompt-mode track (17.5 cr) came back as one hit, not music: near-silent for 3.9 s, one impact, then a decaying bass pulse, with no drums or beat, though the prompt asked for a build, a drop at 1.5 s and a final hit. Very short tracks seem to collapse into a single gesture. For a short video, ask for 15–20 s (or a composition plan with ≥ 3 s sections) and cut it, or re-cut an existing bed.
  - The 20 s retry (38 cr, same day, same style) was a real track, but the drop came at 8.0 s instead of the 3 s asked: the model puts its own 8 s build in front. Plan to cut it: measure the drop and the final hit (25 ms RMS bins), set the offset so the drop lands on the picture, and jump to the final hit under a sting.
- **SFX:** about 6 cr each.
  - Check every file's peak before using it (`volumedetect`). A 0.5 s "UI click" came back silent (−60 dB peak), and the 0.6 s "glitch" came back very quiet.
  - The 2026-11-19 SFX v2 batch (8 × 6 cr, alfa-hero) all came back usable in ~30 s. The "glitch burst" was full-scale noise for its whole 0.48 s (trim it to 50–160 ms), and the "stopwatch stop" peaked at only −4 dB with −35 dB RMS (layer a hit under it).
  - Short UI clicks are easy to synthesize for free with ffmpeg (a 1.7 kHz sine plus high-passed noise, 60 ms fade).
- **Music composition plans don't hold their section times.** A 6/8/6 s plan (intro/drop/payoff) came back with the drop at 8.0 s and silence after 16 s.
  - Draw the waveform (`showwavespic`) to find the real drop and end.
  - Then re-cut on bar lines in the edit (at 120 BPM a bar is 2 s) instead of paying for a new track.
  - A second track (43 cr) ignored the plan entirely: a flat 22 s loop. Arrange it with filters instead of regenerating: split it into a low-passed, a full and a high-passed copy, gate each with a `volume='clip(...)':eval=frame` expression on `t` (20 ms ramps, `asetnsamples=n=240` first so the ramps are smooth), and `amix normalize=0`. The beat never drifts because every section is the same track. Low-passing keeps the bass, so turn the intro down (×0.55) or it is louder than the drop. See `videos/hero/workflow-hero/build/remotion/make_music.sh`.
- **Voiceover:** the Levantine voice "Laloosh" was used in the UGC reel.

## STT is a check, not proof
STT heard "AdFlicks" and "Cloud". Always listen to the line yourself as well.
- **Character-carried transitions (Gemini Omni Flash 1.2, first/last frame, alfa-hero v13):** first frame = the exact frame where shot A ends, last frame = the frame where shot B starts, prompt "the change of world happens around her body as she moves … same woman throughout". All 4 of 4 worked on the first try (fall → gym, duck → sand → bike, thrown off → office chair, into the laptop → rooftop sprint), with the world morphing in about 0.5 s around 1.0–1.75 s. Extract both frames free with `extract_video_frame`; the join into and out of the clip is then invisible. `generate_audio: false` was overridden (clips came back with audio, same 315 cr).
- **A character disappearing into a screen (alfa-hero v15):** edit the first frame with gpt-image-2-6-sunburst ("remove the woman, chair empty, keep everything else exactly the same, screen glowing", 70 cr) and use that as the last frame of a locked-off Gemini Omni Flash 1.2 clip (315 cr). The laptop stays still to ±1 px, so a corner-pin on its screen holds for the whole clip; Gemini made her vanish in light ribbons from the screen (1.5–2.9 s) rather than literally shrinking into it. Showing the next world on that screen and diving into it reads as "she went in".
