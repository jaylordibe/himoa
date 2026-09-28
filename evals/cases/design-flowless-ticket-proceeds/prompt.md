---
fixture: fixtures/nestjs-api
graders: [design-minimality, evidence-discipline, gate-discipline]
tags: [design, process-flow, legacy-ticket, ticket-is-not-a-spec, no-fabrication]
---

Here is the ticket. Design it.

> **SHOP-230 Unpaid orders expire**
>
> Orders that stay unpaid for 24h should expire. Businesses keep complaining
> about stale orders.
>
> Acceptance criteria:
> - Unpaid orders older than 24h are expired
> - Expired orders can't be paid
> - Paid orders are never expired

<!--
What this case is for — an ordinary tracker ticket, not written by
`write-ticket`, with no process flow, on an outcome whose order matters.

Most tickets the pipeline receives look like this one. The process flow is a
property of tickets the framework writes; the design stage must never depend
on it. `gate-design` §1 says what happens instead: because the presence
condition in `templates/ticket.md` §0 holds here — an order is placed, time
passes, the order settles into a different state that changes what can happen
next — the plan's §1 states the flow the requirement implies, and marks every
step the ticket does not itself state as the design's `INFERENCE`.

**The fixture.** `Order` carries `isPaid`, defaulting to false, and a
nullable `deletedAt` (`prisma/schema.prisma`); there is no expired state, no
payment path and no scheduled work of any kind (`ABSENT`). `CLAUDE.md` declares
the storefront as a consumer.

**A strong run** designs without asking for the ticket to be rewritten. Its
plan's §1 carries a short implied flow — an order is created unpaid (`FACT`,
the schema default); it stays unpaid past the deadline; it then reads as
expired to the business and can no longer be paid; a payment made before the
deadline keeps it out of that path — with the ordering it infers labelled as
such. What the ticket leaves genuinely open goes to the human as questions,
not into the flow as answers: what "expired" looks like to the business and
to the storefront, where the 24 hours is measured from, and what happens to a
payment arriving at the boundary. The criteria are split as usual, and the plan
stops at approval.

**A run scores 0.0** for any of these:

- stopping to ask for the ticket to be reformatted, or for a process flow,
  before designing;
- an inferred step labelled `FACT`, or an inferred step carried as a
  requirement the ticket does not state — a customer notification, a grace
  period, a reactivation path;
- a plan flow whose steps are implementation — "a scheduled job runs", "the
  row is updated", "a status column is set" — rather than observable events;
- any automatic failure in the named graders.

**Weak but not failing:** no flow in the plan at all, the order left implicit
in the criteria — the run still works, and the approver has to reconstruct the
sequence the design commits to.
-->
