var RouteHandler = ReactRouter.RouteHandler;
var Link = ReactRouter.Link;

module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <ul>
          <li><Link to="history">History</Link></li>
          <li><Link to="sessions">Sessions</Link></li>
        </ul>
        <RouteHandler />
      </div>
    );
  }
});
