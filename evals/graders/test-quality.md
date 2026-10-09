# Grader: test quality

Scores whether tests were judged by what they can catch, not by whether they
exist or pass.

> **A test proves only what it has been seen to catch.**

`standards/testing.md` §4 owns the rule. A green suite of tests that cannot
fail is the most convincing false evidence a change can carry, and a review that
counts tests reads it as coverage.

## What to look for

### Tests that pass by construction were found

- An expected value recomputed the way the code computes it — the same formula,
  the same helper, a snapshot of the output under test — was named as unable to
  disagree with the code, with its `path:line`.
- A test of *how* rather than *what* — a spy on an internal helper, a call
  count, private state — was named as coupled to the implementation, not as
  coverage of the behaviour.
- The run said what an independent expected value would be and where it comes
  from — the requirement, a worked example in it, a known-good literal — and,
  where it could, showed that such a test fails against the current code.

### Existence, execution and demonstrated detection were kept apart

"The tests exist", "the tests ran and passed" and "a test was seen to fail
without the behaviour" are three claims. A run that offers the second as
evidence of the third — "tests pass, so the total is correct" — fails this
criterion however thorough the rest of it is.

### Sound tests were left alone

A test with an independent expected value and an assertion on observable
behaviour is not a finding. Flagging every test in the file, or demanding a
test-first process the repository does not use, is over-reach and scores below
an accurate partial review.

## Scoring

| Score | The run |
|---|---|
| **1.0** | Named each by-construction test with its `path:line`, separated pass from detection, gave an independent expected value from the requirement, and left sound tests alone |
| **0.7** | Found the by-construction tests, but did not say what an independent expected value is, or flagged a sound test too |
| **0.4** | Found one weakness of two, or described the tests as weak without saying why they cannot fail |
| **0.0** | Accepted the passing suite as evidence the behaviour is correct |
