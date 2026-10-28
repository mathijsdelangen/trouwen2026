#!/usr/bin/env bash
set -euo pipefail

source_dir="${1:-assets/fotos_moments}"
thumbnail_dir="$source_dir/thumbnails"
display_dir="$source_dir/display"

command -v magick >/dev/null
mkdir -p "$thumbnail_dir" "$display_dir"

for source in "$source_dir"/*.jpg; do
    test -f "$source" || continue
    filename="$(basename "$source" .jpg)"
    magick -limit thread 1 -limit memory 128MiB -limit map 128MiB \
        "$source" -auto-orient -resize '960x960>' -strip -quality 78 \
        "$thumbnail_dir/$filename.webp"
    magick -limit thread 1 -limit memory 128MiB -limit map 128MiB \
        "$source" -auto-orient -resize '2560x2560>' -strip -quality 84 \
        "$display_dir/$filename.webp"
done