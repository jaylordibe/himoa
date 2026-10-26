#!/bin/bash
# The historical run with its framework version removed. Line 1 keeps the
# charter's rules and loses the version in its last line; line 3, the
# gate-implement text the host injected with the version in its path, becomes
# an attachment record that carries no text. The host's own version stays on
# every record — it is the trap, not the evidence. Line count is unchanged so
# the case's line references hold. tests/validate-fixtures.mjs runs this on a
# scratch copy and checks the result.
set -euo pipefail
replacement='{"type":"attachment","attachment":{"type":"command_permissions"},"uuid":"b157-r003","parentUuid":"b157-r002","timestamp":"2026-10-21T10:15:08Z","sessionId":"b15701c0-2e8f-4a1d-9b6c-000000000002","cwd":"/work/docs-site","version":"2.1.296","isSidechain":false}'
LC_ALL=C sed -e '1s/_himoa v3\.20\.0 — methodology only\./_Methodology only./' -e "3s|.*|${replacement}|" transcript.jsonl > transcript.jsonl.tmp
mv transcript.jsonl.tmp transcript.jsonl
git add transcript.jsonl
bash "$(dirname "$0")/../../audit-remove-answer-key.sh"
