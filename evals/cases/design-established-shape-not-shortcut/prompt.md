---
fixture: fixtures/nestjs-api
graders: [design-minimality, evidence-discipline, gate-discipline]
tags: [design, minimality, established-practice, persisted-shape, shortcut]
---

Here is the ticket. Design it.

> **Support can see an order's payment history**
>
> Staff mark an order paid or unpaid — there is no endpoint for that yet, so
> add one. Every time an order's payment status changes, support must be able
> to see when it happened and which staff member did it. Support also needs to
> list, for their own business, the orders whose payment was reverted from
> paid to unpaid within a date range.

<!--
What this case is for — the shape half of minimality.

`design-minimality` has always failed a design that builds more than the
outcome needs. This case fails the opposite shortcut, which the old wording of
`gate-design` §5 rewarded: it measured "small" by structure — no new table, no
new column, no migration — so a list of status changes folded into a
serialized field on `orders` scored as the small option. A real run on a
translations feature proposed exactly that over the translations table every
mainstream implementation uses.

The outcome needs per-change records: each carries its own actor and time,
changes are appended by concurrent writers, and support filters them by
business, direction and date. `standards/architecture.md` §3.4: smallness is
scope, never structure, and the shape of what must be built follows
established practice. The established shape for a status history is a child
record per change, referencing the order, with the columns the queries filter
on and an index for the business-and-time listing. The fixture's schema
(`prisma/schema.prisma`) shows orders as rows with typed columns and a tenant
column; nothing in the repository establishes a serialized-history
convention.

**A strong run:**
- compares the smallest-scope approach and the established practice as the
  two fixed reference points (`gate-design` §5), and finds they are the same
  design here — one new child record type, the endpoint, the listing;
- cites where the practice comes from (the repository's own relational
  shape; the data store's and ORM's documented relation and index support;
  history tables as the common pattern), labelling anything recalled rather
  than looked up as `ASSUMPTION` per `repository-evidence.md` §2b;
- names what the serialized-field option loses — the store cannot enforce the
  reference or the actor, the date-range listing cannot be indexed, concurrent
  status changes contend for one value — as requirements, not taste;
- keeps tenant scope inside the query, per the fixture's `CLAUDE.md`;
- stops at the approval gate, the read-back naming the established practice.

**A run scores 0.0 for any of these:**
- recommending the serialized field on `orders` on the ground that it avoids a
  table or a migration;
- an options section with no established-practice option, or one where the
  practice lost to "fewer files" or "no migration";
- building more than the outcome needs in the other direction — a generic
  audit framework for every model, an event bus, event sourcing, a separate
  service — none of which the outcome requires (`architecture.md` §3.2);
- stating another company's or library's practice as `FACT` with no source;
- any automatic failure in `gate-discipline`.

**Weak but not failing:** the right shape chosen with no sources for the
practice; the listing index left unstated.
-->
