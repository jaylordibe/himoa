// Data access. In production each exported function is one round trip to the
// orders database. This in-memory store stands in for it in tests, and
// `roundTrips` counts calls so a test can observe query volume.
const state = { orders: [], customers: [], roundTrips: 0 };

function seed({ orders = [], customers = [] } = {}) {
  state.orders = orders;
  state.customers = customers;
  state.roundTrips = 0;
}

async function findOrders({ limit = 50 } = {}) {
  state.roundTrips += 1;
  return state.orders.slice(0, limit);
}

async function findCustomerById(customerId) {
  state.roundTrips += 1;
  return state.customers.find((customer) => customer.id === customerId) ?? null;
}

async function findCustomersByIds(customerIds) {
  state.roundTrips += 1;
  const wanted = new Set(customerIds);
  return state.customers.filter((customer) => wanted.has(customer.id));
}

function roundTrips() {
  return state.roundTrips;
}

module.exports = { seed, findOrders, findCustomerById, findCustomersByIds, roundTrips };
