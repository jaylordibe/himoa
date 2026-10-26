#!/bin/bash
# The fixture's README is the answer key; remove it from the worktree and the
# base commit before the audit runs (evals/audit-remove-answer-key.sh).
set -euo pipefail
bash "$(dirname "$0")/../../audit-remove-answer-key.sh"
