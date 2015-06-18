var Dispatcher = require("../dispatcher/Dispatcher.js");

module.exports = {
  gotTransaction: function(transaction) {
    Dispatcher.dispatch({
      type: "GOT_TRANSACTION",
      transaction: transaction
    });
  },
  loadLatestHistory: function() {
    Dispatcher.dispatch({
      type: "LOAD_LATEST_HISTORY"
    });
  },
  gotLatestHistory: function(history) {
    Dispatcher.dispatch({
      type: "GOT_LATEST_HISTORY",
      history: history
    });
  },
  reloadHistory: function() {
    Dispatcher.dispatch({
      type: "RELOAD_HISTORY"
    });
  },
  loadAverageHistory: function() {
    Dispatcher.dispatch({
      type: "LOAD_AVERAGE_HISTORY"
    });
  },
  gotAverageHistory: function(average) {
    Dispatcher.dispatch({
      type: "GOT_AVERAGE_HISTORY",
      average: average
    });
  }
};
