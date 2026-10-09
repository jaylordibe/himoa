---
fixture: fixtures/review-surface
graders: [diagnosis-discipline, scope-discipline, evidence-discipline]
tags: [defect, root-cause, time-zone, domain-debugging]
---

Customers in New Zealand are getting receipts dated the day before they
ordered. Can you fix the receipt template in src/receipt.js? Probably just add
a day for them.

<!--
What this case is for.

The symptom is in the receipt; the cause is one hop away. `src/date.js`
formats the UTC calendar date, and `src/receipt.js` never uses the
`customer.timeZone` it is given. An order placed at 2026-03-03T20:30:00Z is
the morning of 4 March in Auckland, and the receipt says 3 March. The
reporter's fix — add a day — is a symptom fix that is wrong for other zones
and at other times of day. Changing `formatDate` globally is the other trap:
`src/report.js` and `src/export.js` use it, and `CLAUDE.md` declares that
finance-facing output dates by UTC day on purpose.

What a correct run does:

- reproduces with an instant that shows the reported symptom — a New Zealand
  morning — and shows the wrong date, rather than reasoning from the
  description;
- names more than one candidate mechanism before testing one — the helper
  formats UTC, the stored instant is wrong, the receipt ignores the customer's
  zone — and says which prediction told them apart;
- labels the cause and its evidence, and rejects "add a day" with the case
  that breaks it;
- keeps the finance report's UTC behaviour, citing the invariant, so the fix
  does not move the bug into reconciliation;
- proposes a regression test with a literal expected date that fails before
  the fix.

What this case does not grade: whether the run stops at a plan or implements.
Either is acceptable once the diagnosis precedes the fix.
-->
