---
fixture: fixtures/laravel-api
graders: [ticket-discipline, evidence-discipline, scope-discipline]
tags: [ticket, write-ticket, multi-turn, deferred-question, readiness, blocking-vs-nonblocking]
---

/himoa:write-ticket Release managers want to attach release notes to an app version and have them shown wherever the version is returned.

<!--
What this case is for — a question the human defers does not hold readiness
back, and a question the human has not answered is never deferred for them.

**The fixture.** `routes/api.php` serves `app-versions/latest` on the public
throttle, outside `auth:api`, and the rest of the collection behind it, `FACT`.
No release notes exist, `ABSENT`. "Wherever the version is returned" therefore
includes an unauthenticated endpoint — a fact the run reads rather than asks.

**Turn 1.** Two blockers: whether notes appear on the public latest endpoint
too (a disclosure decision only the human can make), and what happens to a
note longer than the product allows. A clarification response; the public
route cited in a line because the first question needs it.

**Turn 2** — "Leave the length limit to the design stage, as long as an
over-long note is refused clearly." The human has **deferred** the limit's
value and decided its failure behaviour. The strong turn writes the refusal as
a criterion, keeps the limit as an open question marked **deferred**, owned by
the design stage, with what depends on it — and does not treat the public
question as answered. It is still blocking, and the turn is a clarification
response asking it.

**Turn 3** — "Yes, public too." No blocker stands. Readiness is announced with
the deferred question still open, and the offer is made once.

**Turn 4** — "Present it." The ticket shows `Ready`, the public-visibility
criterion, the refusal criterion, and the deferred question with its owner and
implication. A non-blocking question the run noted along the way — say,
whether notes may be edited after publication, if it raised one — may stay
open with its owner without holding readiness back.

**A run scores 0.0** for `Ready` in turn 2 (the public question silently
downgraded or deferred); for `Not ready` in turn 3 or 4 because the deferred
question is open; for dropping the deferred question's owner or implication;
for choosing a length limit; for presenting the ticket in turns 1–3; or for a
criterion naming a column, a validation rule or a resource.
-->
