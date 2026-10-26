#!/bin/bash
# Run by the setup.sh of the audit cases whose record should be governed by the
# version under test: replaces the charter at line 1 — the record's only
# framework version — with the charter this repository's plugin renders now.
#
# Why: run-audit judges a run by the text of the version that governed it, and
# an eval workspace can reach only the installed plugin's text. A record whose
# charter is older than the installed one is, correctly, a run the installed
# text did not govern: stamping only the version left the 3.21.0 charter body
# under a 3.22.0 footer, and live audits caught the mismatch. So the whole
# charter is re-rendered from the plugin's own script — one source, nothing to
# update by hand on a release.
set -euo pipefail
root="$(cd "$(dirname "$0")/.." && pwd)"
CLAUDE_PLUGIN_ROOT="$root/plugins/himoa" bash "$root/plugins/himoa/scripts/session-charter.sh" </dev/null > charter.json.tmp
node -e '
const fs = require("fs");
const charter = JSON.parse(fs.readFileSync("charter.json.tmp", "utf8")).hookSpecificOutput.additionalContext;
const lines = fs.readFileSync("transcript.jsonl", "utf8").split("\n");
const first = JSON.parse(lines[0]);
if (first.attachment?.type !== "hook_additional_context") throw new Error("line 1 is not the charter");
first.attachment.content = [charter];
lines[0] = JSON.stringify(first);
fs.writeFileSync("transcript.jsonl", lines.join("\n"));
'
rm -f charter.json.tmp
git add transcript.jsonl
