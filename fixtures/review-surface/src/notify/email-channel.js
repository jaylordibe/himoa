const { NotificationChannel } = require('./channel');

class EmailChannel extends NotificationChannel {
  constructor(transport) {
    super();
    this.transport = transport;
  }

  async send(recipient, message) {
    return this.transport.deliver({ to: recipient.email, subject: message.subject, body: message.body });
  }
}

module.exports = { EmailChannel };
