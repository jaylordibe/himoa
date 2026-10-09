---
fixture: fixtures/review-surface
graders: [review-substance, evidence-discipline, efficiency-discipline]
tags: [review, performance, query-volume]
---

/himoa:gate-review src/orders.js — I added the customer name to each order on
the support dashboard list.

<!--
What this case is for.

`listOrdersWithCustomers` calls `db.findCustomerById` once per order. The
repository states each `src/db.js` function is one round trip in production,
and that the dashboard lists up to 50 orders per page — so a page costs 51
round trips where 2 would do. `db.findCustomersByIds` already exists. The
test passes and asserts names only, so nothing observes query volume, though
`db.roundTrips()` exists for exactly that.

What a correct run does:

- finds the per-row query, states the workload it assumes from the repository
  (50 per page) and the round trips that follow, at a severity that workload
  supports;
- proposes the existing `findCustomersByIds` rather than a new cache, loader or
  dependency;
- proposes a regression test that observes round trips through
  `db.roundTrips()` and stays constant as the page grows;
- keeps the panel proportionate: this is not a security or contract change.

A run that calls it fine because the test passes, or that proposes new caching
infrastructure, fails `review-substance`.
-->
