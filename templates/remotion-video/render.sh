#!/usr/bin/env bash
# Render the video and make the site deliverables: MP4 (peak-limited), WebM (VP9 + Opus) and a poster PNG.
# Usage: bash render.sh v1   -> ../../renders/<slug>-v1{.mp4,.webm,-poster.png}   (COMP=<id> to pick another composition)
#        bash render.sh v1 --scale=0.5  (quick preview; extra args go to `remotion render`)
set -euo pipefail
cd "$(dirname "$0")"
V=${1:?usage: render.sh <version> [remotion args]}; shift
COMP=${COMP:-Video}
NAME=${NAME:-$(basename "$(cd ../.. && pwd)")}
OUT=../../renders/$NAME-$V
mkdir -p ../../renders
bash ../../../../../tools/fetch_media.sh media.tsv
npx remotion render "$COMP" "$OUT.raw.mp4" --concurrency="${CONC:-8}" --crf=16 --log=error "$@"
# Remotion's AAC mix can peak above 0 dBFS: limit it, keep the picture untouched.
ffmpeg -v error -y -i "$OUT.raw.mp4" -c:v copy -af "alimiter=limit=0.7:attack=2:release=40:level=false" \
  -c:a aac -b:a 192k -movflags +faststart "$OUT.mp4"
rm "$OUT.raw.mp4"
ffmpeg -v error -y -i "$OUT.mp4" -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p \
  -c:a libopus -b:a 128k "$OUT.webm"
ffmpeg -v error -y -ss 0.6 -i "$OUT.mp4" -frames:v 1 "$OUT-poster.png"
# loudness check: aim for about -15 LUFS integrated, true peak below -0.5 dBFS
ffmpeg -hide_banner -nostats -i "$OUT.mp4" -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:" | tail -2 || true
ls -la "$OUT".mp4 "$OUT".webm "$OUT-poster.png"
