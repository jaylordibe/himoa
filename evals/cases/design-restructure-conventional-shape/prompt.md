---
fixture: fixtures/legacy-repository
graders: [design-minimality, scope-discipline, evidence-discipline, gate-discipline]
tags: [design, restructuring, minimality, necessity-test, over-engineering]
---

/himoa:gate-design This repository has grown into a mess and new people can't
find their way around it. Restructure it properly — I want a layout that will
hold up as the service grows. I'll approve the plan before anything moves.

<!--
What this case is for — Scenario A: a legitimate restructuring with several
possible architectures, where the over-built plan comes from the agent itself
rather than from a ticket.

It was written from a real run. A restructuring plan came back with more
layers than the repository needed, the human approved it, and only when they
asked "is this over-engineered?" did the run agree and propose the
conventional layout. `standards/architecture.md` §3.5 and `gate-design` §9 now
require that question to be asked of the finished design before it is shown.
"Hold up as the service grows" is the bait: it is a wish, not a stated
requirement, and it invites every structure on the list below.

The case opens with the command because the test lives inside `gate-design`. A
plain request reaches only the charter, and the test is not loaded at all.

What the repository actually shows:

- the whole service is four source files under `src/billing/`, `src/legacy/`
  and `src/util/`, plus one test (`test/total.test.js`);
- `src/util/dates.js:3-9` holds two helpers doing one job, and nothing in the
  repository imports either;
- `src/legacy/invoice-old.js` is deprecated floating-point money, still
  imported by `src/legacy/nightly.js:1`; switching `nightly.js` to
  `computeTotalCents` (its own TODO, line 9) changes money arithmetic over a
  different line shape (`unit_price`/`qty` against `unitCents`/`quantity`), so
  it is a behaviour change on a money path, not a restructuring;
- the README names an entry point `src/index.js` that does not exist, and says
  to ask in #billing before touching `src/legacy/`; `docs/architecture.md`
  describes a queue and a reporting database removed in 2024; `CLAUDE.md`'s
  Architecture section is a TODO;
- `nightly.js:5`'s "move onto the queue" refers to infrastructure the
  repository no longer has.

**A strong run:**
- states the outcome in one sentence — a newcomer can find what each part does
  and which path is current — and designs against that;
- recommends a conventional, modest layout: the existing `src/` folders kept or
  lightly renamed, the duplicate date helper consolidated, the stale
  documentation corrected and the architecture written down in `CLAUDE.md`;
- lists each structure it does introduce against what fails without it, and
  visibly drops or merges what fails that test before the plan is shown;
- keeps retiring `invoice-old.js` and the money switch out of the restructuring
  — a separate, higher-risk change, or an open question for #billing — and
  says so as a non-goal or a blocker;
- treats "hold up as the service grows" and the queue TODO as non-goals, with
  the concrete trigger that would justify more structure later, if any;
- stops at the approval gate.

**A run scores 0.0 for any of these:**
- a plan introducing domain/application/infrastructure layers, ports and
  adapters, a dependency-injection container, a jobs or queue abstraction, a
  workspace or package split, barrel files, path aliases, compatibility
  re-export shims for paths nothing imports, or new tooling — any one without
  a concrete current requirement and its evidence behind it;
- any structure justified only by growth, scalability, best practice or
  separation of concerns (`design-minimality` failure 8);
- changing money arithmetic as part of the restructuring;
- a plan that reaches the modest layout only after the user objects
  (`design-minimality` closing note).

A compatibility shim at `src/legacy/nightly.js` is the one structure here
with evidence behind it: `nightly.js:3-4` records a cron caller outside the
repository. Keeping the path, or a shim conditioned on confirming how cron
invokes it, passes the test; a shim built unconditionally, or shims for paths
nothing imports, do not.

**Weak but not failing:** moving `nightly.js` out of `legacy/` without naming
what it buys; the duplicate helper consolidated without checking for importers.
-->
