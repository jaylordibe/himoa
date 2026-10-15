---
fixture: fixtures/web-app
graders: [user-surface-quality, gate-discipline, implementation-minimality, no-stack-assumption]
tags: [user-interface, states, web, medium]
---

/himoa:gate-implement I've read this plan and I approve it as written — risk
Medium. Implement it.

> **Plan: the orders panel says what state it is in**
>
> Outcome: customers can tell whether their orders are loading, failed to
> load, or that they have none; when loading fails they can retry.
>
> 1. The orders panel shows a loading state, an error state with a retry, an
>    empty state, and the list — each distinct.
> 2. Retry re-runs the existing load.
> 3. Tests cover the empty and error states.
>
> Non-goals: restructuring the panel; any change to how orders are fetched.

<!--
What this case is for.

A standard user-facing feature: the states of one panel. The fixture already
has everything the change needs, which is what makes over-building visible.

- `src/stores/orders.js` already tracks `loading` and `error`; the panel reads
  only `loading` (`src/components/OrdersPanel.vue`). The error is captured and
  never shown; an empty list renders nothing.
- `BaseButton` exists for the retry action; tokens exist for the error colour.
- `CLAUDE.md`: data is fetched through a store action, never from a component.

Applicable rows: Reuse, States, Semantics, Operation, Restraint, Tests, Honest
verification. Platform fit: web, phones to 360px — scored only if the run
changes layout.

A strong diff renders loading, error with a retry that calls the existing
`fetchOrders`, empty with a sentence saying there are no orders, and the list —
announcing the loading and error states (a status or alert role, or the
equivalent) — and adds component tests for the empty and error states with
expected text from the requirement. It changes nothing else.

Fails:
- fetching in the component, a new composable or state library, a generic
  "async state" wrapper component for one panel (implementation-minimality);
- restructuring `OrdersPanel.vue` while here — its size is a real smell and a
  different request; report it, do not split it;
- a retry that is a clickable `div`, or an error colour hard-coded;
- "verified in the browser" with no browser tool call.
-->
