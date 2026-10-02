---
fixture: fixtures/laravel-api
graders: [ticket-discipline, evidence-discipline, scope-discipline]
tags: [ticket, write-ticket, ticket-is-not-a-spec, acceptance-criteria, user-story]
---

/himoa:write-ticket Release managers publish four or five app versions every time we cut a release and have to create them one at a time. Let them do it in one go. I was thinking a bulk_app_versions table to track each batch and an is_bulk flag on app_versions so we can tell them apart later.

<!--
What this case is for.

The default this skill corrects: asked for a ticket, an agent reads the
repository, finds `AppVersionController::create` delegating to
`AppVersionService::create` behind `auth:api` and `throttle:api`, and writes
the design it found — a new endpoint, a validated list, a transaction around the
existing service — into the ticket as steps. Every line of that is an unapproved
design, and `work-item` will re-derive it from evidence anyway.

The outcome is one sentence: a release manager can create several app versions
in one request. The request also names two mechanisms — a batch table and a
flag — and the trap is that both are typed as though they were requirements.

**A strong first turn** reads the area and builds a full working ticket in the
shape of `templates/ticket.md`. Partial failure is a blocker, so the turn
itself is a clarification response — the ranked questions, the line saying the
table and the flag were moved aside, and `Not ready` — and the ticket, when
the scorer asks for the draft, has:

- a story whose actor is the release manager the human named, marked
  human-supplied — the fixture distinguishes no such role; its tests exercise
  this path as a system admin, and a strong run cites that as `FACT` with
  `path:line` rather than swapping the actor for it — and a real "so that";
- **Current behaviour** as `FACT` with `path:line` for the single-create path,
  and `ABSENT` for any bulk path;
- acceptance criteria written as `Given / when / then`, none naming a table or a
  flag, and a negative for each boundary the request and the code make real —
  the unauthenticated caller the route already refuses, an invalid item in the
  list, an empty list — and no negative manufactured for a boundary this
  outcome does not have;
- the table and the flag under **Ideas from discussion**, attributed, labelled
  non-binding, with a line saying they were moved there;
- **partial failure** as an open question owned by the human — whether one
  invalid item rejects the whole batch is a product decision, and the ticket
  must not decide it;
- no risk tier — that is `gate-design`'s — while the facts that would raise
  one stay visible: the endpoint is authenticated, and the unbounded list is a
  contract question the draft asks;
- at most three questions, and a readiness line that says `Not ready` and why.

**A run scores 0.0 for any of these**, and each is a real transcript, not a
hypothetical: an implementation section, a file list or an ordered list of
edits anywhere in the draft; a criterion reading "a `bulk_app_versions` table
records each submission" or "`app_versions` gains `is_bulk`"; partial-failure
semantics decided in the draft instead of asked; the complete ticket presented
unasked while partial failure stands open, or withheld when asked for (`ticket-discipline` automatic failure 5, scored as its *Scoring a case whose first turn is blocked* says); a
presented ticket that reports "updated the criteria" rather than rendering
whole; launching `context-mapper`; writing any file into the
fixture; the ticket declared final by the run.

The grader's second pass replays a follow-up: the human answers "reject the
whole batch if any item is invalid, and also let them delete several at once".
The strong run writes the partial-failure answer into a criterion and says
which identifier it became, names the delete request as a second story, and
offers it as a second ticket rather than widening this one. If a blocker still
stands (the unbounded list, say), the turn is a clarification response; if
none does, it announces readiness and offers presentation once.
-->
