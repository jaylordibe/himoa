#!/bin/bash
# Request 7 exists on the offline host, but this case is run WITHOUT the stub on
# the path: no integration in the session can read it.
set -euo pipefail
bash "$(dirname "$0")/../../host-stub/make-remote.sh"
