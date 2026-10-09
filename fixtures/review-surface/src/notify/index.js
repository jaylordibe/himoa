const { createChannel } = require('./registry');

// Sends the order-confirmation message. `options.channel` selects the channel.
async function sendOrderConfirmation(order, customer, transport, options = {}) {
  const channel = createChannel(options.channel ?? 'email', transport);
  return channel.send(customer, {
    subject: `Your order ${order.id}`,
    body: `Thanks for your order, ${customer.name}.`,
  });
}

module.exports = { sendOrderConfirmation };
