# [Title — an actor and an outcome, one line]

- **Type:** Feature | Defect | Change | Operational
- **Source:** [request, conversation, incident, existing issue key, or "direct instruction"]

> Structure, not a form. Use the sections the ticket earns and **leave the
> rest out** — an empty heading reads exactly like a completed one, and a
> heading over "none" or "N/A" is a line the reader has to check that tells
> them nothing. Sections 1, 3, 4 and 5 are always present; 1b whenever its
> own presence condition holds; 2 whenever the read found something to cite or to mark
> `ABSENT`; 8 whenever a question is still open. Sections 6, 7, 9 and 10
> appear when there is something in them. Section numbers are stable
> identifiers — an omitted section leaves a gap in the numbering, so "§8"
> means the same thing in every turn. Write "none" only where the absence is
> itself a boundary the reader needs: *no existing caller may see a
> difference* is a requirement; *Dependencies: none* is a line.
>
> This is a **ticket**. It states a goal, the evidence that frames it and the
> outcomes that would prove it delivered. It does not contain a design: no
> implementation steps, no ordered list of edits, no file list, no schema, no
> chosen mechanism. The process flow in §1b is not an exception to that — it is
> the goal itself, told in order, and every step in it is something an actor or
> an outside observer can see (`standards/repository-evidence.md` §5). A
> mechanism anyone proposed lives in §9, labelled non-binding, and the design
> stage grades it like any other candidate. It does not contain an estimate
> either — how long the work takes is something only a design can say.
>
> Labels are the framework's — `FACT` with `path:line`, `INFERENCE`,
> `ASSUMPTION`, `ABSENT`, `UNKNOWN`. A gap stays visible as `UNKNOWN` until it
> is answered or deferred. It is never filled with the plausible option.
>
> A ticket carries **no risk tier**. The tier is `gate-design`'s decision, made
> from its own map and the repository's declared high-risk paths; a second
> copy written here could only disagree with it or anchor it. What makes a
> change risky — an authentication path, a public contract, stored data — is
> already in the ticket as the facts in §2 and §7, which is where the design
> stage reads it from.
>
> **Every item another line points at carries a literal identifier**: steps
> `S1`, `S2`, a branch `S3a`; criteria `AC1`; edge-case rows `E1`; open
> questions `Q1`. Write it as text at the start of the line, never as a
> markdown numbered list — a tracker renumbers or strips those on paste, and
> every "(S6)" in the ticket then points at nothing. The prefix keeps a step, a
> criterion, a row, a question and a section (`§6`) from sharing one bare
> number. An identifier is stable across turns: a removed item leaves a gap,
> and a new one takes the next free number.

## 1. Story

**As a** [the actor — one of exactly two kinds, and the draft says which:
a role, caller, operator or system the repository distinguishes, cited as
`FACT` with `path:line`; or an actor the human introduced as part of the
product behaviour they asked for, marked *human-supplied* and `ABSENT` from
the code today. Any other actor is invented; write `UNKNOWN` and ask],
**I want** [the capability, as the actor would say it],
**so that** [the benefit — real, stated, and not a mechanism].

## 1b. Process flow

Straight after the story: the story says who wants what and why in three
lines, and the flow then tells that goal in order. It is the line the developer
and the agent both come back to until the work is done, and it comes second
because a reader handed the steps before the goal has to finish them to learn
what they are for.

**When it is present — the one statement of the condition:** the order is
part of the outcome. The outcome passes through more than one observable state
before it is complete — a second actor or an external system has to act, a
state is pending before it is final, one step must happen before another — so
every criterion could pass on its own and the delivery still be wrong. One
actor making one observable change — a filter, a threshold, a label, a rename,
a constant, a form that saves — needs only the story and its criteria, and a
numbered flow there would only restate the story.

Steps start to finish, each one line: **actor or system → action → what
can then be observed**.

- **S1.** [actor] [does what] — [what they, or anyone outside the system, can now see]
- **S2.** [the system or an external party] [responds how] — [the state that
  results, including what is *not* yet true: hidden from another actor,
  pending, not final]
- **S2a.** [the branch] — [what is observed instead]
- **S3.** …

- **The last step is the end state** the ticket exists to reach, so the title
  and the flow together say what the work is for before any criterion does.
- **Order a boundary imposes** is part of the flow: a call that must come
  before another, a state that settles later and must be re-read, a party that
  has to answer before the next step.
