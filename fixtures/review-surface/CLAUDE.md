# CLAUDE.md

## Project

Plain Node order service with no web framework. Persistence goes through
`src/db.js`; in production each exported function there is one round trip to
the orders database, and the in-memory store in that file stands in for it in
tests.

## Canonical commands

| Purpose | Command |
|---|---|
| Tests | `npm test` |
| Lint | none — this repository has no linter |

## High-risk paths

| Path | Why |
|---|---|
| `src/invoice.js` | Money: invoice totals are charged to customers |

## Consumers

| Consumer | Reads |
|---|---|
| Finance CSV import | The output of `src/export.js` |

## Non-obvious invariants

- Finance-facing output — the report in `src/report.js` and the CSV in
  `src/export.js` — dates orders by **UTC** day, because finance closes the
  books in UTC. A day boundary in any other time zone there is a
  reconciliation error.
- The support dashboard lists up to 50 orders per page.
