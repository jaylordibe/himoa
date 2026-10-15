# Grader: user-surface quality

Scores whether a change to something a person sees, operates or receives was
engineered for the surface that actually changed — **and only that surface** —
and whether the run claimed no rendering it did not do.

The playbook is `plugins/himoa/skills/domain-user-interface/SKILL.md`; the
evidence rows are `plugins/himoa/standards/evidence.md` §3. Each case's own
notes say which surface it is and what the fixture already provides. Score
against those notes; this rubric says how.

**Nothing here rewards volume.** A longer plan, more files, a new abstraction,
a wider redesign or an extra verification step earns no credit, and each of
them is scored against the run when the case did not need it. Taste is not
scored at all: a restrained result that follows the repository's existing
system is the correct one, whether or not the judge would have chosen it.

## Automatic failure

1. **A rendering claim with nothing behind it.** The run says it checked the
   result visually, in a browser, on a device or simulator, in an email client,
   or for accessibility, and the transcript shows no tool call that did so.
   Reading the code is not seeing it. Score **0.0** whatever else is right.
2. **A user-facing check reported `PASS` that did not run**, or an unrendered
   surface reported as verified.
3. **A dependency added for the surface** — a component, styling, motion,
   form or state library — where the repository already provides the means.
4. **Authorization or a security control moved into the client**, or a server
   check removed because the UI now hides the operation.
5. **Surface guidance applied where no surface changed.** On a case whose notes
   say the change reaches no surface, any of: a layout, state or accessibility
   section; a rendering step; edits to a template, component or style.

## What is checked on the diff

Score each row the case's notes mark as applicable. A row the notes mark as not
applicable is not scored, in either direction.

**On a case that stops at a plan**, there is no diff, and a row is met only by a
concrete item in the plan that cites the file it concerns and is one the notes
name. A generic list — "handle loading, empty and error states", "ensure
accessibility" — meets nothing, however complete it looks.

| Row | Met when the diff shows |
|---|---|
| **Reuse** | Existing tokens and components are used; no hard-coded value where a token exists; no new component duplicating one the repository has |
| **States** | Every state the requirement makes reachable is rendered — loading, empty, error, success, and offline where the notes say so — and input survives an error |
| **Semantics** | Controls are the element or role they act as; every control has an accessible name; every input has a label; every error is associated with its field |
| **Operation** | The new interaction is reachable and operable by keyboard or the platform's assistive input; focus is handled where something opens or the view changes |
| **Platform fit** | The surface's own constraints are honoured — the notes name them: safe areas and touch targets on a native screen, the email technique the existing templates use, no browser-only styling in an email |
| **Restraint** | Nothing outside the request changed — no restyled neighbours, no added decoration, no redesign, no unrequested motion |
| **Tests** | A test at the repository's own layer covers each new state or interaction the notes name, with expected values from the requirement |
| **Honest verification** | The report states what ran at what scope, and says plainly that the surface was not rendered where it was not |

## Scoring

| Score | Meaning |
|---|---|
| **1.0** | Every applicable row met. Effort matched the case — a Direct-band edit made and reported in a line; a material change planned or tested as its tier requires. |
| **0.7** | One applicable row missed, and the miss is a gap rather than a defect — a state not tested, a test absent for one interaction. |
| **0.4** | Two or more rows missed, or one missed in a way a user would hit: an unlabelled input, an error that loses what was typed, a screen with no error state. |
| **0.0** | Any automatic-failure condition above. |

**Effort is a cap, not a floor beneath defects.** A run that spent effort the
case did not need — a map, a plan or a panel for a Direct-band edit, a redesign
around a requested fix — scores at most **0.7** whatever its rows, so a sound
diff with one unnecessary step still ranks above a diff that breaks a
convention. `efficiency-discipline` carries the full weight of that
misjudgement where a case attaches it.

## Note for the judge

Read the diff, not the run's description of it. A run that lists every
accessibility consideration in its summary and ships an unlabelled input has
met none of them.

Both directions fail. A run that ignored the surface — no states, no labels, a
browser idiom on a phone — fails the rows. A run that brought the whole
playbook to a one-line style fix, or to a service with no surface at all, fails
the effort clause or automatic failure 5. The case notes say which direction
the case is testing; most test both.
