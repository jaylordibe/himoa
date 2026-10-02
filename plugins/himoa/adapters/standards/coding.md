<!-- GENERATED from plugins/himoa/standards/coding.md by tests/validate-adapter-projection.mjs (himoa 3.12.1). DO NOT EDIT. Edit the canonical source and run: node tests/validate-adapter-projection.mjs --write -->

# Coding standard

Generic expectations for code the framework produces or reviews. The consuming
repository's own conventions are authoritative and take precedence; this file
covers what almost every repository wants and few write down.

## 1. Naming

Use full, intention-revealing domain words for every declared name and every
local — variables, parameters, functions, methods, classes, types, files.

- No single-letter or throwaway locals (`b`, `r`, `d`, `x`), including loop
  bodies and callbacks. Iterate over a named element; name the index
  (`rowIndex`, `pageIndex`) rather than using a bare counter.
- No cryptic abbreviations (`cfg`, `tmp`, `usr`, `req`, `res`, `errMsg`) and no
  truncated morphemes anywhere in an identifier (`Msg`, `Mgr`, `Svc`, `Repo`,
  `Calc`, `Ctx`, `Addr`, `Num`, `Val`).
- No vague placeholders (`data`, `item`, `obj`, `val`, `thing`, `handler2`).
- The only permitted abbreviations are idioms the repository has already
  established repository-wide, and single-letter generic type parameters.

**Declared names carry the highest bar**, not the lowest. A class, function or
file name is API surface for every future reader; a local is read once.

Follow the repository's established casing and file-naming conventions rather
than importing conventions from elsewhere.

## 2. Responsibility placement

Each file has one clear responsibility.

- Transport/entry layers handle protocol and access metadata, not domain rules.
- Domain/application layers hold behaviour and orchestration.
- Persistence layers hold storage access.
- Pure, reusable transforms live in shared utility modules with their own
  tests, never inline above a class that happens to use them.
- Large static lookup tables, registries and configuration arrays live in their
  own module and are imported.

Rule of thumb: if a reader must scroll past static data or a helper to reach
the thing the file is named after, the file is misfiled.

## 3. Errors and results

- Errors carry a **stable, machine-readable identifier** that consumers can
  program against, separate from the human-readable message. Messages are free
  to change and to be localised; identifiers are a contract.
- Error construction and translation happen in one place, not scattered.
- Internal failure detail — driver messages, hostnames, credentials, stack
  traces, internal identifiers — never reaches a caller who is not trusted with
  it.
- Do not catch and re-wrap an error that a central handler already translates.
- Failures that are expected are modelled; failures that are not are allowed to
  surface rather than being swallowed.

## 4. Input and data handling

- **Validate and normalise at the trust boundary**, once, before the value
  reaches domain logic.
- **Never trust a client-supplied value that the server can compute**: prices,
  totals, discounts, entitlements, ownership, roles, approval state. Recompute
  or load them server-side.
- Reject unknown fields rather than silently ignoring them, where the framework
  in use supports it.
- Parameterise every query and command; never build one by string
  concatenation from input.
- Include ownership and tenancy in the data access itself, not only in a check
  that runs before it.
- Avoid unbounded reads. Any list that can grow is paginated with deterministic
  ordering.
- Address concurrency explicitly where two callers can touch the same record.

## 5. External operations

- Every remote or blocking call has an explicit timeout.
- Retry only known-transient failures, with a bounded attempt count, backoff
  and jitter.
- Anything retried must be idempotent, or must be made idempotent.
- Consumers of at-least-once transports tolerate duplicate delivery.
- Payloads and logs are sized and redacted deliberately, not by accident.

## 6. Comments

Comment the **why**, never the what. The highest-value comment in any codebase
sits beside a line that looks removable and explains what breaks when it is
removed. Write those, and delete the rest.

Do not leave commented-out code, `TODO` markers for work that is in scope, or
narration of what the next line obviously does.

## 7. Completion hygiene

Before a change is done:

- no debug output, temporary logging or placeholder values;
- no focused, skipped or disabled tests introduced by the change;
- no disabled lint rules or suppressions added without a comment explaining
  why the rule is wrong here;
- no commented-out code and no parallel obsolete implementation;
- no unintended lockfile, generated-output or formatting-only churn mixed into
  a behavioural diff;
- every in-scope call site of a changed pattern migrated, not just the first.

## 8. Make conventions self-enforcing

A new convention ships with a guardrail — a lint rule, a type, a central
factory, an exhaustive switch, a test, a hook — so the next contributor cannot
drift from it without noticing.

Documentation alone is not enforcement. A rule that only exists in prose is a
rule that will be broken by someone who never read the prose.

## 9. The repository describes the present; version control holds the past

Code, comments, documentation and the repository's `AGENTS.md` state what the
system is now and why it is that way. How it came to be that way — what
changed, when, for which ticket, and what was wrong before — is already
recorded, with authorship and exact diffs, in version control history and the
tracker. A second, hand-written copy of that history inside the repository
duplicates it, drifts from it, and buries the current truth under narrative
that every later reader pays to skim.

So none of these are written into the repository:

- dated narratives and correction logs ("Corrected on …", "previously X, now
  Y", "as of this session", "reworked the same day");
- per-ticket or per-session histories of how a feature was built;
- comments that record an edit rather than explain the code ("changed from X",
  "old logic kept for reference");
- backup or superseded copies of files beside the live one (`.bak`, `_old`,
  `v2` twins), and commented-out code (§6).

When text turns out to be wrong, **fix it in place** so it states the truth,
and say what was wrong in the commit message — never by appending a correction
beneath the stale text.

Each kind of history that genuinely matters has a standard home, and it is
never the file a reader loads to learn the current system:

| Worth keeping | Standard home |
|---|---|
| What changed and why, for any change | The commit message and pull request |
| Why a significant, hard-to-reverse decision was taken | A decision record (an ADR), which is dated and append-only by design |
| What a released artifact changed for its consumers | A release changelog for that artifact, maintained for its readers |
| Schema history | The repository's migrations, which are executable history and must stay |
| A temporary workaround | A comment that explains it now and links the open issue that retires it |

A statement a consumer needs today — "the old field is still accepted until
consumers migrate" — describes present behaviour and is not history.
