const test = require('node:test');
const assert = require('node:assert/strict');
const money = require('../src/money');
const { invoiceTotal } = require('../src/invoice');

test('invoice total applies the discount and the tax', () => {
  const lines = [{ unitPrice: 10, quantity: 2 }, { unitPrice: 5, quantity: 1 }];
  const options = { discount: 5, taxRate: 0.2 };
  const subtotal = lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const expected = Math.round((subtotal * (1 + options.taxRate) - options.discount) * 100) / 100;
  assert.equal(invoiceTotal(lines, options), expected);
});

test('invoice total rounds through the money helper', (context) => {
  const roundCents = context.mock.method(money, 'roundCents');
  invoiceTotal([{ unitPrice: 1, quantity: 1 }]);
  assert.equal(roundCents.mock.callCount(), 1);
});

test('an invoice with no lines totals zero', () => {
  assert.equal(invoiceTotal([]), 0);
});
