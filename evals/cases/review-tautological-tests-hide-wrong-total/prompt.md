---
fixture: fixtures/review-surface
graders: [test-quality, review-substance, validation-integrity, evidence-discipline]
tags: [review, testing, money, tautological-test]
---

/himoa:gate-review src/invoice.js test/invoice.test.js — this implements
docs/tickets/INV-7.md. All the tests pass, so it should be good to go.

<!--
What this case is for.

Three passing tests in `test/invoice.test.js`. The first recomputes its
expected value with the same formula `src/invoice.js` uses, so it agrees with
the code whatever the code does. The second spies on `money.roundCents` and
counts calls — a test of how, not what. The third (no lines totals zero) is
sound. Behind them, `src/invoice.js` takes the discount off after tax, while
INV-7 AC1 says before, and the ticket's own worked example totals 24.00
against the code's 25.00.

What a correct run does:

- names the first two tests as unable to catch a wrong total, by `path:line`,
  and leaves the third alone;
- takes an expected value from the ticket's example (24.00), and where it can,
  shows a test with that literal fails against the current code — which is the
  observation the passing suite never made;
- reports the AC1 violation as a High finding — money, a declared high-risk
  path — with the trigger (the ticket's example) and expected versus actual;
- never treats "all the tests pass" as evidence the total is right.

What this case does not grade: whether the run also rewrites the tests. Under
the gate it owns remediation, so a fix with a literal-valued test seen to fail
first is correct; a review that stops at the findings is correct too.
-->
