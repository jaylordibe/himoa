#!/bin/bash
# Stamp the charter with the version under test (evals/audit-stamp-current-version.sh),
# then remove the fixture's README — the answer key — from the worktree and the
# base commit (evals/audit-remove-answer-key.sh), which folds the stamp into
# the same amend.
set -euo pipefail
bash "$(dirname "$0")/../../audit-stamp-current-version.sh"
bash "$(dirname "$0")/../../audit-remove-answer-key.sh"
