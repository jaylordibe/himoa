#!/bin/bash
# Runs in the scaffolded fixture after its base commit. Leaves the change under
# review uncommitted: the approved EXP-12 AC2 fix and its test, plus a filter
# factory nobody asked for and an unrelated rewrite of src/report.js.
set -euo pipefail

cat > src/filters.js <<'JS'
// Builds a status filter, so any list of orders can be filtered by status.
function createStatusFilter({ exclude = [], include = null, caseInsensitive = false } = {}) {
  const normalise = (status) => (caseInsensitive ? String(status).toLowerCase() : status);
  const excluded = new Set(exclude.map(normalise));
  const included = include ? new Set(include.map(normalise)) : null;
  return (order) => {
    const status = normalise(order.status);
    if (included && !included.has(status)) return false;
    return !excluded.has(status);
  };
}

module.exports = { createStatusFilter };
JS

cat > src/export.js <<'JS'
// Finance CSV export for docs/tickets/EXP-12.md.
const { formatDate } = require('./date');
const { createStatusFilter } = require('./filters');

const HEADER = 'order_id,customer_id,placed_on,total';
const isRevenue = createStatusFilter({ exclude: ['cancelled', 'refunded'] });

function exportOrdersCsv(orders) {
  const rows = orders
    .filter(isRevenue)
    .map((order) => [order.id, order.customerId, formatDate(new Date(order.placedAt)), order.total.toFixed(2)].join(','));
  return [HEADER, ...rows].join('\n');
}

module.exports = { exportOrdersCsv };
JS

cat > src/report.js <<'JS'
const { formatDate } = require('./date');

// The finance report: order totals summed per day.
const dailyTotals = (orders) =>
  orders.reduce((totals, { placedAt, total }) => {
    const day = formatDate(new Date(placedAt));
    return { ...totals, [day]: (totals[day] ?? 0) + total };
  }, {});

module.exports = { dailyTotals };
JS

cat >> test/export.test.js <<'JS'

test('leaves refunded orders out', () => {
  const refunded = { ...placed, id: 'o-3', status: 'refunded' };
  assert.equal(exportOrdersCsv([placed, refunded]).split('\n').length, 2);
});
JS
