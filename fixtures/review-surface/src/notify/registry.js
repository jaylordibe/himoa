const { EmailChannel } = require('./email-channel');

// Channels by name, so new channels can be added later.
const channelFactories = {
  email: (transport) => new EmailChannel(transport),
};

function createChannel(name, transport) {
  const factory = channelFactories[name];
  if (!factory) {
    throw new Error(`unknown notification channel: ${name}`);
  }
  return factory(transport);
}

module.exports = { createChannel };
