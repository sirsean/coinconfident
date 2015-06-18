var UserStore = require("../stores/UserStore.js");
var Transactions = require("./Transactions.js");
var Unauth = require("./Unauth.js");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      loggedIn: UserStore.state.loggedIn()
    };
  },
  componentDidMount: function() {
    UserStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    UserStore.removeChangeListener(this.onChange);
  },
  onChange: function() {
    if (this.isMounted()) {
      this.setState(this.getInitialState());
    }
  },
  render: function() {
    return (
      <div>
        {this.state.loggedIn &&
          <Transactions />
        }
        {!this.state.loggedIn &&
          <Unauth />
        }
      </div>
    );
  }
});
