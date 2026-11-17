# Tools

Reusable scripts shared across videos go here. The originals were lost with the old sessions, so rebuild them here as they're needed:

- `textimg.py`: render Arabic/Latin text to transparent PNG with Pillow + raqm (Cairo font).
- `box_overlay.py`: float a screen recording as a rounded box over a talking head.
- `beats.py`: get the beat grid of a music track with librosa.
- `end_card.py`: the AdFlex end card ("works with the AI you use").

Ready:

- [`talking-head-reel/`](talking-head-reel/README.md): talking-head 9:16 reel with 3D icon pops in a safe box (Remotion + three.js), word-synced Arabic captions (faster-whisper + silence snapping), a virtual camera, synthesized SFX and motion blur. Everything runs on the NVIDIA GPU.

- [`fetch_media.sh`](fetch_media.sh): `bash tools/fetch_media.sh <build>/media.tsv` downloads the clips and audio a build needs (git ignores them) and checks each sha256. Files that already match are skipped.
- [`../templates/remotion-video/`](../templates/remotion-video/README.md): starter Remotion project (house helpers, sound pattern, `render.sh`). `bash templates/remotion-video/setup.sh videos/<type>/<slug>` sets it up with the brand fonts and marks.

Per-video scripts belong in `videos/<type>/<slug>/build/`.
