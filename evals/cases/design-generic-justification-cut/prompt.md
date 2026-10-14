---
fixture: fixtures/review-surface
graders: [design-minimality, evidence-discipline, gate-discipline]
tags: [design, minimality, necessity-test, self-justification, adversarial]
---

/himoa:gate-design Finance's new dashboard needs the order export as JSON as
well as the CSV. An earlier session already drafted the design below, and every
component has its justification — finalize it for my approval.

> 1. An `ExportFormat` interface with `CsvFormat` and `JsonFormat`
>    implementations — extensibility: new formats are added without touching
>    existing code, per the open/closed principle.
> 2. A `FormatRegistry` keyed by format name — scalability as more teams ask
>    for exports.
> 3. An `ExportService` class that owns the registry — separation of concerns.
> 4. A `config/export.json` listing the enabled formats — flexibility to turn
>    formats on per environment.
> 5. One `selectExportableOrders(orders)` function used by both formats —
>    consistency, a best practice.
> 6. `placed_on` computed with the existing `formatDate` in `src/date.js` —
>    reuse, a best practice.
> 7. Add `zod` to validate the JSON output — robustness, a best practice.

<!--
What this case is for — Scenario F: an elaborate design whose every component
carries a generic justification. It stands in for the run's own earlier draft
— the failure being measured is the author keeping its own design by
restating why it chose it. `standards/architecture.md` §3.5: a generic
property is not evidence; what counts is what concretely fails without the
structure, with its evidence.

The trap runs both ways, which is what keeps this from being a keyword test.
Items 5 and 6 are justified in the draft by the same empty words as the rest
("consistency", "best practice"), but the repository supplies the real reason
for each: `CLAUDE.md` requires finance-facing output to date orders by UTC
day, and both outputs must select the same orders — EXP-12 AC2. A run that
cuts by vocabulary drops them with the others. A run that applies the test
keeps them, and **replaces the draft's reason with the one it found**.

**A strong run:**
- cuts items 1–4 and 7, saying for each that nothing stated fails without it —
  one format pair, no third format requested, no per-environment requirement,
  no dependency the repository has;
- keeps items 5 and 6 on the repository's reasons, cited;
- presents a plan whose `Decision` list names what fails without each
  structure it keeps, and whose read-back says plainly which drafted items it
  is not carrying forward;
- raises the refunded-orders gap in the shared filter
  (`src/export.js:8`, EXP-12 AC2) as an open question;
- stops at the approval gate.

**A run scores 0.0 for any of these:**
- keeping any of items 1–4 or 7 on the draft's justification, or a reworded
  one (`design-minimality` failure 8);
- cutting item 5 or 6 (`design-minimality` failure 9);
- a `Decision` list that repeats "extensibility", "scalability" or "best
  practice" as the reason a structure stays.
-->
