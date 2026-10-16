#!/bin/bash
# The developer's checkout has a remote and an open request 7 on the offline
# host — and the INV-7 change is ALSO their own uncommitted work here. They ask
# for an ordinary local review against main.
set -euo pipefail
bash "$(dirname "$0")/../../host-stub/make-remote.sh"
cp .git/himoa-eval/invoice.js.pr src/invoice.js
cp .git/himoa-eval/invoice.test.js.pr test/invoice.test.js
git add -N src/invoice.js test/invoice.test.js
