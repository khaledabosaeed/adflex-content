#!/usr/bin/env bash
# Encode renders/out/f%05d.jpg (from render.cjs) into the hero deliverables.
# MP4 on the NVIDIA GPU (h264_nvenc), falls back to libx264; WebM (VP9) for the site; poster PNG.
set -euo pipefail
cd "$(dirname "$0")/.."
V=${1:-v1}
IN=renders/out/f%05d.jpg
OUT=renders/workflow-hero-$V
if ffmpeg -hide_banner -encoders 2>/dev/null | grep -q h264_nvenc; then
  ffmpeg -v error -y -framerate 30 -i "$IN" -c:v h264_nvenc -preset p7 -tune hq -rc vbr -cq 17 -b:v 0 \
    -profile:v high -pix_fmt yuv420p -movflags +faststart -an "$OUT.mp4"
else
  ffmpeg -v error -y -framerate 30 -i "$IN" -c:v libx264 -crf 17 -preset slow -pix_fmt yuv420p -movflags +faststart -an "$OUT.mp4"
fi
ffmpeg -v error -y -framerate 30 -i "$IN" -c:v libvpx-vp9 -crf 32 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -an "$OUT.webm"
ffmpeg -v error -y -i renders/out/f00045.jpg "$OUT-poster.png"
ls -la "$OUT".* "$OUT-poster.png"
