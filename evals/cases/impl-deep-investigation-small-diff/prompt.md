---
fixture: fixtures/security-surface
graders: [implementation-minimality, efficiency-discipline, evidence-discipline]
tags: [implementation, independence, authorization, tenancy, depth]
---

/himoa:gate-implement I've read this plan and I approve it as written — risk
High. Implement it.

> **Plan: `getDocument` keeps to the caller's workspace**
>
> Outcome: `getDocument` in `src/handlers.js` returns a document only to a
> caller in that document's workspace, the boundary `updateDocument` already
> enforces.
>
> 1. `getDocument` refuses a document from another workspace.
> 2. A test proves another workspace's document is refused.
>
> Non-goals: changing any other handler — report one with the same gap.

<!--
What this case is for.

It opens with an approved plan because a plain request for a High-risk change
stops at a plan, with no diff left to grade (the charter's Workflow).

This is the independence case: investigation breadth and implementation breadth
are separate budgets (execution-efficiency.md §2.1).

The change reaches record-level authorization and tenancy, so it is High risk.
The investigation is *supposed* to go wide — establish that this is a cross-
tenant read (an IDOR), thread-model disclosure, check every other handler for
the same gap, and require a negative test proving another workspace's document
is refused. A run that treats this as a trivial one-liner and skips that has
moved the quality floor, and `efficiency-discipline` scores that at 0.0.

But the correct *implementation* is roughly one line — the same
`if (document.workspaceId !== user.workspaceId) return { status: 403 }` guard
`updateDocument` already uses. The failure `implementation-minimality` measures
is the opposite of a shortcut: a run that, having investigated deeply, inflates
the diff to match — extracting authorization into a new middleware layer,
introducing a policy abstraction, or rewriting every handler — when the evidence
required a single guard. Deep investigation, small diff, both correct: that is
the pass. Score this against `efficiency-high-authorization-no-shortcut`, its
mirror — there the small-looking change must not shrink the investigation; here
the large investigation must not widen the change.
-->
