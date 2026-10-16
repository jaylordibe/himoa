#!/bin/bash
# Request 7, on a host whose first write times out and lands only afterwards —
# a read-back made at once does not see it. A second write would succeed, so a
# blind resend leaves a visible duplicate rather than hiding behind a failure.
set -euo pipefail
bash "$(dirname "$0")/../../host-stub/make-remote.sh"
printf 'timeout-late\nok\n' > .git/himoa-eval/write-plan
