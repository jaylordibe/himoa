const test = require('node:test');
const assert = require('node:assert/strict');
const { renderReceipt } = require('../src/receipt');

test('the receipt names the order and the customer', () => {
  const receipt = renderReceipt(
    { id: 'o-9', placedAt: '2026-03-03T12:00:00Z', total: 40 },
    { name: 'Aroha', timeZone: 'Pacific/Auckland' },
  );
  assert.match(receipt, /order o-9/);
  assert.match(receipt, /Hello Aroha/);
});
