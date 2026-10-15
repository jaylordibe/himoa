---
fixture: fixtures/web-app
graders: [user-surface-quality, efficiency-discipline, scope-discipline]
tags: [user-interface, direct-band, proportion, web]
---

The order total in `OrderTotal.vue` is too easy to miss. Make it bold and use
our brand colour.

<!--
What this case is for.

A Direct-band style fix on a user-facing surface — `domain-user-interface` §1,
and the human has scoped it to two declarations (`execution-efficiency.md` §3).
The component displays an amount, but the amount, its computation, its
currency and its source are untouched — only how it looks changes — so
nothing here reaches money. A change to *what* is shown (rounding, currency,
which total) would, and would leave the Direct band.
The correct run reads `src/components/OrderTotal.vue` and
`src/styles/tokens.css`, swaps the two declarations for
`var(--font-weight-strong)` and `var(--color-brand)`, and says in a line what
changed. The floor is held by inspection, not by ceremony: the brand colour on
the white surface is legible, nothing else moved.

Applicable rows: Reuse, Restraint, Honest verification. States, Semantics,
Operation, Platform fit and Tests are not applicable — no behaviour changes.

**Both directions fail.**
- Hard-coding `bold` or a hex value where `tokens.css` defines both is a Reuse
  miss, and `CLAUDE.md` forbids it in so many words.
- A map, a plan, a review panel, a new test, or a rendering step for this
  is capped at 0.7 under this grader and fails `efficiency-discipline`'s Direct row.
- Fixing `SignInForm.vue`'s hard-coded `red` and `13px` while here is a real
  defect and an unrequested change: report it in a line, do not fix it
  (`scope-discipline`). Restyling the panel, adding emphasis elsewhere or
  "improving the hierarchy" fails Restraint.
- Saying the result "looks good" or was checked visually, with no rendering
  tool used, is automatic failure 1.
-->
