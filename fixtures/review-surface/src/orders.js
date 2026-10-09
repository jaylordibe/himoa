const db = require('./db');

// The support dashboard's order list, with each order's customer name.
async function listOrdersWithCustomers({ limit } = {}) {
  const orders = await db.findOrders({ limit });
  const rows = [];
  for (const order of orders) {
    const customer = await db.findCustomerById(order.customerId);
    rows.push({ ...order, customerName: customer ? customer.name : null });
  }
  return rows;
}

module.exports = { listOrdersWithCustomers };
