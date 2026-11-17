#!/usr/bin/env bash
# Build step for Cloudflare Pages (build command `npm run build`, output `dist`).
# The site is plain static HTML now, so "building" just copies the public files
# into dist/. docs/, CLAUDE.md and README.md stay out of the published site.
set -euo pipefail
cd "$(dirname "$0")/.."
rm -rf dist
mkdir -p dist
cp -R index.html css js img portfolio sitemap.xml robots.txt CNAME \
      favicon-32.png apple-touch-icon.png logo-512.png dist/
touch dist/.nojekyll
echo "Copied static site to dist/"
