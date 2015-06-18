require("../util/Round.js");
var Participant = require("./Participant.js");
var SimpleCurrency = require("./SimpleCurrency.js");
var SimpleDate = require("./SimpleDate.js");
var Model = require("../util/Model.js");

module.exports = React.createClass({
  render: function() {
    var t = this.props.transaction;

    var sent = Model.isSent(t.Amount);

    var difference = Math.round10(parseFloat(t.OriginalConversion.Amount) - parseFloat(t.CurrentConversion.Amount), 0);

    var transactionClassName = "transaction row middle-xs";
    if (difference >= 1) {
      transactionClassName += " up";
    } else if (difference <= -1) {
      transactionClassName += " down";
    } else {
      transactionClassName += " flat";
    }

    if (this.props.index % 2 == 0) {
      transactionClassName += " even";
    } else {
      transactionClassName += " odd";
    }

    return (
      <div className={transactionClassName}>
        <div className="col-xs-2 center-xs middle-xs">
          <SimpleDate date={t.CreatedAt} />
        </div>
        <div className="col-xs-6">
          <Participant to={true} participant={t.Recipient} recipientAddress={t.RecipientAddress} />
        </div>
        <div className="col-xs-2 end-xs">
          <SimpleCurrency amount={t.OriginalConversion} />
          <span className="when">then</span>
        </div>
        <div className="col-xs-2 end-xs">
          <SimpleCurrency amount={t.CurrentConversion} />
          <span className="when">now</span>
        </div>
      </div>
    );
  }
});
