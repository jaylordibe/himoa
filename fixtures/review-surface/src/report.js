const { formatDate } = require('./date');

// The finance report: order totals summed per day.
function dailyTotals(orders) {
  const totals = {};
  for (const order of orders) {
    const day = formatDate(new Date(order.placedAt));
    totals[day] = (totals[day] ?? 0) + order.total;
  }
  return totals;
}

module.exports = { dailyTotals };
