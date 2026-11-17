#!/usr/bin/env bash
# Render the hero and make the deliverables, all from one high-quality master:
#   -master.mov  ProRes 422 HQ + 48 kHz PCM (the edit / archive master)
#   .mp4         H.264 High, CRF ${CRF:-12}, preset slow, AAC 256k, faststart (the site's main file)
#   .webm        VP9 CRF ${WEBM_CRF:-24} + Opus 160k (the site's alternative source)
#   -poster.png  frame at 0.6 s
# The music bed is built first by make_music.sh. The audio is peak-limited once, on the master.
# Usage: bash render.sh v18                 -> ../../renders/workflow-hero-v18{-master.mov,.mp4,.webm,-poster.png}
#        bash render.sh v18 --scale=0.5     (quick preview; extra args go to `remotion render`)
#        CONC=4 bash render.sh v18          (lower concurrency if a frame times out)
set -euo pipefail
cd "$(dirname "$0")"
V=${1:?usage: render.sh <version> [remotion args]}; shift
COMP=WorkflowHero
OUT=../../renders/workflow-hero-$V
mkdir -p ../../renders
bash ../../../../../tools/fetch_media.sh media.tsv
bash make_music.sh
npx remotion render "$COMP" "$OUT.raw.mov" --codec=prores --prores-profile=hq --audio-codec=pcm-16 \
  --concurrency="${CONC:-8}" --log=error "$@"
[ -s "$OUT.raw.mov" ] || { echo "render failed: no $OUT.raw.mov" >&2; exit 1; }
# Remotion's audio mix can peak above 0 dBFS: limit it, keep the picture untouched.
ffmpeg -v error -y -i "$OUT.raw.mov" -c:v copy -af "alimiter=limit=0.7:attack=2:release=40:level=false" \
  -c:a pcm_s16le "$OUT-master.mov"
rm "$OUT.raw.mov"
COLOR="-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv"
ffmpeg -v error -y -i "$OUT-master.mov" -c:v libx264 -preset slow -crf "${CRF:-12}" -profile:v high -pix_fmt yuv420p \
  $COLOR -c:a aac -b:a 256k -movflags +faststart "$OUT.mp4"
ffmpeg -v error -y -i "$OUT-master.mov" -c:v libvpx-vp9 -crf "${WEBM_CRF:-24}" -b:v 0 -row-mt 1 -deadline good -cpu-used 1 \
  -pix_fmt yuv420p $COLOR -c:a libopus -b:a 160k "$OUT.webm"
ffmpeg -v error -y -ss 0.6 -i "$OUT-master.mov" -frames:v 1 "$OUT-poster.png"
# loudness check: aim for about -15 LUFS integrated, true peak below -0.5 dBFS
ffmpeg -hide_banner -nostats -i "$OUT.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2 || true
ls -la "$OUT-master.mov" "$OUT".mp4 "$OUT".webm "$OUT-poster.png"
