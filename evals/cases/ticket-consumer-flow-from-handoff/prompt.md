---
fixture: fixtures/vue-app
graders: [ticket-discipline, evidence-discipline, no-stack-assumption]
tags: [ticket, write-ticket, process-flow, consumer, handoff, ticket-is-not-a-spec]
---

/himoa:write-ticket The orders API team posted this on our ticket. We need the frontend ticket for it.

"Card payment for orders is now available. Sequence: (1) `POST /api/orders/:id/payments` returns 201 with `payment.clientSecret` and `payment.status: "pending"` — this is not the result. (2) Mount the card provider's hosted card field with that secret and confirm the card there. (3) The provider notifies our API by webhook a few seconds later; poll `GET /api/orders/:id` every second until `payment.status` is `"confirmed"` or `"declined"`. (4) `"confirmed"` also sets `isPaid: true`. If the customer closes the card field, the payment stays `"pending"` and expires after 15 minutes; they can start a new one. Error `PAYMENT_UNAVAILABLE` (503) means try again later."

<!--
What this case is for — a consumer ticket's flow is derived from a handoff,
not copied from it.

A provider's handoff opens with its interaction sequence
(`templates/contract-change.md` §1b). It is written for the consumer's
developer, so it names endpoints, field names, a status enum, a webhook and a
polling interval. `write-ticket` §4e says a consumer ticket's flow is derived
from that sequence through the `repository-evidence.md` §5 split: each row's
observable result becomes a step, and the calls, fields and delivery mechanism
go to §9, or to §7 stated as an outcome. The trap is the obvious shortcut —
paste the sequence into §1b because it is already numbered.

**The fixture.** One component fetches `/api/orders` and renders each order's
total (`src/components/OrderList.vue`); there is no order detail view, no
payment path and no roles (`ABSENT`). `CLAUDE.md` declares the app a leaf with
no consumers. The actor, "the customer", is the handoff's and the human's, not
the code's.

**A strong first turn** opens with a process flow of observable steps, e.g.:

1. the customer, viewing an unpaid order, starts a card payment;
2. the card step is shown — the order is not yet paid, and nothing tells the
   customer it worked;
3. the card is confirmed in the provider's field — the result is still
   pending;
4. the result arrives — on success the order shows as paid and the customer is
   told; 4a on decline, the customer is told and can try again;
2a. the customer closes the card step — the order stays unpaid and they can
   start again (the 15-minute expiry is the API's; the ticket says what the
   customer sees, and asks what they should see for a payment still pending).

The order of steps 3–4 is grounded in the handoff and cited as the API team's
statement — it is not a `FACT` about this repository, and a strong run does not
give it a `path:line` here. `PAYMENT_UNAVAILABLE` becomes a criterion about what
the customer sees. The endpoint, the field names, the status values, the
webhook and the one-second polling sit in §7 as the contract the work consumes,
or under **Ideas from discussion** — never as steps. Where to put the card step
on screen is left to the design stage.

**A run scores 0.0** for any of these:

- §1b is the handoff pasted or lightly reworded, with endpoints, field names,
  status values, "webhook" or "poll every second" as steps;
- the provider's timing, or the webhook, written as `FACT` with a `path:line`
  in this repository, which contains no such line;
- a step or criterion placing the card field on screen — a modal, a page, a
  button;
- any automatic failure in `ticket-discipline`.

**Weak but not failing:** the contract details dropped rather than kept in §7,
so the implementer has to go back to the comment; the pending-too-long
behaviour decided instead of asked.
-->
