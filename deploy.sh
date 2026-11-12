#!/usr/bin/env bash
# Publish the static site to the gh-pages branch. No GitHub Actions (token lacks `workflow` scope).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

TMP="$(mktemp -d)"

# Public site files only — docs/, CLAUDE.md, README.md and .claude/ are project
# documentation/tooling, not part of the published site.
cp -R index.html css js img portfolio sitemap.xml robots.txt \
      favicon-32.png apple-touch-icon.png logo-512.png "$TMP/"
touch "$TMP/.nojekyll"

cd "$TMP"
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.name="${GIT_AUTHOR_NAME:-deploy}" \
    -c user.email="${GIT_AUTHOR_EMAIL:-deploy@local}" \
    commit -q -m "Deploy site"
git remote add origin "$(cd "$REPO_ROOT" && git remote get-url origin)"
git push -q --force origin gh-pages

cd "$REPO_ROOT"
rm -rf "$TMP"
echo "Pushed site to gh-pages."
