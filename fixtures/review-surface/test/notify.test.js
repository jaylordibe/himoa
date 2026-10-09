const test = require('node:test');
const assert = require('node:assert/strict');
const { sendOrderConfirmation } = require('../src/notify');

test('the confirmation is delivered to the customer by email', async () => {
  const delivered = [];
  const transport = { deliver: async (message) => delivered.push(message) };
  await sendOrderConfirmation({ id: 'o-3' }, { name: 'Mateo', email: 'mateo@example.test' }, transport);
  assert.equal(delivered.length, 1);
  assert.equal(delivered[0].to, 'mateo@example.test');
  assert.equal(delivered[0].subject, 'Your order o-3');
});
