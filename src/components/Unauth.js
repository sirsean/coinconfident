module.exports = React.createClass({
  signin: function() {
    window.location = "/login";
  },
  render: function() {
    return (
      <div>
        <div className="unauth">
          <strong>CoinConfident</strong> shows you how the current price of Bitcoin compares to recent trends &mdash; that way you'll know when it's a good time to spend your Bitcoins. Stay informed, remove the uncertainty, and  spend your coin confidently.

          <div className="signin-row row center-xs middle-xs">
            <button className="signin" onClick={this.signin}>Sign in with Coinbase</button>
          </div>
        </div>

        <div className="bottom">
          removing uncertainty
          <span className="divider">|</span>
          <strong>inspiring confidence</strong>
        </div>
      </div>
    );
  }
});
