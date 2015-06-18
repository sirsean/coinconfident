require("../util/Round.js");
var SimpleCurrency = require("./SimpleCurrency.js");
var Model = require("../util/Model.js");

module.exports = React.createClass({
  render: function() {
    var originalSent = 0;
    var currentSent = 0;

    this.props.transactions.forEach(function(t) {
      originalSent += parseFloat(t.OriginalConversion.Amount);
      currentSent += parseFloat(t.CurrentConversion.Amount);
    });

    var difference = currentSent - originalSent;
    var sentPercent = Math.round10(difference / originalSent * 100, 0).toFixed(0);

    var percentClassName = "number sent-percent " + ((sentPercent >= 0) ? "percent-up" : "percent-down");
    var percentSymbolClassName = "percent " + ((sentPercent >= 0) ? "percent-up" : "percent-down");

    var arrow;
    if (sentPercent >= 0) {
      arrow = <div className="arrow up">&#8593;</div>;
    } else {
      arrow = <div className="arrow down">&#8595;</div>;
    }

    return (
      <div className="sent-summary">
        <div className="margin-zero row">
          <div className="padding-zero title col-xs-12">
            Total Bitcoins Spent
          </div>
        </div>
        <div className="details margin-zero row center-xs end-xs">
          <div className="col-xs-4">
            <SimpleCurrency amount={{Currency: "USD", Amount: -originalSent}} />
            <span className="subtitle">value then</span>
          </div>
          <div className="col-xs-4">
            <SimpleCurrency amount={{Currency: "USD", Amount: -currentSent}} />
            <span className="subtitle">current value</span>
          </div>
          <div className="col-xs-4 top-xs middle-xs">
            <div className="row top-xs">
              {arrow}
              <div className={percentClassName}>{Math.abs(sentPercent)}</div>
              <div className={percentSymbolClassName}>%</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
