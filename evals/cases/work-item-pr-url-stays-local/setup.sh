#!/bin/bash
# An open request 7 on the offline host, and a work item that links to it.
set -euo pipefail
bash "$(dirname "$0")/../../host-stub/make-remote.sh"
