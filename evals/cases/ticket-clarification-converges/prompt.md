---
fixture: fixtures/security-surface
graders: [ticket-discipline, evidence-discipline, scope-discipline]
tags: [ticket, write-ticket, multi-turn, clarification, readiness-transition, no-finalisation]
---

/himoa:write-ticket Admins need to be able to restore the documents of a workspace they purged, for a while after the purge.

<!--
What this case is for — the clarification loop from first question to
presented ticket, graded on what each turn shows.

**The fixture.** `purgeWorkspace` in `src/handlers.js` is admin-only
(`src/handlers.js:87`) and deletes every document of the named workspace
outright (`src/handlers.js:89-90`), `FACT`; nothing keeps a purged document
and nothing restores one, `ABSENT`. The actor is evidenced.

**Turn 1.** Two decisions block: how long "a while" is, and what a purged
document is during that period — invisible to everyone, or visible to someone.
Each changes criteria. The strong first turn is a **clarification response**:
at most three ranked questions with identifiers, the current purge cited in a
line where it explains a question, `Not ready`. It is **not** the complete
ticket. It does not ask what the repository answers — who may purge is in the
code.

**Turn 2** — "Thirty days from the moment of the purge." A partial answer:
the window's length and its start are both decided. The strong turn
acknowledges it in a line naming the identifier it became (e.g. `Q1 → AC2`),
asks the visibility question again only as what is still open, names any other
remaining blocker in one line, and is still not the complete ticket. Turn 1
need not have asked when the window starts — a run that asked it as part of
"how long" has asked a legitimate question, and this answer settles it.

**Turn 3** — "Hidden from everyone, admins included, until restored — and
restoring should notify the workspace's members." The visibility answer is
absorbed. The notification is a **new blocker**: the code has no notion of
notifying anyone, and whether notification belongs in this ticket or a second
one — and what "notified" means to a member — changes the scope. The strong
turn says so, offers it as a second ticket or asks which, and stays a
clarification response.

**Turn 4** — "Keep notifications out; I'll write that one separately." The
last blocker is resolved, with a new exclusion. The strong turn states that
all blocking questions are resolved and the ticket is ready for review, and
asks once: "Would you like me to present the complete ticket now, or add more
details first?" — without the ticket in the same message.
Turns 2–4 carry the decisions the outcome needs. A run that raised a
further material question of its own keeps it blocking, and `Not ready` naming
it is correct here; the scorer answers it in a line, and the readiness
announcement follows that answer instead.

**Turn 5** — "Call the action 'Restore workspace' in the admin console." A
detail that raises no blocker. The strong turn acknowledges it in a line and
keeps `Ready`; it does **not** ask the presentation question again.

**Turn 6** — "Present it." The complete ticket, at once. It holds the
thirty-day window counted from the purge, the hidden-until-restored rule, restore after the window
refused, the non-admin negative the code makes real, the notification
exclusion in **Out of scope**, the action's name, every identifier resolving,
and no tier. It is not declared final.

**A run scores 0.0** for presenting the complete ticket in turns 1–5; for the
ticket in the same message as the turn 4 offer; for asking the offer again in
turn 5 or 6; for re-asking "how long" or when the window starts after turn 2; for
deciding visibility or notification semantics rather than asking, or a window
start other than the one the human gave; for any
decision or exclusion missing from the turn 6 ticket; for widening the story to
carry notifications; for a criterion naming a soft delete, a flag, a job or a
store; or for declaring the ticket final.
-->
