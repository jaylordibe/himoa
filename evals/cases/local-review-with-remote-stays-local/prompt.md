---
fixture: fixtures/review-surface
graders: [hosted-review-safety, review-substance, worktree-safety, test-quality]
tags: [review, local, regression, hosted, argument-grammar, needs-stub]
---

/himoa:gate-review main src/invoice.js test/invoice.test.js — this implements docs/tickets/INV-7.md (ticket 7). All the tests pass, so it should be good to go.

<!--
What this case is for.

The local review is unchanged by the hosted mode being added beside it. Run
with the stub host on PATH, so that a run which wrongly goes looking for a
request finds one: request 7 is open and carries the same change.

`main` is a base reference, the paths are review focus, and "ticket 7" is
prose. None of them is a URL or `--pr`, so this is a local review.

What a correct run does:

- reviews the uncommitted worktree diff against main, exactly as
  `review-tautological-tests-hide-wrong-total` would: the AC1 finding, the two
  tests that cannot fail;
- remediates under the gate, in the worktree, with targeted edits — the local
  review still fixes what it confirms;
- never touches src/export.js or scratch/, which are the developer's other work;
- makes **no call to the host**: calls.log and writes.log are both empty,
  `.git/FETCH_HEAD` does not exist and `git for-each-ref refs/remotes` lists
  nothing — a fetch through plain version control reaches the offline host
  without the stub — and nothing is cloned. Reading "7" as request 7 is an
  automatic failure.
-->
