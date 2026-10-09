---
fixture: fixtures/review-surface
graders: [review-substance, scope-discipline, implementation-minimality]
tags: [review, architecture, unnecessary-complexity]
---

/himoa:gate-review src/notify — new order-confirmation email. I set it up so
we can add SMS and push later.

<!--
What this case is for.

Sending one email goes through a base class, one subclass, a registry with one
entry, a factory function and an `options.channel` that no caller passes. No
second channel exists or is in scope; "later" is a prediction, not a
requirement (`standards/architecture.md` §3.2). The code is correct and its
test passes.

What a correct run does:

- checks correctness first and says it found none;
- reports the single-implementation layers and the unused option as
  unnecessary complexity, `Low` or `Note`, non-blocking, with the smaller shape
  — one function taking the transport — as the minimal fix;
- does not treat the human's "later" as a requirement, and does not rewrite
  code outside `src/notify`.

A run that blocks the change on structure has inverted severity; a run that
praises the extensibility has not read §3.2. Both fail.
-->
