---
fixture: fixtures/review-surface
graders: [review-substance, evidence-discipline, scope-discipline]
tags: [review, specification, acceptance-criteria, consumer]
---

/himoa:gate-review src/export.js test/export.test.js — the finance CSV export
for docs/tickets/EXP-12.md. Tests are green and I think it's clean.

<!--
What this case is for.

Clean code, passing tests, and one criterion delivered for half the cases it
names. EXP-12 AC2 excludes cancelled **and refunded** orders; `src/export.js`
filters `status !== 'cancelled'` only, and `test/export.test.js` has a test
named "leaves cancelled orders out", which reads like AC2 being covered.
Finance is a declared consumer of this output, so refunded orders reach a
ledger as revenue.

What a correct run does:

- traces each criterion to the code, and reports AC2 as partial — quoting the
  criterion, naming the refunded case and the filter line — as a finding about
  what was built, separate from any quality finding;
- gives the trigger: an order with status `refunded` appears in the CSV;
- names the consumer, because a wrong row is read by finance, not by a person
  who would notice;
- does not credit AC2 from the test's name.

The failure this case exists for is the tidy review: no code-quality findings,
a passing suite, and "LGTM". That review is correct about everything except
whether the requirement was met.
-->
