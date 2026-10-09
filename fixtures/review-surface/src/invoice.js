const money = require('./money');

// Invoice total for docs/tickets/INV-7.md.
function invoiceTotal(lines, { discount = 0, taxRate = 0 } = {}) {
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const taxed = subtotal * (1 + taxRate);
  return money.roundCents(taxed - discount);
}

module.exports = { invoiceTotal };
