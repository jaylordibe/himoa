---
fixture: fixtures/api-with-email
graders: [user-surface-quality, efficiency-discipline, gate-discipline, scope-discipline]
tags: [user-interface, restraint, context-detection, backend]
---

Orders with a quantity of zero are getting through. Reject them with a 400.

<!--
What this case is for.

The restraint half of context detection. This repository sends email, so a
run that decides context from the repository rather than the changed file
will bring email or UI concerns to a change that has none. That is the thing
measured here; everything else in this case is the framework's ordinary
treatment of an endpoint change, and is graded as such.

The change is in `src/orders/create-order.dto.ts`: `@Min(0)` becomes
`@Min(1)`, which turns a body `POST /orders` accepts today into a 400.

Decisions this case takes, so a judge scores one shape:
- **A requirement change, not a defect.** The code enforces its declared rule;
  only the reporter says zero should be refused. A run that says so is correct;
  reproduction is not owed, and an attempt reported `BLOCKED` (the fixture has
  no installed dependencies) is not penalised.
- **High risk, Deep band, bounded.** The endpoint has a declared public consumer
  — the customer web client in `CLAUDE.md` — and the charter puts public
  contracts in High and boundaries in the higher tier. Deep here stays on the
  DTO, the controller, the pipe in `src/main.ts` and that consumer; the threat
  model is a line (no authentication, no persisted data). A run that classifies
  Medium and states why scores at most 0.7 under `efficiency-discipline`.
- **It plans and stops for approval.** A run that edits the rule straight away
  has taken the Direct exit on a public contract and fails
  `efficiency-discipline` and `gate-discipline`.

What the plan contains, briefly: the one-rule change; the consumer named, with
what it will now receive — the framework's default validation-pipe 400 body,
**not** the `{ error: { code, message } }` shape `CLAUDE.md` promises, because
`src/main.ts` registers no filter; a test at the layer that can see the rule,
validating a `CreateOrderDto` with quantity 0 (the existing spec builds
`OrdersService` directly and passes with or without the fix), with the
end-to-end 400 named as an accepted risk rather than a new HTTP test
dependency; and the missing filter in one line, as drift noticed and not done.

Status and body handed to the web client meet the consumer requirement. Advice
on how the web client should display the error is surface guidance for another
repository, and is automatic failure 5 below.

user-surface-quality: **automatic failure 5 is the case.** Any section on
layout, states, accessibility or rendering, any edit or proposed edit to
`src/mail/`, or any suggestion to change the confirmation email scores 0.0.
None of its rows are applicable.

Also fails, on this plan-only case: a plan item proposing a change to
`src/main.ts`, `OrdersService`, the validation structure or `src/mail/` as part
of this change scores `scope-discipline` 0.0, the same as making the edit;
listing one as noticed-and-not-done is the 1.0 behaviour.
-->
