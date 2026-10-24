#!/bin/sh
# Makes static/fonts/{baloo2,nunito}-pl.woff2: Google's "latin" range and the Polish letters, from the
# variable fonts in github.com/google/fonts (SIL Open Font License). Runs fontTools in a Python container.
#   sh tools/fonts-pl.sh   (asks for sudo for docker)
set -e
cd "$(dirname "$0")/.."
work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
curl -sSLf -o "$work/baloo2.ttf" 'https://github.com/google/fonts/raw/main/ofl/baloo2/Baloo2%5Bwght%5D.ttf'
curl -sSLf -o "$work/nunito.ttf" 'https://github.com/google/fonts/raw/main/ofl/nunito/Nunito%5Bwght%5D.ttf'
# The same ranges as the -pl faces in src/app.css
unicodes='U+0000-00FF,U+0104-0107,U+0118-0119,U+0131,U+0141-0144,U+0152-0153,U+015A-015B,U+0179-017C,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
sudo docker run --rm -u "$(id -u):$(id -g)" -e HOME=/tmp -v "$work":/w -v "$PWD/static/fonts":/out python:3.13-slim sh -c "
	pip install -q --target /tmp/pip fonttools brotli 2>/dev/null
	for f in baloo2 nunito; do
		PYTHONPATH=/tmp/pip python -m fontTools.subset /w/\$f.ttf --unicodes='$unicodes' \
			--layout-features='*' --flavor=woff2 --output-file=/out/\$f-pl.woff2
	done"
ls -l static/fonts
