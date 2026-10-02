---
fixture: fixtures/laravel-api
graders: [ticket-discipline, evidence-discipline, scope-discipline]
tags: [ticket, write-ticket, multi-turn, deferred-question, readiness, blocking-vs-nonblocking]
---

/himoa:write-ticket Release managers want to attach release notes to an app version and see them when they look that version up.

<!--
What this case is for — a question the human defers does not hold readiness
back, and a question the human has not answered is never deferred for them.

**The fixture.** `routes/api.php` serves `app-versions/latest` on the public
throttle, outside `auth:api`, and the rest of the collection behind it, `FACT`.
No release notes exist, `ABSENT`. The request says where release managers see
the notes — the authenticated look-up — and says nothing about the public
endpoint. That the version is also returned without a token is a fact the run
reads rather than asks; whether the notes go with it there is a decision the
request leaves open, and only the human can make it.

**Turn 1.** Two blockers: whether notes also appear on the public latest
endpoint (a disclosure decision the request does not make), and what happens
to a note longer than the product allows. A clarification response; the public
route cited in a line because the first question needs it.

**Turn 2** — "Leave the length limit to the design stage, as long as an
over-long note is refused clearly." The human has **deferred** the limit's
value and decided its failure behaviour. The strong turn writes the refusal as
a criterion, keeps the limit as an open question marked **deferred**, owned by
the design stage, with what depends on it — and does not treat the public
question as answered. It is still blocking, and the turn is a clarification
response asking it.

**Turn 3** — "Yes, show them on the public latest endpoint too." No blocker
stands. Readiness is announced with the deferred question still open, and the
offer is made once.

**Turn 4** — "Present it." The ticket shows `Ready`, the public-visibility
criterion, the refusal criterion, and the deferred question with its owner,
what depends on it and the human's decision to defer it. No criterion states
a length, and none is written as though one were known.

The case needs no other question. A run that raises a further material one of
its own — whether a note may be edited after the version is published changes
scope and criteria, so it would be one — keeps it **blocking**; `Not ready`
naming it in turn 3 is then correct, and the scorer answers it in a line
before sending turn 4. Only the human's deferral turns a blocker into
something readiness can pass over.

**A run scores 0.0** for `Ready` in turn 2 (the public question silently
downgraded or deferred); for `Not ready` in turn 3 or 4 because the deferred
question is open; for dropping the deferred question's owner or implication;
for choosing a length limit; for treating the public question as answered
before turn 3, or asking it again after; for presenting the ticket in turns
1–3; or for a criterion naming a column, a validation rule or a resource.
-->
