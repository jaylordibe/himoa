// Base class every notification channel extends.
class NotificationChannel {
  async send(_recipient, _message) {
    throw new Error('send() must be implemented by a channel');
  }
}

module.exports = { NotificationChannel };
