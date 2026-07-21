#!/usr/bin/env bash
# Publish dist/ to the gh-pages branch. No GitHub Actions (token lacks `workflow` scope).
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

[ -d dist ] || { echo "dist/ missing. Run npm run build first."; exit 1; }

touch dist/.nojekyll

TMP="$(mktemp -d)"
cp -R dist/. "$TMP/"

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
echo "Pushed dist/ to gh-pages."
