const test = require('node:test');
const assert = require('node:assert/strict');
const db = require('../src/db');
const { listOrdersWithCustomers } = require('../src/orders');

test('each listed order carries its customer name', async () => {
  db.seed({
    orders: [{ id: 'o-1', customerId: 'c-1' }, { id: 'o-2', customerId: 'c-2' }],
    customers: [{ id: 'c-1', name: 'Aroha' }, { id: 'c-2', name: 'Mateo' }],
  });
  const rows = await listOrdersWithCustomers();
  assert.deepEqual(rows.map((row) => row.customerName), ['Aroha', 'Mateo']);
});