- **Branches** — a refusal, a failure, an abandonment, a timeout — are written
  where they leave the main line ("S3a. The card is declined — no request
  reaches the vendor") and settled in §5 or §6.
- **Steps carry identifiers so the rest of the ticket can point at them.** A
  criterion or an edge case names the step it proves ("S4"); a step no
  criterion or edge case covers is a gap in the ticket, not in the design.
- **A step states the event, not its rules.** The conditions, exceptions and
  guarantees around a step — what wins, what is kept, what is never
  overwritten — are criteria, and they are written once, in §5. A step that
  needs a second sentence is carrying a criterion; move it. The flow is read
  for its order, and a step that restates its criteria buries the order.
- **No mechanism and no screen layout**, per `standards/repository-evidence.md`
  §5, which owns what counts as either. A step that can only be written by
  naming one is split: the observable result stays here, the rest goes to §9.
- For a **defect**, this is the *intended* flow, with the step where the
  observed behaviour departs from it marked — an observation, not a cause.

## 2. Current behaviour

What happens today, from the actor's side, each claim labelled.

- `FACT` [what the code does] — `path:line`
- `ABSENT` [what does not exist today, and where you looked]
- `UNKNOWN` [what could not be determined, and what it would take]
- `FACT` [the declared high-risk path the outcome reaches, where it reaches
  one] — the repository's `AGENTS.md:line`

Each pointer sits once, beside the claim it supports. The ticket keeps no
second list of them: a separate list of the same `path:line`s is a copy that
drifts when one side is corrected, and the design stage is handed this
section.

For a **defect**: the observation kept whole — the failing output, the trace,
the reproduction steps, how often. The reporter's cause, if any, written as a
hypothesis and labelled as one. A cause the read suggests is an `INFERENCE`
with its `path:line`, not a root cause: proving it is the design stage's job,
in the order `${CLAUDE_PLUGIN_ROOT}/skills/domain-debugging/SKILL.md` owns.

## 3. Problem

Why the current behaviour is not enough, in the actor's terms. No solution
words. One paragraph.

## 4. Scope

**In scope**

- [the outcomes this ticket delivers]

**Out of scope**

- [the adjacent thing a reader might assume is included, and is not]
- [the adjacent gap the read found, which is real and was not asked for]

## 5. Acceptance criteria

`Given <state>, when <actor acts>, then <observable outcome>`. One
independently verifiable outcome per criterion — "and" is a reason to look,
not a reason to split; two outcomes that could pass or fail apart are two
criteria, one invariant stated in two halves is one. Checkable from outside
the system. No mechanism. Where §1b exists, each criterion names the step or
branch it proves, so a step with nothing proving it shows.

- **AC1.** Given [state], when [actor does X], then [what the actor can observe]. (S2)
- **AC2.** Given [the same], when [the caller the outcome excludes does X], then [what they observe instead]. (S2)
- **AC3.** Given [the same], when [the input is unsupported | X is repeated | the state is invalid], then [the outcome]. (S2a)

> AC2 and AC3 are the shape of a negative, not a quota. A boundary the
> request or the repository makes real — the caller who is not permitted, the
> input that is not supported, the invalid state, the repeat, the excluded
> scope, the failure the actor would notice — gets its criterion. A boundary
> nothing supports is not invented to give a positive line a partner. Where it
> is unclear whether a boundary exists, that is a question for §8.
>
> The test for the set: two competent engineers build two different designs
> and both pass every criterion. Would the human accept either? If not, a
> requirement is missing.

## 6. Edge cases and failure behaviour

Only when the outcome has boundaries the criteria do not already settle. Rows
for the situations this outcome actually has — not one per template
suggestion. Where a row is unknown, it is an open question, not a blank.

| # | Situation | Expected behaviour | Status |
|---|---|---|---|
| E1 | [invalid input, caller not permitted, empty set, partial failure mid-way, repeated or concurrent attempt — whichever of these the outcome can meet] | | decided / open question Q1 |
| E2 | [the situation specific to this outcome] | | |

## 7. Contract and data touchpoints

Only when a consumer or a stored record could **observe** something changing.
State it as an outcome. A schema, a field name or a payload shape is an idea
and goes in §9.

- **Consumers:** [who could see a difference — a client, an integration, a
  report]
- **Persisted:** [what must survive and for how long, as a requirement]
- **Compatibility:** [what must keep working for existing callers during and
  after the change]
- **Sequence:** [when a consumer must act in order, or a response is not the
  final state — say so here and keep the steps themselves in §1b, which is
  where the reader starts]

## 8. Open questions

Only while a question is open. Each with an owner and what depends on the
answer. **Blocking** means a criterion changes with the answer; **deferred**
means the human has chosen to let the design stage decide, and that choice is
recorded here. A question the human answered becomes the criterion, scope
line or fact it was asking about, and leaves this table.

| # | Question | Owner | Depends on it | Blocking / deferred |
|---|---|---|---|---|
| Q1 | | | [the AC, E row or step whose answer changes] | |

## 9. Ideas from discussion — non-binding

Only when someone proposed a mechanism. Every one, kept so it is not lost and
so it is visibly not a requirement. The design stage grades each one. A
mechanism the human declared contractual in so many words is not an idea — it
is a criterion, with the sentence in which they said so.

- [the flag, the table, the module, the library someone named — attributed]

## 10. Dependencies and sequencing

Only when one exists.

- [another ticket, an external party, data that must exist first, a rollout
  order the product needs, a feature flag]
