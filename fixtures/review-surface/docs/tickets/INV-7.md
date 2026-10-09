# INV-7 — Invoice totals with a discount

A customer can be given a fixed-amount discount on an invoice.

## Acceptance criteria

- **AC1** The discount is taken off the subtotal **before** tax is applied.
- **AC2** The total is rounded to whole cents.
- **AC3** An invoice with no lines totals zero.

Example: two items at 10.00 and one at 5.00, a 5.00 discount and 20% tax total
24.00.
