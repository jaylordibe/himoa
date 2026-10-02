---
fixture: fixtures/laravel-api
graders: [ticket-discipline, evidence-discipline, scope-discipline]
tags: [ticket, write-ticket, multi-turn, refinement, state-retention, readiness-transition]
---

/himoa:write-ticket Release managers need to be able to withdraw a published app version so that clients stop being offered it. Deleting versions is a separate thing and must stay as it is.

<!--
What this case is for — Case G, the refinement that keeps everything it
already had, when most of the turns that carry it are short.

**The first turn** builds a working ticket with a story (the release manager
is human-supplied — the fixture's tests exercise this path as a system admin,
`FACT` with `path:line`, and the ticket says which the actor is), a scope
exclusion the human stated in so many words — the delete flow is out of scope
and unchanged — and criteria: a withdrawn version is no longer offered;
withdrawing an already-withdrawn version has a defined outcome; a caller who
cannot manage versions cannot withdraw one. The read finds `getLatest` on the
public route and the delete path on the authenticated one, cited. One question
blocks, owned by the human: what the latest endpoint returns when the newest
version is the withdrawn one. So the first turn is a clarification response —
that question, `Not ready` — and not the complete ticket.

**Turn 2** — "The latest endpoint should return the newest version that has
not been withdrawn." The answer becomes a criterion, and the run says which
identifier it became. It also opens a question the first turn could not see:
what the latest endpoint returns when **every** version for the platform is
withdrawn. That is a product decision, and the strong turn asks it rather than
deciding it. Still a clarification response.

**Turn 3** — "Then it answers the same way it does today when a platform has
no versions at all." The last blocker is resolved. The strong turn says all
blocking questions are resolved and the ticket is ready for review, and asks
once: "Would you like me to present the complete ticket now, or add more
details first?" It does not present the ticket in the same message.

**Turn 4** — "Present it." The complete ticket, at once, with no second offer.
It must hold, together:

- the delete-flow exclusion in **Out of scope**, word for word or better;
- every criterion from the first turn;
- both decisions, each as a criterion — the newest non-withdrawn version is
  returned; the all-withdrawn platform answers as today's empty platform does,
  with that current answer cited from the code or marked `UNKNOWN`;
- neither answered question still listed as open;
- identifiers that resolve — anything that cited the answered `Q` now cites
  the criterion it became;
- no section the ticket never earned — no **Dependencies**, no **Ideas from
  discussion** unless someone proposed one;
- `Ready`, and no claim that the ticket is final.

**Turn 5** — "One more thing: withdrawn versions must stay visible to release
managers in the version list, but not to anyone else." This introduces a
blocker after review: the authenticated list has one class of caller in the
code, and whether release managers are the system admins the tests use — and
so who "anyone else" is — is the human's to say. The strong turn returns to a
clarification response asking it, and does not re-present the ticket.

**Turn 6** — "Release managers are system admins." Readiness again, and the
offer once. **Turn 7** — "Yes." The presented ticket carries everything turn 4
held plus the list-visibility criteria and the actor now grounded as `FACT`.

**What the case is watching for.** State lost while the turns are short: a
presented ticket in turn 4 or 7 that is missing the exclusion, a first-turn
criterion, or either decision; an answered question still sitting in the table
beside the criterion it became; a renumbered identifier that leaves a dangling
citation. `ticket-discipline` automatic failure 5 covers each outright, and
this is the case that makes it visible: the loss can only be seen in the
presented ticket, so the case ends with one.

**A run scores 0.0** for dropping the exclusion, any first-turn criterion or
either decision in a presented ticket; for presenting the complete ticket in
turn 1, 2 or 5, or in the same message as the turn 3 offer; for asking the
offer again in turn 4; for deciding the all-withdrawn case or who "anyone
else" is rather than asking; for a criterion naming a status column, a flag, a
soft delete or a scope; or for declaring the ticket final.
-->
