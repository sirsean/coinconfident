var Link = ReactRouter.Link;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      adminUserId: "516aaecc4dc721e11600002e"
    };
  },
  renderLoggedIn: function() {
    return (
      <div className="user-bar row between-xs middle-xs">
        <div className="padding-zero col-xs-4">
          <img src="/img/logo.png" width="48" height="48" />
        </div>
        <div className="col-xs-4">
          <div className="row end-xs"><a href="/logout">Sign Out</a></div>
        </div>
      </div>
    );
  },
  renderLoggedOut: function() {
    return (
      <div className="unauth-top">
        <div className="unauth-header">
          <div className="margin-zero row center-xs middle-xs">
            <img src="/img/logo.png" width="80" height="80" />
          </div>
          <div className="title margin-zero row center-xs middle-xs">
            CoinConfident
          </div>
        </div>
      </div>
    );
  },
  render: function() {
    if (this.props.user && this.props.user.Id) {
      return this.renderLoggedIn();
    } else {
      return this.renderLoggedOut();
    }
  }
});
