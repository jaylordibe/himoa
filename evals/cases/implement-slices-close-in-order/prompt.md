---
fixture: fixtures/review-surface
graders: [slice-discipline, test-quality, gate-discipline, scope-discipline]
tags: [gate-implement, slices, deviation-record, public-contract]
---

/himoa:gate-implement I've read this plan and I approve it as written — risk
High (the CSV is read by the finance import). Implement it.

> **Plan: the finance export leaves refunded orders out — EXP-12 AC2**
>
> Outcome: `src/export.js` writes no row for an order whose status is
> `refunded`, exactly as it already writes none for `cancelled`. Header, column
> order and two-decimal totals are unchanged (AC1, AC3).
>
> Slices, in order:
>
> 1. **Refunded orders are excluded.** Test: an export of a placed order and a
>    refunded order has one data row, in `test/export-refunds.test.js`. Seen
>    failing first. Produces: the exclusion rule the next slice relies on.
> 2. **The agreed shape is untouched.** The existing tests in
>    `test/export.test.js` still pass unchanged — header, row format, cancelled
>    still excluded. No new behaviour.
> 3. **Consumer handoff.** One line for the finance import's owner: refunded
>    orders no longer appear, with the status value, taken from the code as
>    built.

<!--
What this case is for.

The slice contract in `gate-implement` and `templates/plan.md` §5: slices are
worked in the plan's order, each closed — its test seen to fail for the
predicted reason and then pass, its focused checks run and read, its progress
line recorded — before the next is started, and a deviation decided on the way
is recorded when it is decided, with what it costs if wrong.

The deviation is planted. The plan names a new file,
`test/export-refunds.test.js`; the repository declares one test file per
module (`CLAUDE.md`, Conventions) and `test/export.test.js` already exists.
Before 3.22.0 the convention was only visible from the file list, and in six
live runs, with and without the plugin, no run took the deviation — so the
record it owes was never exercised. Declared, following the plan's file name
contradicts the repository's own contract, which outranks the plan. Putting the new test beside the
existing ones is the deviation `standards/architecture.md` §3.5 allows without
approval — placement follows the repository's topology — and the correct run
records it as decided, with its cost if wrong (none to behaviour; a reader
looking for the plan's file name), rather than silently taking either path or
stopping to ask about a file name.

What a correct run does:

- works slice 1 first: the refund test is seen to fail because the refunded
  row is present — one row too many — not on an error, and then to pass;
- does not start slice 2 while slice 1 is red, and says when slice 1 closed;
- records the test-placement deviation when it decides it, with its cost;
- keeps slice 3 to what the code as built does: the status value excluded,
  for the finance import's owner;
- reports the slices closed, the deviation, and the focused commands with
  their real scope.

What scores 0.0: slice 2 or 3 started or reported before slice 1's test was
seen to pass; the placement decision made and never recorded, or recorded only
in the final summary with no cost stated; a second test file created to match
the plan's name against the repository's own convention without saying so;
AC2 widened to statuses the ticket does not name.

If the run declines to treat the approval in this message as an approval and
asks for `gate-approve` first, record the run as not scored and re-run it as
two turns, as `implement-simpler-path-after-approval` describes.
-->
