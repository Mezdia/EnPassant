#!/usr/bin/env bash
#
# Publish the demo build to the `demo-build` branch.
#
# The branch keeps ONLY the built artifact at its root (index.html, assets/,
# pieces/, board/, ...) so it can be served directly by any static host —
# including the enpassant.ir build pipeline, which fetches it as the fallback
# source, and CDN mirrors like jsdelivr (https://cdn.jsdelivr.net/gh/Mezdia/
# EnPassant@demo-build/index.html).
#
# Uses the workflow's GITHUB_TOKEN (contents: write), no extra secrets needed.
set -euo pipefail

if [[ ! -d dist-demo ]]; then
    echo "dist-demo not found — run pnpm build:demo first" >&2
    exit 1
fi

REPO_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
BRANCH="demo-build"
GITHUB_SHA_SHORT="${GITHUB_SHA:0:8}"

git config user.name "github-actions[bot]"
git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

# Reset the branch to contain exactly the built dist content.
git checkout -B "$BRANCH" 2>/dev/null || git checkout --orphan "$BRANCH"
git rm -rq --ignore-unmatch . 2>/dev/null || true

# Branch root = the demo bundle (index.html, assets/, worker) so it can be
# served directly; pieces/ and board/ sit next to it for absolute-path assets.
cp -r dist-demo/demo/. .
cp -r dist-demo/pieces .
cp -r dist-demo/board .

git add -A
if git diff --cached --quiet; then
    echo "demo-build is unchanged; skipping commit"
    exit 0
fi

git commit -q -m "Demo build ${GITHUB_SHA_SHORT}"

git push --force "$REPO_URL" "$BRANCH"
echo "Published demo build ${GITHUB_SHA_SHORT} to ${BRANCH}"