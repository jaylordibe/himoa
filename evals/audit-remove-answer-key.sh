#!/bin/bash
# Shared by every run-audit case: each case's setup.sh runs this, in the
# scaffolded fixture after its base commit, so there is one copy of the removal
# rather than one per case. The fixture's README is the answer key — every
# plant with its line and the outcome the audit should give it — and the
# scaffold has already committed it beside the transcript. Anything a case's
# own setup.sh has staged before calling this is folded into the same amend.
# The audit has to find the plants from the record, so the key is removed from
# the worktree, from the base commit, and from the reflog and object store the
# amend would otherwise leave it in. The judge uses the repository's own copy.
set -euo pipefail
rm -f README.md
git rm -q --cached --ignore-unmatch README.md
git -c user.name=himoa-eval -c user.email=himoa-eval@example.invalid -c commit.gpgsign=false commit -q --amend --no-edit --allow-empty
git reflog expire --expire=now --expire-unreachable=now --all
git gc --prune=now --quiet
