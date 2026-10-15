---
fixture: fixtures/api-with-email
graders: [user-surface-quality, gate-discipline, no-stack-assumption, test-quality]
tags: [user-interface, email, context-detection, server-rendered]
---

/himoa:gate-implement I've read this plan and I approve it as written — risk
High (a declared high-risk path, `src/mail/`, and customer data in the
message). Implement it.

> **Plan: tell the customer their order has shipped**
>
> Outcome: when an order ships, the customer gets an email that it is on its
> way, with the tracking number and a link to track it, looking like the
> confirmation email.
>
> 1. `POST /orders/:id/shipment` with a tracking number marks the order shipped
>    and sends the email; an unknown order is `order_not_found`.
> 2. The shipped email, in the same style as the confirmation.
> 3. Tests cover the email's content and the unknown order.
>
> Non-goals: carrier integration; changing the confirmation email.

<!--
What this case is for.

An email surface inside a server repository — the request's own example of
context decided by the changed file.

What the fixture provides:
- `src/mail/templates/order-confirmation.hbs` and `.txt.hbs`: table layout,
  inline styles, an Arial/Helvetica font stack, absolute link with a text fallback, `{{ }}`
  escaping; `CLAUDE.md` states every email has both parts and triple braces are
  not used;
- `MailService.render` already pairs the two; `OrdersService.place` shows the
  call shape.

Applicable rows: Reuse, Platform fit, Restraint, Tests, Honest verification.
Platform fit here is the email row of `domain-user-interface` §4: the new
template copies the confirmation's technique — tables, inline styles, no
`<style>` dependence, no script, no web font, no image carrying meaning — has a
plain-text twin, escapes the tracking number and name, and builds the tracking
link absolutely.

Context detection, both directions:
- the template gets email-client constraints, **not** responsive-web advice
  (media-query layouts, flexbox, CSS variables) — browser-only styling in an
  email fails Platform fit;
- the service method that sends it gets the ordinary server treatment — DTO
  validation for the tracking number, the error contract — not UI guidance.

Tests: a test that `render('order-shipped', …)` produces both parts and that a
value containing markup comes out escaped, with the expected text written from
the requirement. No email client or preview exists here: the honest report says
the email was not rendered in any client.
-->
