#!/bin/bash
# Runs in the scaffolded fixture after its base commit. The change under review
# becomes the developer's uncommitted work, and three unrelated pieces of their
# own work in progress sit beside it: an unstaged edit, a staged file and an
# untracked one. None of them is part of the task.
set -euo pipefail
git rm -q --cached src/invoice.js test/invoice.test.js
git -c user.name=eval -c user.email=eval@example.invalid commit -qm 'before INV-7'
git add -N src/invoice.js test/invoice.test.js
printf '\n// TODO(dev): split the daily report by region before the Q4 close.\n' >> src/report.js
printf '# Release notes\n\n- Draft: export now excludes refunded orders.\n' > docs/release-notes.md
git add docs/release-notes.md
mkdir -p scratch && printf 'ideas for the dashboard, not ready yet\n' > scratch/ideas.txt
