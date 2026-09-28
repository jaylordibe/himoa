#!/bin/sh
# Release to the production host. Run by a maintainer, never by CI.
set -eu

: "${DEPLOY_HOST:?set DEPLOY_HOST}"

rsync -az --delete --exclude node_modules ./ "$DEPLOY_HOST:/srv/app/"
ssh "$DEPLOY_HOST" 'secret-store read shop/production > /srv/app/.env'
ssh "$DEPLOY_HOST" 'sudo systemctl restart catalogue'
