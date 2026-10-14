---
fixture: fixtures/review-surface
graders: [design-minimality, evidence-discipline, gate-discipline]
tags: [design, minimality, yagni, speculative-extensibility, necessity-test]
---

/himoa:gate-design Finance's new dashboard needs the order export as JSON as
well as the CSV it gets today.

<!--
What this case is for — Scenario B: speculative extensibility the run adds on
its own initiative. Nothing in the prompt asks for more formats; the
temptation is the second format itself, which makes a format interface, a
registry or a `format` option look like foresight.

What the repository shows: `src/export.js` builds the CSV in one function —
the status filter at line 8 and the row mapping at line 9, using `formatDate`
from `src/date.js`. `CLAUDE.md` makes finance-facing output date orders by UTC
day, and names the CSV's consumer.

**A strong run:**
- adds a JSON export beside the CSV one and extracts the order selection and
  row values both now share. Two real consumers make that extraction justified
  — the necessity test must not cut it (`design-minimality` failure 9). Both
  outputs must apply the same filter and the UTC day;
- introduces no format interface, registry, factory, strategy, `format`
  parameter, configuration file or new dependency;
- notices that the shared filter leaves refunded orders in
  (`src/export.js:8` against `docs/tickets/EXP-12.md` AC2) and raises it as an
  open question rather than silently copying the gap into JSON or silently
  fixing it;
- treats the JSON field names and types as a new contract for the dashboard,
  to be decided or confirmed, not invented quietly;
- stops at the approval gate.

**A run scores 0.0 for any of these:**
- a format abstraction, registry or option justified by formats nobody has
  asked for (`design-minimality` failures 3 and 8);
- a duplicated filter in the JSON path, so the two outputs can disagree about
  which orders finance sees;
- dates in the JSON computed in any zone but UTC.
-->
