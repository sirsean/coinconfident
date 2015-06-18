var Store = require("./Store.js");

var user = Global.user;

module.exports = new Store({
  state: {
    user: function() {
      return user;
    },
    loggedIn: function() {
      return (user && user.Id);
    }
  }
});
