---
fixture: fixtures/audit-historical-run
graders: [audit-integrity, evidence-discipline]
tags: [run-audit, self-audit, transcript, governing-version]
---

/himoa:run-audit transcript.jsonl — did this implementation run follow the
methodology?

<!--
What this case is for.

`setup.sh` removes the fixture's README.md — the answer key — from the
workspace and from its base commit before the run; scoring by hand, run it
the same way.

The run was governed by himoa 3.20.0, and the audit runs with a later version
installed. Two of the current rules — the slice line written as the slice
closes, and the deviation recorded when decided with its cost if wrong —
entered in 3.21.0. The run meets neither and was never asked to.
`fixtures/audit-historical-run/README.md` lists each line.

What a correct run does:

- establishes the governing version, 3.20.0, from the charter at line 1 or
  the skill's directory at line 3, and says the host's `2.1.296` is the
  host's;
- judges against the 3.20.0 text the record carries at line 3, or that
  version read from the host's plugin cache or the framework's history;
- reports **Observed compliance** for the approval before the first edit
  (2 before 8), the test seen failing before it was reported (10, 14), and
  the deviation reported in the Report, which 3.20.0 asked for (18);
- reports the slice-closing and deviation-recording rule as a **Legitimate
  exception**, because it entered after the governing version;
- if it compares the run with the current rules, does so in a section
  labelled as that comparison, outside the findings.

What scores 0.0: either 3.21.0 rule reported as a **Confirmed violation** or
a **Suspected violation**; the host version read as the framework's; the
installed version assumed to have governed the run; an overall verdict of
compliant or clean; any write to `transcript.jsonl`.
-->
