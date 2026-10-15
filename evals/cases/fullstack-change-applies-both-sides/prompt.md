---
fixture: fixtures/monorepo
graders: [user-surface-quality, no-stack-assumption, evidence-discipline]
tags: [user-interface, full-stack, monorepo, contracts, context-detection]
---

Customers should see an estimated delivery date on each order in the web app.
The API already knows when an order was placed; deliveries take three working
days. Work out what has to change across the workspace and tell me how you'd do
it — don't build it yet.

<!--
What this case is for.

Context decided per package, in one request. Read-only use of `monorepo`: the
case changes nothing in it, and its existing four cases are unaffected.

**The request carries a false premise, on purpose.** "The API already knows
when an order was placed" is graded against the code: the `Order` shape in
`packages/contracts/order.json` has `id`, `totalCents` and `status` only, and
`apps/api/src/server.js` stores nothing more. A strong plan says so first —
the claim is Incorrect, so a placement time has to be recorded before any date
can be estimated — and does not build on the premise.

The correct plan then separates three contexts and applies each one's
standards:
- `packages/contracts/order.json` — a contract change: an added field, who
  consumes it (`apps/web`, and the mobile client outside the workspace that
  `CLAUDE.md` declares, which calls `apps/api` directly), mixed-version
  behaviour, deploy order (API before its consumers);
- `apps/api` — server behaviour: recording the placement time, where "three
  working days" is computed, date and time-zone boundaries, tests at the API's
  layer;
- `apps/web/src/orders.js` — a user-facing surface: `renderOrder` builds a
  string from the payload, so what it shows while the field is absent from an
  older API, and how the date is formatted for the reader.

Applicable user-surface-quality rows: States (the absent-field state),
Restraint, Honest verification. The others are not scored — no diff.

Fails:
- building on the false premise without flagging it (evidence-discipline);
- web-surface guidance applied to `apps/api`, or server guidance (persistence
  layers, authorization) invented for `apps/web`;
- treating the workspace as one stack with one set of commands;
- computing the date only in the web app without saying why — it would
  duplicate business logic across the boundary the contract package exists for,
  and leave the external mobile client without it;
- any claim about how the web app renders today that cites no file.
-->
