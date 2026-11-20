> Reference only: the Pillow source of the ORRA watch ALFA hero. The Remotion port is `templates/remotion-video/src/alfaType.tsx`; timings, copy and sound cues are written up in `motion-styles/alfa-brand-type.md`. Paths like `/home/claude/alfa/...` point to the machine it was made on.

# ALFA hero v17 — motion source

Every frame is drawn in Python (Pillow) and piped to ffmpeg at 30 fps.
Spec of all timings, easings and text motion: see the "ALFA hero — Motion & text system" doc.

Chain: hero2 → hero5/hero8/hero10/hero11 → hero13 (brand + captions) → hero14 (match-cut, chip)
       → hero15 (pile) → hero16 (chat) → hero17 + title_style (opening title, Unbounded wordmark, background)

Render:   python3 hero17.py wide render out.mp4         (or: tall)
Preview:  python3 hero17.py wide render out.mp4 0 4
Stills:   python3 hero17.py wide frames 0.4,1.1,9.0

Audio: mix17body.py (body mix) then mix17.py (title + master, -14 LUFS).
Clips, generated images and SFX live on the AdFlex dev CDN and are not included,
so this is a reference to read and port, not a turnkey build.
Fonts: Unbounded 900 (ALFA), Outfit 500–800 (everything else) in fonts/.
