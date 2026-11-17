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
  - Costs about 504 cr for 8 s at 720p, 315 cr for 5 s at 720p, and 364–455 cr per 1080p plate.
- **Wan 3.0 Prime:** 110 cr/s at 720p, image-to-video, no audio. 3 s is enough for cuts of about 1.2 s.
- **Kling Video O3 Standard** (75 cr/s): works with `image_to_video` + one `source_url` + `multi_prompt_segments`. It **fails immediately (and refunds) when character `elements` are passed**.
- **Seedance 2.5:** used for the UGC girl video (14 s, 480p draft, 1,260 cr).
- Check hands and props frame by frame. Trimming past a warp is free; regenerating isn't.
- **Video upscale (`task_type: video_upscale`, bytedance_video_enhancement_standard):** 30 cr for a 5 s clip, about 2 min. A 720×1280 24 fps story came back 1080×1920 at 30 fps with **interpolated** frames (147 of 149 unique), so it also cures the judder of a 24→30 fps copy with doubled frames. Colour and motion unchanged. It returns an AAC track; strip it (`-map 0:v -c:v copy -an`). (workflow-hero v18)

## Audio
- **ElevenLabs Music v2.5:** 25–80 cr per track. Ask for an instant start, a clean final stab at a given second, and the BPM. Then check where it really goes silent.
- **SFX:** about 6 cr each.
  - Check every file's peak before using it (`volumedetect`). A 0.5 s "UI click" came back silent (−60 dB peak), and the 0.6 s "glitch" came back very quiet.
  - Short UI clicks are easy to synthesize for free with ffmpeg (a 1.7 kHz sine plus high-passed noise, 60 ms fade).
- **Music composition plans don't hold their section times.** A 6/8/6 s plan (intro/drop/payoff) came back with the drop at 8.0 s and silence after 16 s.
  - Draw the waveform (`showwavespic`) to find the real drop and end.
  - Then re-cut on bar lines in the edit (at 120 BPM a bar is 2 s) instead of paying for a new track.
  - A second track (43 cr) ignored the plan entirely: a flat 22 s loop. Arrange it with filters instead of regenerating: split it into a low-passed, a full and a high-passed copy, gate each with a `volume='clip(...)':eval=frame` expression on `t` (20 ms ramps, `asetnsamples=n=240` first so the ramps are smooth), and `amix normalize=0`. The beat never drifts because every section is the same track. Low-passing keeps the bass, so turn the intro down (×0.55) or it is louder than the drop. See `videos/hero/workflow-hero/build/remotion/make_music.sh`.
- **Voiceover:** the Levantine voice "Laloosh" was used in the UGC reel.

## STT is a check, not proof
STT heard "AdFlicks" and "Cloud". Always listen to the line yourself as well.
