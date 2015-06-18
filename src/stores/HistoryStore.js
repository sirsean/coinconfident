var Store = require("./Store.js");
var Actions = require("../actions/Actions.js");

var latest = null;
var average = null;

module.exports = new Store({
  state: {
    latest: function() {
      return latest;
    },
    average: function() {
      return average;
    }
  },
  handlers: {
    "LOAD_LATEST_HISTORY": function() {
      $.ajax({
        method: "GET",
        url: "/api/history/latest",
        dataType: "json",
        success: function(response) {
          Actions.gotLatestHistory(response);
        }
      });
    },
    "GOT_LATEST_HISTORY": function(action) {
      latest = action.history;
    },
    "RELOAD_HISTORY": function() {
      $.ajax({
        method: "POST",
        url: "/api/history/reload"
      });
    },
    "LOAD_AVERAGE_HISTORY": function() {
      $.ajax({
        method: "GET",
        url: "/api/history/average",
        dataType: "json",
        success: function(response) {
          Actions.gotAverageHistory(response);
        }
      });
    },
    "GOT_AVERAGE_HISTORY": function(action) {
      average = action.average;
    }
  }
});
