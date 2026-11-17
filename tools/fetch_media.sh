#!/usr/bin/env bash
# Download the media a build needs (git ignores mp4/mp3/wav) from its media.tsv manifest and check each sha256.
# Usage: bash tools/fetch_media.sh videos/<type>/<slug>/build/remotion/media.tsv
# Manifest lines: <path relative to the manifest>\t<url>\t<sha256>. Lines starting with # are comments.
# Files already present with the right hash are skipped. To add a file: upload it (AdFlex upload library or CDN),
# then add its line with `sha256sum`.
set -euo pipefail
MANIFEST=${1:?usage: fetch_media.sh path/to/media.tsv}
DIR=$(cd "$(dirname "$MANIFEST")" && pwd)
ok=0; got=0; bad=0
while IFS=$'\t' read -r path url sha; do
  [[ -z "${path// }" || "$path" == \#* ]] && continue
  dest="$DIR/$path"
  if [[ -f "$dest" ]] && [[ "$(sha256sum "$dest" | cut -d' ' -f1)" == "$sha" ]]; then ok=$((ok+1)); continue; fi
  mkdir -p "$(dirname "$dest")"
  curl -sSfL -o "$dest.part" "$url"
  if [[ "$(sha256sum "$dest.part" | cut -d' ' -f1)" == "$sha" ]]; then mv "$dest.part" "$dest"; got=$((got+1)); echo "fetched $path"
  else rm -f "$dest.part"; bad=$((bad+1)); echo "HASH MISMATCH $path ($url)" >&2; fi
done < "$MANIFEST"
echo "media: $ok already there, $got fetched, $bad failed"
[[ $bad -eq 0 ]]
