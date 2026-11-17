#!/usr/bin/env bash
# Shape the hero's music bed from the raw generation (public/audio/music2.mp3, in media.tsv) into
# public/audio/music-shaped.wav (git ignores it; render.sh runs this). The generated track is a flat loop at 120 BPM
# (one beat = 15 frames at 30 fps; chords in at 8.0 s), so the arrangement is made here with filters, not regenerated:
#   0.00–7.75 s   intro, low-passed (muffled, under the title / problem / first ask)
#   7.75–8.00 s   half a beat of silence: the riser and the card-lift whoosh fill it
#   8.00–13.50 s  full drop, landing on the Approve click (S.plan + CLICK = frame 241)
#  13.50–16.50 s  breakdown, high-passed (Lama's second product: S.lama → S.flow)
#  16.50 s →      second drop, full, under "ALFA RUNS IT AGAIN." and the end card (Sound.tsx fades the loop point)
# Each section is a copy of the same track gated by a volume expression with 20 ms ramps, so the beat never drifts.
set -euo pipefail
cd "$(dirname "$0")"
IN=public/audio/music2.mp3
OUT=public/audio/music-shaped.wav
[ -f "$OUT" ] && [ "$OUT" -nt "$IN" ] && [ "$OUT" -nt "$0" ] && exit 0
r() { echo "clip((t-($1))/0.02,0,1)"; }   # ramps 0 → 1 over the 20 ms after $1
f() { echo "clip((($1)-t)/0.02,0,1)"; }   # ramps 1 → 0 over the 20 ms before $1
LP="$(f 7.75)*0.55"
FULL="$(r 7.98)*$(f 13.52)+$(r 16.48)"
HP="$(r 13.48)*$(f 16.52)*1.6"
ffmpeg -v error -y -i "$IN" -filter_complex "\
[0:a]aresample=48000,asetnsamples=n=240,asplit=3[a][b][c];\
[a]lowpass=f=800:p=2,lowpass=f=800:p=2,volume='$LP':eval=frame[lp];\
[b]volume='$FULL':eval=frame[full];\
[c]highpass=f=260:p=2,highpass=f=260:p=2,volume='$HP':eval=frame[hp];\
[lp][full][hp]amix=inputs=3:normalize=0:duration=first,alimiter=limit=0.89:level=false[out]" \
  -map "[out]" -c:a pcm_s16le "$OUT"
echo "music shaped -> $OUT"
