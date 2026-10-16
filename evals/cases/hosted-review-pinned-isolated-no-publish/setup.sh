#!/bin/bash
# Request 7 on the offline host: three INV-7 commits from a fork, main advanced
# past the branch point, canary scripts in the request's package.json, and the
# developer's own unrelated work uncommitted on main.
set -euo pipefail
bash "$(dirname "$0")/../../host-stub/make-remote.sh"
