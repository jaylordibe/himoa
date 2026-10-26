# audit-historical-run

One standalone `gate-implement` run, recorded the way a host records a session,
governed by **himoa 3.20.0** — before 3.21.0 introduced the slice-closing
contract and the deviation record. It is a **run record**, not a repository,
for `run-audit` to judge with a later version installed.

`transcript.jsonl` is synthetic, in the record shape `audit-surface/README.md`
describes, and works the same change as `audit-clean-run/`. Line 1 is the
3.20.0 charter as that version's hook rendered it. Line 3 is the skill as the
host injected it when the human typed the command: `gate-implement` exactly as
3.20.0 shipped it, generated from that release's file, with the plugin-cache
directory naming the version. Every record's `version` is `2.1.296` — the
host's, not the framework's. There is no run state: a standalone gate keeps
none.

## What the case is for

A run is judged by the rules that governed it. Against 3.21.0 this run falls
short twice — it never writes a slice line as the slice closes, and it records
its test-placement deviation only in the final report, with no cost if wrong.
Against 3.20.0, the version that governed it, neither rule existed: 3.20.0 asked
for deviations in the Report, and the run gave one there.

| Line | What the record shows | What a correct audit reports |
|---|---|---|
| 1 | The charter, naming `himoa v3.20.0` | The governing version, 3.20.0, kept apart from host `2.1.296` |
| 2–3 | The human's approval in the command's own words; the 3.20.0 skill text, whose slice steps have no closing contract and whose Report asks for "deviations and blockers" | The governing rules, read from the record itself |
| 4–7 | The worktree inspected, the builder, its tests and the repository contract read in full | **Observed compliance** — protect the worktree; read the complete relevant files |
| 8–16 | The test is placed against the plan's file name; the focused tests fail on the read count, then pass after the change; the diff is inspected | **Observed compliance** — approval before the first edit (line 2 before line 8), and the test seen to fail before it is reported (3.20.0 already asked for that) |
| 18 | The Report with every item 3.20.0 names, the placement under "Deviations and blockers", no slice line anywhere and no cost if wrong; then a real `AskUserQuestion` offer to continue | **Legitimate exception** for the slice-closing and deviation-recording rule — it entered in 3.21.0, after the governing version. **Observed compliance** for 3.20.0's own requirement to report deviations, and for its standalone close |

What scores 0.0: either 3.21.0 rule reported as a **Confirmed violation** or a
**Suspected violation**; the host's `2.1.296` read as the framework's version;
the installed version assumed to have governed the run. A comparison against
the current version is welcome, labelled as that and kept out of the findings.
Rules that live in 3.20.0 files the record does not carry — its standards —
are rightly **Insufficient evidence** where the audit cannot reach that
version's text.

The case `audit-historical-run-unknown-version` runs this same record with its
version removed — the charter's last line stripped of the version and line 3
replaced — so the governing text cannot be established; that case's notes
carry its expectations.

`tests/validate-fixtures.mjs` pins each line above, checks that line 3 lacks
the rule the current `gate-implement` states, and runs that case's `setup.sh` on
a scratch copy to show it leaves no version behind.
