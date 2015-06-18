var Store = require("./Store.js");
var Model = require("../util/Model.js");

var transactions = {};
var sortedTransactions = [];
var sortedSentTransactions = [];

function transactionComparator(a, b) {
  var aDate = new Date(a.CreatedAt);
  var bDate = new Date(b.CreatedAt);
  if (aDate < bDate) {
    return 1;
  } else if (aDate > bDate) {
    return -1;
  } else {
    return 0;
  }
}

function sortTransactions() {
  sortedTransactions = [];
  for (var id in transactions) {
    if (transactions.hasOwnProperty(id)) {
      sortedTransactions.push(transactions[id]);
    }
  }
  sortedTransactions.sort(transactionComparator);
}

function sortSentTransactions() {
  sortedSentTransactions = [];
  for (var id in transactions) {
    if (transactions.hasOwnProperty(id)) {
      var t = transactions[id];
      if (Model.isSent(t.Amount) && Model.isComplete(t)) {
        sortedSentTransactions.push(t);
      }
    }
  }
  sortedSentTransactions.sort(transactionComparator);
}

module.exports = new Store({
  state: {
    transactions: function() {
      sortTransactions();
      return sortedTransactions;
    },
    sentTransactions: function() {
      sortSentTransactions();
      return sortedSentTransactions;
    }
  },
  handlers: {
    "GOT_TRANSACTION": function(action) {
      action.transaction.OriginalConversion.Amount = parseFloat(action.transaction.OriginalConversion.Amount);
      action.transaction.CurrentConversion.Amount = parseFloat(action.transaction.CurrentConversion.Amount);
      transactions[action.transaction.Id] = action.transaction;
    }
  }
});
