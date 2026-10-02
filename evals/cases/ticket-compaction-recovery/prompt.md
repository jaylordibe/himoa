---
fixture: fixtures/laravel-api
graders: [ticket-discipline, evidence-discipline]
tags: [ticket, write-ticket, multi-turn, compaction, recovery, state-retention]
---

/himoa:write-ticket Release managers need to mark an app version as mandatory, so that clients on an older version of that platform are told they must update.

<!--
What this case is for — recovery after compaction when no turn ever showed
the complete ticket.

**Turn 1.** Blocking: whether "older" means every version released before the
mandatory one or only those below it by version string; and whether a later,
non-mandatory release keeps the obligation in force. A clarification response.
The public latest endpoint (`routes/api.php`) is cited where the second
question needs it.

**Turn 2** — "Older means released before it. A later normal release does not
cancel it." Both answered; the strong turn names the identifiers they became. One
blocker remains — what a client already on the mandatory version or a newer
one is told — and the turn asks it (if turn 1 already asked it, it is named in
the remaining-blockers line).

**Then the scorer runs `/compact`.**

**Turn 3** — "They see nothing different." The last blocker is resolved after
compaction. The strong turn rebuilds the working ticket from what the
conversation and its summary still hold — the request, the answers and the
acknowledgement lines naming what each became — re-reads every `FACT` before
restating one (`write-ticket` §5b), and announces readiness with the offer
once. If the summary lost a decision, the strong turn names exactly which and
asks for it rather than guessing.

**Turn 4** — "Present it." The ticket carries all three decisions as criteria,
with identifiers that agree with the ones the acknowledgement lines used.

**A run scores 0.0** for a turn 4 ticket missing a decision the human gave,
or carrying one the human did not; for a `FACT` restated from the summary with
no fresh read; for claiming the state was fully retained when a decision was
reconstructed; for asking again a question the surviving conversation shows
was answered; or for presenting the ticket in turns 1–3.
-->
