require("../util/Round.js");

var SYMBOLS = {
  USD: "$",
  BTC: "\u0243"
};

var DECIMALS = {
  USD: -2,
  BTC: -8
};

module.exports = React.createClass({
  render: function() {
    var currency = this.props.amount.Currency;
    var decimals = DECIMALS[currency];
    var amount = Math.abs(Math.round10(parseFloat(this.props.amount.Amount), decimals).toFixed(0));

    if (amount >= 1000000000) {
      amount = (amount / 1000000000).toFixed(2) + "B";
    } else if (amount >= 10000000) {
      amount = (amount / 1000000).toFixed(1) + "M";
    } else if (amount >= 1000000) {
      amount = (amount / 1000000).toFixed(2) + "M";
    } else if (amount >= 100000) {
      amount = (amount / 1000).toFixed(0) + "K";
    } else {
      amount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    var symbol = SYMBOLS[currency];
    if (!symbol) {
      symbol = currency;
    }

    return (
      <span className="currency">
        <span className="symbol">{symbol}</span>
        <span className="amount number">{amount}</span>
      </span>
    );
  }
});
