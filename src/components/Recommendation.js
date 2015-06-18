var SimpleCurrency = require("./SimpleCurrency.js");
var Link = ReactRouter.Link;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      showDetailed: false
    };
  },
  average: function() {
    if (this.props.average) {
      return this.props.average.Average;
    } else {
      return 0;
    }
  },
  current: function() {
    if (this.props.average) {
      return parseFloat(this.props.average.Latest.Price);
    } else {
      return 0;
    }
  },
  difference: function() {
    return this.current() - this.average();
  },
  percentDifference: function() {
    return (this.difference() / this.average() * 100);
  },
  recommendation: function() {
    var percent = this.percentDifference();
    if (percent >= 0) {
      return "Good time to spend bitcoins.";
    } else {
      return "Good time to spend dollars.";
    }
  },
  recommendedCurrency: function() {
    if (this.percentDifference() >= 0) {
      return "\u0243";
    } else {
      return "$";
    }
  },
  toggleDetailed: function() {
    this.setState({
      showDetailed: !this.state.showDetailed
    });
  },
  render: function() {
    var current = this.current();
    var average = this.average();
    var percentDifference = this.percentDifference();
    var recommendation = this.recommendation();
    var currency = this.recommendedCurrency();
    return (
      <div className="recommendation">
        <div className="row center-xs middle-xs">
          <div className="recommendation-currency">{currency}</div>
        </div>
        <div className="row center-xs middle-xs">
          <div className="recommendation-blurb">{recommendation}</div>
        </div>
        {!this.state.showDetailed &&
        <div className="why row center-xs middle-xs">
          <a className="button" onClick={this.toggleDetailed}>want to know why? <span className="arrow">&#9660;</span></a>
        </div>
        }
        {this.state.showDetailed &&
        <div>
          <div className="row center-xs middle-xs">
            {percentDifference >= 0 &&
            <div className="recommendation-description">
              <strong>The current price of Bitcoin is <SimpleCurrency amount={{Currency: "USD", Amount: current}} />.</strong>
              <br />
              This is <em>above</em> the <Link to="recent_trend">recent trend</Link>, which means now is a good time to feel confident spending your Bitcoins.
            </div>
            }
            {percentDifference < 0 &&
            <div className="recommendation-description">
              <strong>The current price of Bitcoin is <SimpleCurrency amount={{Currency: "USD", Amount: current}} />.</strong>
              <br />
              This is <em>below</em> the <Link to="recent_trend">recent trend</Link>, which means it may not be an ideal time to spend your Bitcoins.
            </div>
            }
          </div>
          <div className="why row center-xs middle-xs">
            <a className="button" onClick={this.toggleDetailed}>close <span className="arrow">&#9650;</span></a>
          </div>
        </div>
        }
      </div>
    );
  }
});
