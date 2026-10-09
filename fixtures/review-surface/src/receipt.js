const { formatDate } = require('./date');

// The receipt emailed to a customer after checkout. `customer.timeZone` is the
// IANA zone the customer chose at sign-up, for example "Pacific/Auckland".
function renderReceipt(order, customer) {
  return [
    `Receipt for order ${order.id}`,
    `Hello ${customer.name},`,
    `Date: ${formatDate(new Date(order.placedAt))}`,
    `Total: ${order.total.toFixed(2)}`,
  ].join('\n');
}

module.exports = { renderReceipt };
