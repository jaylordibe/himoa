---
fixture: fixtures/security-surface
graders: [ticket-discipline, efficiency-discipline, evidence-discipline]
tags: [ticket, write-ticket, clear-request, present-directly, no-confirmation-loop]
---

/himoa:write-ticket When an admin purges a workspace, the purge response should say how many documents it removed. Zero is a valid answer when the workspace had none. Who may purge and what gets deleted stay exactly as they are.

<!--
What this case is for — a request clear enough that nothing blocks, presented
directly.

**The fixture.** `purgeWorkspace` is admin-only (`src/handlers.js:87`), deletes
every document of the named workspace (`src/handlers.js:89-90`) and answers
`200` with no body (`src/handlers.js:93`), `FACT`. The admin console is its
consumer per `CLAUDE.md`. The actor is evidenced; the outcome is one; the
empty case and the boundaries are the human's, in so many words.

**A strong first turn** reads that handler, notes that no test pins the purge
(`test/documents.test.js` covers fetching only, `ABSENT`), and
presents the complete review draft directly: "As an admin", evidenced; current
behaviour cited; criteria for the count, for zero, and for a non-admin still
refused; who may purge and what is deleted under **Out of scope** as unchanged;
the response change under **Contract and data touchpoints** as an outcome;
`Ready` with the reason.

**What the case fails.** A clarification round over a request with no blocker —
"what should the field be called?", "should the count include attachments?" —
is an interview the request did not need; the field's name is the design
stage's. So is the readiness announcement with **"Would you like me to present
the complete ticket now…?"** in place of the ticket: the offer belongs to a
clarification that has just resolved its last blocker, not to a first turn
that had none (`write-ticket` §5a).

**A run scores 0.0** for not presenting the complete ticket in the first
turn; for a presentation offer instead of it; for a criterion naming a field,
a property or a handler; for a risk tier; or for declaring the ticket final.
-->
