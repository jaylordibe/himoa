<div align="center">

# Himoa

### An evidence-driven software engineering workflow for coding agents — on any stack, in any repository.

```text
Understand → Design → 🧑 Approve → Implement → Review → Validate → 🧑 Ship
```

**Investigate deeply. Build minimally. Prove every claim. Keep the human in control.**

[![License: MIT](https://img.shields.io/badge/License-MIT-3b82f6.svg)](LICENSE)
[![Agents](https://img.shields.io/badge/Agents-Claude·Codex·Cursor·Copilot·Gemini-8b5cf6.svg)](#supported-agents)
[![Stack](https://img.shields.io/badge/Stack-agnostic-22c55e.svg)](#what-ships)

[Quick start](#quick-start) · [Workflow](#how-a-change-flows) · [Risk](#risk-decides-the-rigor) · [Review](#independent-review-lenses) · [Evidence](#evidence-not-claims) · [Human control](#where-the-human-stays-in-control) · [Agents](#supported-agents) · [Docs](#documentation)

</div>

---

Himoa is a plugin that gives a coding agent the working method of a careful
senior engineer. Before it changes your code it maps what your repository
actually is; it designs, then **waits for your approval**; it implements only
what the requirement needs; it reviews the diff through independent, read-only
review lenses chosen by risk; it validates with your repository's own commands;
and it hands you the diff and the evidence. **You commit. You ship.**

It is not a prompt pack. Two things own different halves:

- **Himoa owns the methodology** — the workflow, the risk model, the review and
  validation discipline, the evidence rules and the human-approval boundary.
- **Your repository owns the truth** — what the system is, how it is built and
  how it is verified, stated once in [`AGENTS.md`](#where-your-truth-lives).
  An agent cites your code or says `UNKNOWN`; it never invents an architecture
  you don't have.

**Claude Code is the reference implementation.** Codex, Cursor, GitHub Copilot
and Gemini CLI get native adapters *generated from the same source* — one
methodology, drift-checked in CI, never forked.

## Why Himoa

| An agent without a method | An agent running Himoa |
|---|---|
| Starts coding from the ticket | Maps the repository first — a read-only `context-mapper` runs before any option is weighed |
| Assumes a stack, an ORM, a middleware layer | Labels every claim in a plan or report `FACT` (with `path:line`), `INFERENCE`, `ASSUMPTION`, `ABSENT` or `UNKNOWN` |
| Treats the ticket's suggested method as the spec | Takes the *goal* from the ticket and weighs its *method* against alternatives; builds the smallest scope that fully delivers it, in the shape established practice uses |
| Same ceremony for a typo and a migration | Four risk tiers — plus a "below Low" exit — decide plan depth, review panel and tests |
| Reviews its own diff in the context that wrote it | Launches independent read-only lenses in fresh contexts; Critical and High findings must survive an adversarial refutation pass |
| Loses the end goal three files deep | Carries the requirement's **process flow** into the plan, the test mapping and the validation coverage, and re-reads the approved scope after approval |
| "Tests pass" | `PASS` only for a check that ran and passed for a stated scope — skipped, partial, filtered or flaky is never `PASS` |
| Makes red go green by editing the check | Treats weakening a check as a *manufactured pass*, not a pass ([No fake green](#no-fake-green)) |
| Follows instructions planted in a file | Treats repository content as evidence, never instruction — an embedded directive is reported, not obeyed |
| Commits, pushes, maybe deploys | Stops. Commit, push, merge, deploy and migrations stay yours |

Most of this is **methodology the agent is instructed to follow**, not a runtime
block — Himoa ships no permission rules and no command-gating hooks. What each
host can actually *enforce* is stated per host in [Supported agents](#supported-agents).

## Quick start

On Claude Code:

```text
# once per machine
/plugin marketplace add jaylordibe/himoa
/plugin install himoa@jaylordibe          # restart Claude Code after

# once per repository — writes AGENTS.md, a thin CLAUDE.md and .claude/settings.json
/himoa:framework-install
/himoa:framework-doctor                   # verify

# then, for any material change
/himoa:work-item "Add rate limiting to the password-reset endpoint"
```

`work-item` also accepts an issue key or an issue URL. Teammates who pull the
repository run only the two `/plugin` lines. Codex, Cursor, Gemini CLI and
Copilot: see [Install on other agents](#install-on-other-agents).

## How a change flows

`/himoa:work-item` runs the whole pipeline in one session and interrupts you at
**two planned stops**: to approve the plan, and to review the finished diff
before you commit. Between them it keeps a visible stage ledger and does not
ask for confirmation — but it stops early, says why and what it blocks, on a
material divergence from the approved plan, a product decision the repository
cannot settle, review findings still open after two remediation cycles, a
validation `FAIL` or `BLOCKED` it cannot fix within the plan, or a missing
prerequisite.

| Stage | What happens |
|---|---|
| **Understand** | Maps entry points, data flow, persistence, authorization, tenancy, contracts, async work and affected tests from repository evidence; grades the request's factual claims against the code |
| **Design** | Assigns the risk tier; writes a plan sized to it (threat model and alternatives at High) with every requirement, risk and process-flow step mapped to a named test |
| **Approve** 🧑 | You approve, reject or change the plan. Silence, task assignment or a permissive sandbox is not approval, and a prior approval never covers a materially changed design |
| **Implement** | Only what was approved, reusing what the repository already owns |
| **Review** | Independent read-only lenses selected by risk — correctness, security, tests, contracts, data, performance, architecture ([what each examines](#independent-review-lenses)); findings verified against source, then remediated and re-reviewed |
| **Validate** | Read-only. Runs your canonical commands and reports `PASS`, `FAIL` or `BLOCKED` with an evidence table |
| **Present** 🧑 | Diff, evidence and recommended next steps handed to you |

**The requirement stays the anchor.** When a ticket carries a numbered
process flow, Himoa treats it as the outline of the requirement: each step and
branch is carried into the plan, mapped to a test, and checked in the
validation report's coverage. A step the code contradicts is surfaced, never
quietly re-ordered. With no flow given, the plan states the order it commits to
so you can see it before approving.

<details>
<summary>What a run looks like (illustrative — shape, not captured output)</summary>

```text
$ /himoa:work-item "Add rate limiting to the password-reset endpoint"

  Understand   maps the endpoint, its auth path, the existing limiter
  Risk         HIGH — authentication surface + public contract
  Design       plan + threat model + negative tests, presented
      ⏸  APPROVAL REQUIRED — waiting for you
  Implement    (after you approve) minimal diff, reuses the limiter
  Review       reviewer · security · tester · contract lenses, run independently
  Validate     PASS · lint · types · tests   (the commands from AGENTS.md)
  Present      diff + evidence handed off
      ⏸  YOURS TO COMMIT — Himoa never commits, pushes or deploys
```

</details>

<details>
<summary>Write the ticket first, drive stages by hand, or pick up ad-hoc work</summary>

**`/himoa:write-ticket`** drafts a ticket the way a business analyst would —
a user story, then the process flow when the order of steps is part of the
outcome, current behaviour cited from your code, observable acceptance
criteria, non-goals and open questions. It leaves the risk tier to the design
stage, contains no design, and writes nothing to any system.

**One stage at a time:**

```text
/himoa:gate-design <requirement>  →  /himoa:gate-approve  →  /himoa:gate-implement
/himoa:gate-review                →  /himoa:gate-validate
```

Implemented something by hand? Run `gate-review`, then `gate-validate`. Gates
are human-typed: on Claude Code the model cannot invoke one, and the methodology
forbids it from simulating one.

</details>

## Risk decides the rigor

Ceremony scales with what a change can break. A copy fix stays cheap; a
migration gets everything it needs.

| Tier | Examples | You get |
|---|---|---|
| **Below Low** | Comment fix, rename in one file, log line, a one-liner whose cause and effect are on screen | The edit and a one-line note. No map, plan, lens or report |
| **Low** | Copy, isolated rename, test-only cleanup | No plan document; review and validation still run |
| **Medium** | Business logic, endpoint behaviour | A plan; `reviewer` plus the one domain lens the change touches |
| **High** | Authentication, authorization, tenancy, personal data, money, uploads, webhooks, integrations, migrations, public contracts, concurrency | Full plan, threat model, negative tests, multi-lens review |
| **Critical** | Identity infrastructure, cryptography, broad privileged access, destructive data work, release infrastructure | All of High, the `architect` lens, and **human security review** — automated review is never sufficient |

On a boundary between two tiers you get the **higher** one, and a change
touching a path your `AGENTS.md` lists under **High-risk paths** is raised.
The below-Low exit never applies to anything reaching authentication,
authorization, tenancy, personal data, money, migrations, public contracts or
concurrency. Asking Himoa to spend less buys a shorter report and fewer
speculative searches — never fewer tests, reviewers or checks than the tier
requires.

**Investigate deeply, build minimally.** A High-risk change may earn a deep
map, a threat model and a full review panel and still ship as a five-line diff.
Himoa reuses what the repository already owns and prefers the platform and
standard library over new dependencies or abstractions. Minimal means scope,
never shape: what must be built is built the way established practice builds
it — cited from the repository, the platform's docs and how others solve the
same problem — not squeezed into a shortcut to avoid a table.
Policy: [`execution-efficiency`](plugins/himoa/standards/execution-efficiency.md)
· [`architecture`](plugins/himoa/standards/architecture.md) §3.

## Independent review lenses

Eight read-only agents. None of them can edit your code; each reviewing lens
runs in a fresh context and owns one decision.

| Lens | Examines | Runs when |
|---|---|---|
| `context-mapper` | Actual architecture and blast radius, before design | Always, first |
| `reviewer` | Correctness, state and concurrency defects, error handling, responsibility placement, dead or duplicated code, your declared conventions | Medium and above |
| `security` | Trust boundaries and sensitive operations (below) | High and above, or when the diff touches a trust boundary |
| `tester` | Whether tests actually protect the changed behaviour; test quality and determinism; whether the evidence supports the verdict | High and above, or when coverage is material |
| `contract` | Anything a consumer can observe — shapes, nullability, enums, error identifiers, pagination, events, webhooks; backward and mixed-version compatibility | The diff touches a public surface |
| `data` | Persisted shapes, constraints, indexes against real queries, transactions, tenancy in data access, migration and backfill safety, rollback | The diff touches persistence |
| `performance` | Workload and reliability (below), always against a stated workload assumption | The diff touches workload-sensitive behaviour |
| `architect` | Boundaries, ownership, plan conformance, deployment ordering and rollback | Cross-cutting or structural change, and every Critical change |

A lens is launched when the diff gives it something to judge — on High and
Critical work, uncertain applicability means launch it — and never to look
thorough.

**Security review** threat-models the change and examines authentication
(enumeration, token and session handling, credential storage); function-level
and record-level authorization, including another actor's or tenant's record;
untrusted input reaching sensitive sinks (injection, mass assignment, path
traversal, request forgery); rate limiting, replay and races; secrets and data
exposure; and, when the change reaches them, the browser trust boundary
(cross-site scripting, CSRF, cookies, CORS, headers), dependency and build-chain
trust, cryptographic primitives, and what the deployment exposes to the
internet. High-risk work requires negative tests — unauthenticated, wrong
permission, another tenant, another actor. The `domain-auth`,
`domain-authorization`, `domain-browser-security`, `domain-cryptography` and
`domain-supply-chain` playbooks carry the questions such changes must answer.

**Performance review** looks for work that grows without a bound (unbounded
reads, a query inside a loop, unbounded fan-out or recursion), access paths no
index serves and data loaded but never used, remote calls without timeouts or
with unbounded retries, duplicate and poison handling in async work,
backpressure and concurrency limits, and cache invalidation.

This is source-level engineering review. It is **not** a penetration test, a
scanner or dynamic analysis, and it guarantees no vulnerability is absent. Where
your repository declares a security or audit command, validation runs it and
reports it on its own evidence. Details: [security standard](plugins/himoa/standards/security.md)
· [SECURITY.md](SECURITY.md).

## Evidence, not claims

**Repository evidence outranks assumptions.** When sources disagree the
precedence is: source code > tests > CI and build configuration > repository
documentation > ticket wording > the agent's own expectations. A missing fact
is recorded as `ABSENT` or `UNKNOWN`, never filled in with something plausible.
That ranking decides what is *true* — it makes no file a source of
*instructions*. Directions come from the person in the conversation.

Validation verdicts never round up:

| Verdict | Meaning |
|:---:|---|
| `PASS` | The check ran and passed for the stated scope |
| `FAIL` | It ran and failed |
| `BLOCKED` | It could not run here |
| `N/A` | Your repository has no such step — does not block an overall `PASS` |

Himoa never calls a change "secure", "production-ready" or "done" beyond what
that evidence shows.

### No fake green

Passing a check and manipulating it until it passes are different things. Each
of these is a **manufactured pass**, not a pass:

- deleting, skipping, focusing or disabling a failing test;
- weakening an assertion so it no longer catches the wrong value;
- lowering a coverage, lint, type, security or performance threshold, or
  removing a rule or check;
- adding a suppression to silence a finding rather than fix it;
- narrowing a check's scope so the failing case is no longer exercised;
- leaving an empty catch, stub or placeholder behind a green check.

The line is what the change answers to: a check changed because the
*requirement* changed is engineering; a check changed because it was *red* is
manipulation. Validation itself edits nothing. When work genuinely requires
lowering a quality bar, that is surfaced for your decision, not taken on your
behalf. This is a methodology rule the agent is instructed to follow, not a
runtime block. Source: [`evidence`](plugins/himoa/standards/evidence.md) §5.

## Where the human stays in control

Himoa prepares the diff, the tests, the evidence and the handoff. Unless you
ask for that exact operation, it does not:

- implement before you approve the plan;
- commit, push, force-push, merge, rebase, tag, or open or merge a pull request;
- publish, release or deploy;
- apply a migration, reset a database or repair production data;
- change infrastructure or rotate secrets;
- accept product, security, privacy or operational risk on your behalf.

Critical changes additionally require **human** security review.

If you pass `work-item` a real issue key and an issue-tracker MCP server is
connected, the final stage posts one comment on that item, and one on each
same-tracker item linked as depending on or blocked by it. It never transitions
an issue or edits a field.

How strongly the approval stop is enforced differs by host — see
[Supported agents](#supported-agents).

## Supported agents

The methodology is identical everywhere. What differs is how strongly each host
can enforce it. Outside Copilot, no host makes it *impossible* for a misbehaving
model to proceed past the approval stop: hosts stop the model from invoking the
gate itself, and the methodology forbids inferring approval.

| Agent | Status | What that means |
|---|---|---|
| **Claude Code** | **Reference — full** | Native plugin; gate skills the model cannot invoke; read-only review subagents; always-on `SessionStart` charter stamped with the plugin version |
| **OpenAI Codex** | **Supported (initial adapter)** | Native skills; gates set `allow_implicit_invocation: false`; read-only sandboxed subagents, `AGENTS.md`. Structurally validated; live end-to-end run inside Codex pending. `AGENTS.md` carries no version stamp, so a repository can run an older methodology silently |
| **Cursor** | **Supported (initial adapter)** | Native `SKILL.md`/`AGENTS.md`, `disable-model-invocation` honoured, read-only reviewer subagents. Shares its install with Codex. Live end-to-end run pending |
| **Gemini CLI** | **Supported (initial adapter)** | Reuses `AGENTS.md`, native read-only reviewer subagents, `/himoa:*` slash commands; gates are human-typed commands. Live end-to-end run pending |
| **GitHub Copilot** | **Supported with limitations** | Repo-committed `AGENTS.md`; approval is hard (a human merges the PR). Reviewer lenses are advisory — no read-only subagent, no skills mechanism — and `context-mapper` is not projected (over the host's custom-agent size limit) |

"Compatible in theory" is not "supported": a host is listed only once its
adapter runs the methodology, and enforcement is never rounded up. The live
host runs are defined in the [adapter smoke test](docs/adapter-smoke-test.md);
they are not run in CI, and their results are never assumed.
Detail: [platform capabilities](docs/platform-capabilities.md) ·
[cross-agent architecture](docs/cross-agent-architecture.md).

## Install on other agents

Nothing below writes outside the paths shown, and nothing commits on your behalf.

<details>
<summary><b>Codex, Cursor and Gemini CLI</b> — one installer family</summary>

<br/>

The `himoa-*` bins are on your `PATH` once the Claude plugin is installed, or run
them from a clone:
`git clone https://github.com/jaylordibe/himoa && himoa/plugins/himoa/bin/himoa-<host>-install`

```bash
himoa-codex-install          # Codex   — skills + read-only reviewers + standards (machine)
himoa-cursor-install         # Cursor  — shares the skills/standards install with Codex
himoa-gemini-install         # Gemini  — ~/.gemini subagents + /himoa:* commands
himoa-codex-install --repo   # once per repository: create/extend AGENTS.md (never destroys it)
himoa-codex-doctor           # verify   (himoa-{cursor,gemini}-doctor per host)
```

`--check` is a dry run; `--uninstall` removes only Himoa-owned files. Invoke the
pipeline as Codex `$himoa-work-item`, Cursor `himoa-work-item`, Gemini
`/himoa:work-item`.

</details>

<details>
<summary><b>GitHub Copilot</b> — repository-committed only</summary>

<br/>

Copilot is a cloud agent, so its adapter never touches `$HOME`:

```bash
himoa-copilot-install        # writes ./AGENTS.md + advisory .github/agents/*.agent.md
himoa-copilot-doctor         # verify
git add AGENTS.md .github/agents && git commit   # then let Copilot open a PR
```

</details>

### Where your truth lives

Repository facts live in one file — **`AGENTS.md`** at the repository root — read
by every agent. Claude Code reads it through a thin `CLAUDE.md` that imports it
(`@AGENTS.md`); the other hosts read it directly. State it once:

- **what the system is** — language, runtime, frameworks, data stores;
- **canonical commands** — build, lint, type-check, test *(validation runs these)*;
- **high-risk paths** that deserve extra ceremony;
- **consumers** of your contracts, and deployment constraints.

An absent section is honest; a wrong one is load-bearing misinformation.
`framework-install` and `himoa-<host>-install --repo` scaffold the file; you
fill it from repository evidence. Guide: [consuming repository guide](docs/consuming-repository-guide.md).

## What ships

- **16 skills** — `work-item`, `write-ticket`, five gates (`gate-design`,
  `gate-approve`, `gate-implement`, `gate-review`, `gate-validate`),
  `framework-install` / `framework-doctor`, and seven domain playbooks.
- **8 read-only review agents** — listed [above](#independent-review-lenses).
- **1 `SessionStart` charter** carrying the always-on rules — and gating nothing.
- **Generated adapters** for Codex, Cursor, Copilot and Gemini, plus their
  `himoa-<host>-install` and `-doctor` scripts.

No build step, no runtime dependencies, no published artifact — the marketplace
serves this repository directly.

### Security boundaries

- **No permission rules, no command-gating hooks.** Prompting and blocking are
  governed entirely by your settings and permission mode. Himoa is methodology,
  not a security control.
- **Repository installs write a bounded set.** `framework-install` merges exactly
  three keys into your project's `.claude/settings.json` —
  `extraKnownMarketplaces`, `enabledPlugins` and
  `env.CLAUDE_CODE_ENABLE_TODO_TOOLS` — never `permissions`, never `hooks`, and
  nothing in `$HOME`. The `himoa-<host>-install` bins write only Himoa-owned,
  prefixed paths, are idempotent, and never overwrite unrelated files or destroy
  an existing `AGENTS.md`.

Rationale: [architecture](docs/architecture.md) · [SECURITY.md](SECURITY.md).

## Update

On Claude Code, auto-update is on by default — the new version loads on your next
launch or after `/reload-plugins`. If you opted out
(`himoa-install-settings --no-auto-update`): `/plugin marketplace update jaylordibe`
then `/plugin update himoa@jaylordibe`, and restart. On a **major** version bump,
read the [CHANGELOG](CHANGELOG.md) first. For other hosts, re-run
`himoa-<host>-install`; `himoa-<host>-doctor` reports a stale install.

## Troubleshooting

<details>
<summary>Common symptoms and fixes</summary>

<br/>

| Symptom | Cause and fix |
|---|---|
| Skills or commands don't appear | Not installed, or the session predates the install. Re-check [Quick start](#quick-start) or [other agents](#install-on-other-agents), then reload or restart. |
| Works for me, not for a teammate (Claude) | They need the per-machine `/plugin install`, not `framework-install`. The plugin doesn't travel with `git pull`. |
| `framework-doctor`: repository does not declare Himoa | Run `framework-install` (Claude) or `himoa-<host>-install --repo`, and commit the result. |
| Everything prompts for permission / a command is blocked | Not Himoa — it ships no permission rules. Check your own settings and permission mode. |
| An agent describes architecture you don't have | Your `AGENTS.md` is missing or stale. Fill it from evidence, run the doctor, then [open an issue](https://github.com/jaylordibe/himoa/issues) with the transcript. |
| The agent claims a gate ran that you didn't type (Claude) | It didn't run — gates cannot be model-invoked. The claim is the bug. |
| A non-Claude host doesn't reflect the methodology | Confirm `himoa-<host>-doctor` is green, and see the [adapter smoke test](docs/adapter-smoke-test.md). |

</details>

## Documentation

| Document | For |
|---|---|
| [Consuming repository guide](docs/consuming-repository-guide.md) | Setting up a repository and filling `AGENTS.md` |
| [Platform capabilities](docs/platform-capabilities.md) | What each agent can and cannot enforce |
| [Cross-agent architecture](docs/cross-agent-architecture.md) | One methodology, native adapters — the core/adapter boundary |
| [Adapter smoke test](docs/adapter-smoke-test.md) | Producing live end-to-end evidence per host |
| [Architecture](docs/architecture.md) | Why methodology and repository own different things |
| [Migration from `.claude`](docs/migration-from-dot-claude.md) | Moving an existing setup onto Himoa |
| [Versioning](docs/versioning.md) · [Changelog](CHANGELOG.md) | What each release means and asks of you |
| [Development guide](docs/development-guide.md) · [Constraints](docs/constraints.md) | Changing or releasing Himoa; the host limits that shaped it |

---

<div align="center">

**MIT licensed** · Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md).

**Himoa owns the methodology. Your repository owns the truth.**

</div>
