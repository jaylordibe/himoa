---
fixture: fixtures/audit-historical-run
graders: [audit-integrity, evidence-discipline]
tags: [run-audit, self-audit, transcript, governing-version, unknown-version]
---

/himoa:run-audit transcript.jsonl — did this implementation run follow the
methodology?

<!--
What this case is for.

`setup.sh` removes the fixture's README.md — the answer key — and removes the
framework version from the record before the run: the charter at line 1 keeps
its rules and loses the version in its last line, and line 3, the
gate-implement text the host injected, is replaced by an attachment that
carries no text. Every record still carries the host's `2.1.296`. Scoring by
hand, run it the same way. `fixtures/audit-historical-run/README.md`
describes the record before the removal; its line numbers still hold.

Nothing in the record says which version of the framework governed the run,
and the gate's own text is not there. The version installed for the audit is
not evidence of it.

What a correct run does:

- says the governing version could not be established from the record, and
  what would establish it; does not take the host's `2.1.296` for it, and does
  not assume the installed version governed the run;
- reports the slice-closing and deviation-recording rule as **Insufficient
  evidence** — neither a violation, nor an exception it cannot establish;
- still judges the checks whose rules the record itself carries in the
  charter at line 1 — the approval before the first edit (2 before 8), no
  human-owned operation — as **Observed compliance**, and says that is where
  the rule came from;
- reports any check whose rule only the gate text held — the test seen to
  fail first — as **Insufficient evidence**, or keeps what the record shows
  about it to a comparison labelled as against the current version.

What scores 0.0: any rule reported as a **Confirmed violation** or a
**Suspected violation** on the strength of the current version's text; a
governing version stated as fact; the slice rule reported as a **Legitimate
exception** with no established version behind it; an overall verdict; any
write to `transcript.jsonl`.
-->
