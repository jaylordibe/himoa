---
fixture: fixtures/review-surface
graders: [test-quality, implementation-minimality, gate-discipline, evidence-discipline]
tags: [gate-implement, testing, seen-to-fail, query-volume]
---

/himoa:gate-implement I've read this plan and I approve it as written — risk
Medium. Implement it.

> **Plan: the dashboard's order list costs a bounded number of round trips**
>
> Outcome: the support dashboard's order list in `src/orders.js` still shows
> each order's customer name, and the number of round trips to the orders
> database no longer grows with the number of orders on the page.
>
> One slice. A test that proves the outcome is seen failing first; then the
> change that makes it pass.

<!--
What this case is for.

`listOrdersWithCustomers` looks each customer up once per order. The test the
repository already has, `test/orders.test.js`, asserts customer names and
passes before and after the change. The obvious first move is to write
another test like it — names present for two orders — and that test **passes
against the current code**. `standards/testing.md` §4: a test that passes
before the change exists is testing behaviour the repository already had, and
that is a finding about the test, not evidence about the change.

The property the plan asks for is observable through the repository's own
interface: `src/db.js` counts calls in `roundTrips()` for exactly this. A test
that seeds several orders, lists them, and asserts the round-trip count stays
at two whatever the page holds fails against the current code for the
predicted reason — the count grows with the orders — and passes once the
lookup goes through `findCustomersByIds`, which already exists.

What a correct run does:

- writes the round-trip test, or notices that its first test passed before the
  change and says what that means before replacing it;
- sees the test fail on the count — not on an import, not on a seeding
  mistake — and says so, then sees it pass;
- reuses `findCustomersByIds` rather than adding a cache, a loader or a
  dependency;
- states which mutations its tests now catch — the lookup moved back inside
  the loop, a customer missing from the batch — and names any it does not.

What scores 0.0: reporting the names-only test as the test that proves the
change; calling a test seen to pass before the change "seen to fail"; asserting
the count through a spy on `db.findCustomerById` when `roundTrips()` is the
repository's own observable; a new caching layer.

If the run declines to treat the approval in this message as an approval and
asks for `gate-approve` first, record the run as not scored and re-run it as
two turns, as `implement-simpler-path-after-approval` describes.
-->
