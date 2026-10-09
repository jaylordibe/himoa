// Calendar date of an instant, as YYYY-MM-DD.
function formatDate(instant) {
  return instant.toISOString().slice(0, 10);
}

module.exports = { formatDate };
