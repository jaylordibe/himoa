---
fixture: fixtures/nestjs-api
graders: [ticket-discipline, evidence-discipline, scope-discipline]
tags: [ticket, write-ticket, process-flow, sequence, consumer, ticket-is-not-a-spec]
---

/himoa:write-ticket Customers should be able to pay for their order by card from the storefront. The card company only tells us a few seconds later whether the payment went through, so the order must not show as paid until it confirms, and the storefront has to wait for that before telling the customer it worked. If the card is declined they should be able to try again. I was thinking a payment_attempts table, and the orders service calling the card provider's API directly.

<!--
What this case is for — the process flow, graded in both directions.

The outcome takes several steps and crosses three parties: the customer, this
API, and a card provider that answers later. Written as a story and a list of
criteria, every line of the ticket can be correct and the integration still
wrong — the storefront told "paid" on the first response, before the provider
has answered. That order is the requirement, and the developer who will steer
the implementation needs it stated as soon as the goal is. `write-ticket` §4e and
`templates/ticket.md` §1b put it straight after the story.

The same section is also the easiest place for a design to come back in,
because numbered steps look like a plan. This case fails a run in either
direction.

**The fixture.** `src/orders/orders.controller.ts` exposes one read route,
`GET /orders/:id`, behind a single access decorator; the schema's `Order`
carries `isPaid`, defaulting to false (`prisma/schema.prisma`). There is no
payment path of any kind (`ABSENT`). The response shape the service builds is
imported from a file that is not in the fixture, so whether a client sees
`isPaid` today is `UNKNOWN`, not a `FACT`. `CLAUDE.md` declares one consumer,
the storefront web app. The code distinguishes no customer role; "customers"
is the human's actor, marked human-supplied.

**A strong first turn** builds the working ticket around a **process flow**;
abandonment and double payment are blockers, so the turn is a clarification
response, and the ticket — when the scorer asks for the draft (`ticket-discipline` automatic failure 5, scored as its *Scoring a case whose first turn is blocked* says) — opens
with the flow straight after the story, each step an actor or system, an action
and what can then be observed:

1. the customer, viewing an unpaid order, starts a card payment;
2. the card step is presented — the order is still unpaid;
3. the card provider answers later — until it does, the order is not paid and
   the storefront must not report success;
4. on confirmation, the order reads as paid and the customer is told;
3a. on decline, the order stays unpaid and the customer can try again.

The order in steps 3–4 is the human's and is grounded as theirs; nothing in the
fixture establishes it. Before it, the story; after it, current behaviour as `FACT` for the
read route and the `isPaid` default, `ABSENT` for any payment path, `UNKNOWN`
for what the response exposes; criteria that each name the step they prove;
the storefront named under contract touchpoints with a **Sequence** line that
points at §1b; and open questions the flow exposes and the human has not
answered — what happens when the customer abandons the card step, and whether
a second payment on an order the provider already confirmed is refused. The
table and the direct provider call sit under **Ideas from discussion**,
non-binding, with a line saying they were moved there.

**A run scores 0.0** for any of these:

- no process flow, on an outcome this plainly sequential;
- a flow whose steps are implementation — "the orders service calls the
  provider", "a row is written to `payment_attempts`", "a webhook handler
  updates the order" — rather than events someone outside the system can see;
- a step that states a mechanism for the provider's later answer (a callback,
  a webhook, polling) as `FACT` or as a requirement, when the human stated only
  that the answer comes later;
- the provider's timing labelled `FACT` with a `path:line`, when no line in the
  fixture shows it — an external system's behaviour is established per
  `repository-evidence.md` §2b or recorded as an `ASSUMPTION`;
- a flow that places steps on screen — a modal, a button, a page — which is
  the storefront's design;
- the abandonment or double-payment behaviour decided in the flow instead of
  asked;
- any automatic failure in `ticket-discipline`.

**Weak but not failing:** a flow present but before the story or after the
criteria; steps two sentences long that restate their criteria; steps or
criteria written as a markdown numbered list rather than with `S`/`AC`
identifiers;
criteria that do not name the step they prove, so an unproved step cannot be
seen; branches written only as criteria and missing from the flow.

**The follow-up turn.** The human answers: "If they close the card step, the
order just stays unpaid and they can start again." The strong run adds that as
a branch of the flow and a criterion naming it, removes the question from the
open set, and says which identifiers the answer became. Double payment still
blocks, so the turn is a clarification response asking it — not the complete
ticket. Then send "Show me the current draft." The presented ticket has the
new branch and its criterion, the flow still straight after the story, every
step and criterion from the first draft, and every identifier resolving.
-->
