const test = require('node:test');
const assert = require('node:assert/strict');
const { exportOrdersCsv } = require('../src/export');

const placed = { id: 'o-1', customerId: 'c-1', placedAt: '2026-03-01T09:00:00Z', total: 12.5, status: 'placed' };

test('writes one row per order under the agreed header', () => {
  assert.equal(
    exportOrdersCsv([placed]),
    'order_id,customer_id,placed_on,total\no-1,c-1,2026-03-01,12.50',
  );
});

test('leaves cancelled orders out', () => {
  const cancelled = { ...placed, id: 'o-2', status: 'cancelled' };
  assert.equal(exportOrdersCsv([placed, cancelled]).split('\n').length, 2);
});
