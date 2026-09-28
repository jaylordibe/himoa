# CLAUDE.md

## Project

Product catalogue for a small online shop. Plain Node HTTP service, no web
framework, no database — the catalogue is a JSON file loaded at start-up.
Package manager: npm.

## Canonical commands

| Purpose | Command |
|---|---|
| Run | `npm start` |
| Tests | `npm test` |

## Architecture

```
src/server.js      # JSON API under /api, loads configuration from .env
public/            # the storefront page and its assets
deploy/nginx.conf  # production reverse proxy
scripts/deploy.sh  # release to the production host
```

## Deployment

One production host. `scripts/deploy.sh` syncs the repository to `/srv/app`,
writes the production `.env` there from the secret store, and restarts the
service. nginx serves the static assets from `public/` and proxies `/api` to
the Node process.

## Consumers

| Consumer | Repository | Audience | Owner |
|---|---|---|---|
| _(none — the storefront page is served from this repository)_ | | | |
