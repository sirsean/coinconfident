var RouteHandler = ReactRouter.RouteHandler;
var Link = ReactRouter.Link;

module.exports = React.createClass({
  render: function() {
    return (
      <div className="help">
        <Link to="app">&lt; Back</Link>
        <RouteHandler />
      </div>
    );
  }
});
