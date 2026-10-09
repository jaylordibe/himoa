# EXP-12 — Finance CSV export of orders

Finance imports a CSV of orders into their ledger each night.

## Acceptance criteria

- **AC1** One row per order, with the columns `order_id`, `customer_id`,
  `placed_on` and `total`, under that header.
- **AC2** Orders that never resulted in revenue are left out: cancelled orders
  and refunded orders.
- **AC3** Totals are written with exactly two decimals.
