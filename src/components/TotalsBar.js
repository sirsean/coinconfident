require("../util/Round.js");
var SimpleCurrency = require("./SimpleCurrency.js");
var Model = require("../util/Model.js");

module.exports = React.createClass({
  render: function() {
    var numTransactions = this.props.transactions.length;
    var totalBitcoin = 0;
    var totalOriginalDollars = 0;
    var totalCurrentDollars = 0;

    var originalSent = 0;
    var originalReceived = 0;
    var currentSent = 0;
    var currentReceived = 0;

    this.props.transactions.forEach(function(t) {
      totalBitcoin += parseFloat(t.Amount.Amount);
      totalOriginalDollars += parseFloat(t.OriginalConversion.Amount);
      totalCurrentDollars += parseFloat(t.CurrentConversion.Amount);
      if (Model.isSent(t.Amount)) {
        originalSent += parseFloat(t.OriginalConversion.Amount);
        currentSent += parseFloat(t.CurrentConversion.Amount);
      } else {
        originalReceived += parseFloat(t.OriginalConversion.Amount);
        currentReceived += parseFloat(t.CurrentConversion.Amount);
      }
    });

    var sentPercent = (currentSent - originalSent) / originalSent * 100;
    var receivedPercent = (currentReceived - originalReceived) / originalReceived * 100;

    return (
      <div className="row middle-lg">
        <div className="col-lg-4">
          <span>{numTransactions} transactions</span>
        </div>
        <div className="col-lg-2">
          <SimpleCurrency amount={{Currency: "BTC", Amount: totalBitcoin}} />
        </div>
        <div className="col-lg-2">
          sent
          <SimpleCurrency amount={{Currency: "USD", Amount: originalSent}} />
          <SimpleCurrency amount={{Currency: "USD", Amount: currentSent}} />
          <div>{sentPercent.toFixed(0)}%</div>
        </div>
        <div className="col-lg-2">
          received
          <SimpleCurrency amount={{Currency: "USD", Amount: originalReceived}} />
          <SimpleCurrency amount={{Currency: "USD", Amount: currentReceived}} />
          <div>{receivedPercent.toFixed(0)}%</div>
        </div>
      </div>
    );
  }
});
