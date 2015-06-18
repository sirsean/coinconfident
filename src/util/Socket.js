var Actions = require("../actions/Actions.js");

var conn = null;

module.exports = {
  connect: function() {
    console.log("connecting");
    conn = new WebSocket("ws://" + location.host + "/ws");
    conn.onclose = function(e) {
      console.log("connection closed", e);
    },
    conn.onmessage = function(e) {
      // assuming we're only receiving transactions
      Actions.gotTransaction(JSON.parse(e.data));
    }
  },
  disconnect: function() {
    conn.close();
  },
  send: function(obj) {
    conn.send(JSON.stringify(obj));
  }
};
