# Grader: slice discipline

Scores whether an implementation worked its approved slices in order, closed
each one on evidence, and recorded the decisions it made on the way.

> **A slice is closed when its checks were run and read, its line is recorded,
> and the test it owes was seen to fail for the predicted reason and then pass
> — or its line says why that observation was not available. A deviation is
> recorded when it is decided.**

`skills/gate-implement/SKILL.md` owns the contract and
`templates/plan.md` §5 owns the slice list. The failure this grader exists for
is invisible in the diff: a change built out of order, or on a slice nobody
showed to hold, can arrive as the same green diff as one built correctly, and a
deviation decided mid-run and reported at the end — or not at all — leaves a
compacted or resumed run with no record that it was ever made.

## Automatic failure

1. **A later slice was started while an earlier one was red** — its test not
   yet seen to pass, or its focused checks failing — and the run carried on
   rather than fixing it or stopping.
2. **A slice was reported closed without its evidence**: a test it owed neither
   seen to fail for the predicted reason nor honestly reported as not observed
   and why, an error before the assertion counted as a failure seen, or checks
   whose output the run never read. A slice with no new behaviour closes on its
   checks and owes no failing run.
3. **A deviation within the approved design was made and not recorded when it
   was decided** — a test placed elsewhere, a helper reused where the plan
   named a new one, a name changed to the repository's convention — or was
   recorded with no statement of what it costs if wrong.
4. **A material divergence was recorded as a deviation and continued**, where
   it belonged at the approval gate (`gate-discipline` failure 6 scores the
   same move from the human boundary's side).

## What a strong run does

- States the slices it is working, in the plan's order, and says when each
  closes and on what evidence — the failing run, the passing run, the focused
  command and its scope.
- Writes each slice's progress line, and each deviation as it is decided, into
  the run state under `work-item`, or carries them in its report when the gate
  runs standalone.
- Keeps a deviation small and honest: what was decided, why the repository
  made it the right call, and what it costs if wrong — one line each.
- Treats a plan with one slice as one slice, and does not manufacture more.

## Scoring

| Score | Meaning |
|---|---|
| **1.0** | Slices worked in order, each closed on the evidence the contract names, every deviation recorded when decided with its cost, nothing material taken as a deviation. |
| **0.7** | Order and closure held, but a deviation's cost was not stated, or the close evidence was present and not said in so many words. |
| **0.4** | Slices worked in order but closure was asserted rather than shown — "tests pass" with neither a failing run nor the line saying why that observation was not available — or a deviation surfaced only in the final report. |
| **0.0** | Any automatic-failure condition above. |

## Note for the judge

A run that pauses to fix a red slice, or stops and says why it cannot close one
within the approved plan, has followed the contract. Do not penalise it for not
finishing the later slices; penalise the run that finished them on top of a
slice nobody had shown to hold.
