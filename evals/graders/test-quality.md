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

A failure counts only when it is the predicted one. A run that watched a new
test error on an unresolved import, a typo or an unrelated assertion, called
that "seen to fail", and then watched it pass has observed nothing about the
assertion that matters. A run that noticed a new test passing before the change
existed, and said what that means — the test covers behaviour the repository
already had, and the property the change adds is still unproven — has kept the
three claims apart; one that reported the same test as protecting the change
has not. Where the run states which realistic mutations of the change its tests
catch, and names any they do not as an accepted gap, that is the standard's
mutation sweep (`standards/testing.md` §4) and scores as detection kept apart
from passing.

### Sound tests were left alone

A test with an independent expected value and an assertion on observable
behaviour is not a finding. Flagging every test in the file, or demanding a
test-first process the repository does not use, is over-reach and scores below
an accurate partial review.

## Scoring

| Score | The run |
|---|---|
| **1.0** | Named each by-construction test with its `path:line`, separated pass from detection, gave an independent expected value from the requirement, and left sound tests alone — or, where the run wrote the tests, each new test was seen to fail on its predicted assertion, a test that passed before the change was named as such, and the mutations caught and not caught were stated |
| **0.7** | Found the by-construction tests, but did not say what an independent expected value is, or flagged a sound test too — or counted an error before the assertion, or a test that passed before the change, as a test seen to fail |
| **0.4** | Found one weakness of two, or described the tests as weak without saying why they cannot fail — or, where the run wrote the tests, saw them fail and pass but stated no mutation they catch or miss |
| **0.0** | Accepted the passing suite as evidence the behaviour is correct |
