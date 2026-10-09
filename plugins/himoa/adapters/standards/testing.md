<!-- GENERATED from plugins/himoa/standards/testing.md by tests/validate-adapter-projection.mjs (himoa 3.13.1). DO NOT EDIT. Edit the canonical source and run: node tests/validate-adapter-projection.mjs --write -->

# Testing standard

Generic expectations for tests the framework writes, asks for, or judges. The
consuming repository's test topology is authoritative: discover it before
prescribing anything.

## 1. Discover the topology before writing a test

Establish, from the repository:

- the test runner and how it is invoked, including any filtered form;
- where each kind of test lives, and the naming convention that makes the
  runner find it;
- what a test needs before it can run — services, fixtures, seeded data,
  environment configuration;
- **who owns destructive setup**, and against which store. A suite that
  recreates a database must own a database that exists only for tests;
- whether the suite runs in parallel, and what isolation each worker gets.

If tests run in parallel, **no test may assume exclusive access to anything
outside its own worker's isolated state**. This is the single most common
source of a suite that passes alone and fails in CI.

Never point a test at development or production data, and never reset a store
the developer is using.

## 2. Layers

Choose the cheapest layer that can actually prove the thing:

| Layer | Proves | Use when |
|---|---|---|
| **Unit** | A pure rule, transform or calculation | The logic is decidable without I/O |
| **Integration** | That real components agree — validation, serialisation, persistence, authorization, transactions | The contract *between* layers is what can break |
| **End-to-end / contract** | The externally observable behaviour a consumer depends on | The change touches a public contract |
| **Property or fuzz** | Invariants across generated input | The input space is large and the invariant is crisp |

A rule this framework holds firmly: **do not mock the thing under test.**
Mocking the persistence layer to test a persistence-dependent behaviour proves
only that the mock was configured to agree with the assertion.

## 3. Required scenarios

Cover each of these that the change makes reachable. A risk with no test mapped
to it is an accepted risk, and must be stated as one rather than left implicit.

- the success path;
- validation failure, including the exact error detail a consumer parses;
- the stable error identifier and result shape;
- unauthenticated, insufficient permission, and another actor's or tenant's
  record;
- not-found versus forbidden disclosure behaviour;
- sensitive fields excluded from the response;
- audit or provenance records written with the right actor;
- soft-deletion, archival or other lifecycle visibility rules;
- concurrent updates to the same record;
- duplicate delivery, replay and idempotency;
- retry exhaustion and terminal failure handling;
- dependency timeout and failure;
- pagination boundaries and deterministic ordering;
- time-zone, date boundary and daylight-saving behaviour;
- monetary rounding and currency handling;
- backward compatibility of a changed contract;
- sensitive resources not retrievable through the deployed public surface, when
  the change reaches it (`security.md` §11);
- a regression case reproducing any defect that was fixed.

## 4. Quality

Reject, in your own tests and in review:

- assertions weak enough to pass on the wrong value — truthiness on an object,
  "not null", a bare status check where the body is the contract;
- an expected value derived the way the code derives it — the same formula, the
  same helper, a snapshot generated from the output under test — so the test
  passes by construction and cannot disagree with the code. Expected values
  come from a source independent of the implementation: the requirement, a
  worked example, a known-good literal;
- a test of *how* rather than *what* — asserting that an internal collaborator
  was called, a call count or order, private state, or reading the outcome back
  through a side channel the public interface could show. It breaks on a
  correct refactor and passes a wrong result. Substitute only what the test
  cannot own — a remote service, time, randomness — unless the repository's
  own convention says otherwise;
- uncontrolled time, randomness, network or ordering;
- arbitrary sleeps standing in for synchronisation;
- a new test added beside a stale one asserting the old behaviour — update the
  existing assertion instead;
- focused or skipped tests committed;
- broad snapshots that absorb a contract change without anyone noticing;
- tests that depend on execution order or on another test's leftovers;
- a coverage percentage presented as proof of anything.

Tests are part of the change, not a follow-up. A behaviour change whose test
was not updated is an unfinished change.

### A test proves only what it has been seen to catch

Three claims, never merged: a test **exists**; it **ran and passed**; it **was
seen to fail** while the behaviour it protects was absent or wrong. Only the
third shows it can detect anything. Where a change owes a test, get that
observation the cheapest way the work allows — run the test before the code
that satisfies it, or break or revert that code once green and watch the test
fail. **Break or revert it in a copy outside the worktree** — a temporary
directory, or a second worktree — never by stashing, resetting, checking out or
copying over a file in the developer's worktree, which holds their work as
well as yours. Building in thin vertical slices — one behaviour's test, then the code
that passes it — produces the observation as it goes and suits logic behind a
clear interface; it is one way to get it, not a required process. Where it was
not observed, the report says so: "added and passing, not seen to fail" is an
honest line, and the reader weighs it.

### A negative exposure test proves absence of content, on the path that ships

A test that a sensitive resource is not retrievable is worth what it asserts and
where it runs:

- **It asserts that no sensitive content came back, not a status.** A fallback
  page or catch-all route answers with success and no secret; a redirect can
  lead to the content; a not-found can come from a layer production does not
  use. Follow redirects and judge the body. The invariant is that nothing
  sensitive is returned — not-found is often preferable, since it confirms
  nothing, but no single status is required.
- **It exercises the layer production traffic crosses.** A request to the
  application server says nothing about a proxy, edge or static root in front of
  it; the verdict is scoped to the layer it reached (`evidence.md` §2).
- **It runs against what ships.** An artifact built differently for tests — files
  excluded, another root, another configuration — proves nothing about the
  production one.
- **Its paths come from this repository** — its files, its framework's
  diagnostic routes, its deployment layout — never from a generic scanner list.

## 5. Evidence

Every reported run states the exact command, the filter or scope, the result,
and the environment. Report results in the vocabulary of
`standards/evidence.md`: `PASS`, `FAIL`, `BLOCKED`, with scope on the verdict
line.

The normal minimum for a change is: the repository's build or type check, its
lint check, the affected unit tests, and the affected integration or end-to-end
tests — **whichever of those this repository actually has.** A repository with
no linter is a normal repository; mark the absent gate `N/A` with the evidence
that it is genuinely absent, not `BLOCKED`. Running the full suite follows the
repository's own cadence, typically when a unit of work is complete or when the
user asks.

Skipped, partial, blocked or flaky is never `PASS`.
