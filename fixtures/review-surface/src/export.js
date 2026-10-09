// Finance CSV export for docs/tickets/EXP-12.md.
const { formatDate } = require('./date');

const HEADER = 'order_id,customer_id,placed_on,total';

function exportOrdersCsv(orders) {
  const rows = orders
    .filter((order) => order.status !== 'cancelled')
    .map((order) => [order.id, order.customerId, formatDate(new Date(order.placedAt)), order.total.toFixed(2)].join(','));
  return [HEADER, ...rows].join('\n');
}

module.exports = { exportOrdersCsv };
