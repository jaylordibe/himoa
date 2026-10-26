#!/bin/bash
# Runs in the scaffolded fixture after its base commit. The fixture's README is
# the answer key — every plant with its line and the outcome the audit should
# give it — and the scaffold has already committed it beside the transcript.
# The audit has to find the plants from the record, so the key is removed from
# the worktree, from the base commit, and from the reflog and object store the
# amend would otherwise leave it in. The judge uses the repository's own copy.
set -euo pipefail
rm -f README.md
git rm -q --cached --ignore-unmatch README.md
git -c user.name=himoa-eval -c user.email=himoa-eval@example.invalid -c commit.gpgsign=false commit -q --amend --no-edit --allow-empty
git reflog expire --expire=now --expire-unreachable=now --all
git gc --prune=now --quiet
