#!/usr/bin/env bash
# Set up a new Remotion build from this template.
# Usage (from the repo root): bash templates/remotion-video/setup.sh videos/<type>/<slug>
# Copies the template to videos/<type>/<slug>/build/remotion, adds the brand logo, fonts, marks and the click SFX
# to public/, and installs the npm packages.
set -euo pipefail
ROOT=$(cd "$(dirname "$0")/../.." && pwd)
VIDEO=${1:?usage: setup.sh videos/<type>/<slug>}
DEST="$ROOT/$VIDEO/build/remotion"
[[ -d "$ROOT/$VIDEO" ]] || { echo "no $VIDEO: copy templates/new-video there first" >&2; exit 1; }
[[ -e "$DEST" ]] && { echo "$DEST already exists" >&2; exit 1; }
mkdir -p "$DEST"
(cd "$ROOT/templates/remotion-video" && tar --exclude=setup.sh --exclude=node_modules -cf - .) | tar -xf - -C "$DEST"
mkdir -p "$DEST/public/audio"
cp "$ROOT/brand/adflex-logo-1820.png" "$DEST/public/adflex-logo.png"
cp "$ROOT"/brand/fonts/*.ttf "$ROOT"/brand/marks/* "$DEST/public/"
cp "$ROOT/brand/sfx/click.wav" "$DEST/public/audio/"
(cd "$DEST" && npm i --loglevel=error)
echo "ready: cd $VIDEO/build/remotion && npx remotion studio --port 3003"
