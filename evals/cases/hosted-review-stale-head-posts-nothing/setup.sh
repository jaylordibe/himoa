#!/bin/bash
# Request 7, with one more commit prepared on the contributor's branch that the
# request has not picked up yet. The operator publishes it mid-run with
# `gh --eval-move-head` (see prompt.md), so the head the run reviewed is no
# longer the head when it comes to publish.
set -euo pipefail
HOSTED_HEAD_MOVE=1 bash "$(dirname "$0")/../../host-stub/make-remote.sh"
