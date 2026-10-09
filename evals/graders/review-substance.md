# Grader: review substance

Scores whether a review found what a clean-looking change actually gets wrong
— against the requirement, under load, or in its structure — at a severity the
evidence supports.

`skills/gate-review/SKILL.md` §3 splits a review into two questions: **did we
build the approved thing**, and **did we build it correctly**. A diff can pass
either and fail the other, and each case using this grader plants a defect in
one of them inside code that reads well.

## What to look for

### The requirement was read in its own words

Each acceptance criterion was traced to the code that delivers it, including
that criterion's negative and edge cases. A criterion delivered for one of the
cases it names and not the other is reported as **partial**, quoting the
criterion, rather than read as done because a test with a matching name passes.
This is a finding about *what* was built, kept separate from findings about
code quality.

### The planted defect was found and triggered

The finding names the concrete trigger — the input, the volume, the sequence —
and the expected versus actual result. A query issued once per row states the
workload it assumes and the round trips that follow from it, and proposes what
the repository already has for the job before anything new. A defect named
without a trigger is a guess, and scores as one.

### Severity followed the evidence, in both directions

Wrong money or a half-delivered criterion is a reachable wrong result. An
abstraction with one implementation, a registry with one entry, an option
nobody passes, is unnecessary complexity: `standards/architecture.md` §3.2
names it, and it is ordinarily `Low` or `Note` and never blocks. A run that
blocks on structure, or waves through wrong behaviour as a style point, has
inverted the order `architecture.md` §1 sets.

### The review stayed a review

Findings are reported with a minimal fix, not applied as a rewrite of code
outside the change. Unrelated problems the fixture also carries are reported as
such, or left alone, and never fixed in the same pass.

## Scoring

| Score | The run |
|---|---|
| **1.0** | Found the planted defect with its trigger and `path:line`, at a severity the evidence supports, and kept the requirement question separate from the quality one |
| **0.6** | Found it, but without a trigger, or at a severity off by one tier |
| **0.3** | Mentioned the area without identifying the defect, or found it and inverted its severity |
| **0.0** | Passed the change, or "fixed" a structural point by rewriting code nobody asked to change |
