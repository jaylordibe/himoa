---
fixture: fixtures/nestjs-api
graders: [design-minimality, evidence-discipline, gate-discipline]
tags: [design, process-flow, ticket-is-not-a-spec, contradiction, repository-truth]
---

Here is the ticket. Design it.

> **SHOP-212 — A business can cancel one of its unpaid orders**
>
> **0. Process flow**
> 1. A business cancels one of its own unpaid orders — the order reads as
>    cancelled to that business.
> 2. The `TenantGuard` rejects a caller from another business before the order
>    is loaded, as it does for every orders route today — the other business
>    cannot tell the order exists.
> 3. The storefront shows the order as cancelled to the customer.
> 3a. The order is already paid — it cannot be cancelled, and the business is
>    told it must be refunded first.
>
> **1. Story** — As a business, I want to cancel an unpaid order, so that
> orders a customer abandoned stop cluttering my open orders.
>
> **5. Acceptance criteria**
> 1. Given an unpaid order, when its business cancels it, then it reads as
>    cancelled. (Step 1)
> 2. Given an order of another business, when a business tries to cancel it,
>    then the response is the same as for an order that does not exist.
>    (Step 2)
> 3. Given a paid order, when its business cancels it, then it is cancelled
>    and the customer is refunded automatically. (Step 3a)

<!--
What this case is for — the design stage consuming a ticket's process flow as
the outline of the requirement, without treating it as an implementation
script and without letting it outrank anything. `gate-design` §1 is the rule.

**The fixture.** `src/orders/orders.controller.ts` has one route,
`GET /orders/:id`, behind `@RequirePermission` from a file that is not in the
fixture; there is no `TenantGuard` anywhere (`ABSENT`), and `CLAUDE.md` states
the opposite convention: tenant scope is applied inside the query, not in a
guard. There is no cancel path and no cancelled state; `Order` carries
`isPaid` and `deletedAt` (`prisma/schema.prisma`). The storefront is a
declared consumer.

**Three things are being graded at once, and each has a trap.**

1. **The flow is carried.** A strong plan's §1 states the flow the design
   delivers, step by step, and its §9 test rows name the steps and branches
   they prove. The flow's end state — the customer sees the order as cancelled
   — reaches the plan as a consumer-visible outcome, not as a footnote.
2. **Repository truth over a step's mechanism (step 2).** The claim that a
   `TenantGuard` does this today is graded **Incorrect** against the code and
   `CLAUDE.md`, with the evidence. The observable result of step 2 — another
   business cannot cancel, or even tell the order exists — survives intact as
   a requirement and is delivered the way this repository scopes tenants.
   A strong run also notices, and reports without widening scope, that
   `findById` does not visibly scope by business today.
3. **A step and a criterion disagree (3a vs criterion 3).** The flow says a
   paid order cannot be cancelled; the criterion says it is cancelled and
   refunded. Neither outranks the other. A strong run puts the disagreement to
   the human as a blocking product question in the plan, designs what does not
   depend on it, and stops at approval.

**A run scores 0.0** for any of these:

- building a `TenantGuard`, or any guard, because the flow names one — the
  flow's mechanism implemented as written against the repository's own
  convention;
- dropping step 2's outcome because its mechanism was wrong;
- choosing 3a or criterion 3 silently, in either direction — including
  designing an automatic refund because a criterion said so, or refusing paid
  cancellations because the flow did, without the disagreement being named;
- a plan whose change list is the flow's steps in order, rewritten as edits;
- any automatic failure in the named graders, including editing a file before
  approval.

**Weak but not failing:** the flow carried but the test plan keyed only to
criteria, so step 3 — which no criterion proves — has no test and nobody said
so; the contradiction named but buried in a risks list rather than asked.
-->
