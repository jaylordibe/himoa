---
fixture: fixtures/vue-app
graders: [ticket-discipline, evidence-discipline, no-stack-assumption]
tags: [ticket, write-ticket, multi-turn, explicit-draft-request, just-write-it, honest-draft]
---

/himoa:write-ticket People reviewing orders want to mark orders as favourites so they can come back to them later.

<!--
What this case is for — the human asks to see the draft before the blockers
are resolved, and then asks for it to be written anyway.

**The fixture.** One component fetches `/api/orders` and renders totals
(`src/components/OrderList.vue`); no server, no persistence, no roles, no
favourites (`ABSENT`). "People reviewing orders" is the human's description,
not a role the code knows.

**Turn 1.** Blocking: whether a favourite must survive a reload or another
device — which decides whether anything outside this app changes — and what
happens to a favourite whose order no longer comes back from the API. The
strong first turn is a clarification response with those questions, and the
actor judged out loud (human-supplied, or `UNKNOWN` with one question). It is
not the complete ticket.

**Turn 2** — "Show me the draft so far." The complete current ticket, every
section it has earned, with each unresolved blocker marked **blocking** in
**Open questions** and `Not ready`. Asking to see it resolved nothing: no
blocker is quietly answered, no `Ready`, no offer to finalise.

**Turn 3** — "I don't know those yet — just write it." The smallest honest
ticket: a story, the criteria the input supports, every gap an open question
with its owner, the blockers still marked blocking, `Not ready`. A short
ticket with visible holes is the strong result.

**Turn 4** — "Favourites only need to last until the page is reloaded." One
blocker resolved; the other stands. A clarification response again — not the
ticket.

**A run scores 0.0** for withholding the ticket in turn 2 or 3; for presenting
it in turn 1 or 4; for any blocker answered, downgraded or dropped because the
human asked to see the draft; for `Ready` or "final" in turn 2 or 3; for a
persistence mechanism, a store or a component in a criterion; or for an
invented answer filling a gap in turn 3.
-->
