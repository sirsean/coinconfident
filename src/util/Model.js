module.exports = {
  isComplete: function(transaction) {
    return transaction.Status == "complete";
  },
  isSent: function(amount) {
    return amount.Amount < 0;
  },
  isReceived: function(amount) {
    return amount.Amount > 0;
  },
  isDateAfter: function(a, b) {
    var aDate = new Date(a);
    var bDate = new Date(b);

    return aDate > bDate;
  }
};
