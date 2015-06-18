var RouteHandler = ReactRouter.RouteHandler;

var UserStore = require("../stores/UserStore.js");
var UserBar = require("./UserBar.js");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      user: UserStore.state.user(),
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
        <UserBar user={this.state.user} />
        <RouteHandler />
      </div>
    );
  }
});
