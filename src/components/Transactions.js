var TransactionStore = require("../stores/TransactionStore.js");
var HistoryStore = require("../stores/HistoryStore.js");
var Socket = require("../util/Socket.js");
var TransactionList = require("./TransactionList.js");
var SentSummary = require("./SentSummary.js");
var Recommendation = require("./Recommendation.js");
var Actions = require("../actions/Actions.js");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      transactions: TransactionStore.state.sentTransactions(),
      average: HistoryStore.state.average()
    };
  },
  componentDidMount: function() {
    TransactionStore.addChangeListener(this.onChange);
    HistoryStore.addChangeListener(this.onChange);

    Actions.loadAverageHistory();

    Socket.connect();
  },
  componentWillUnmount: function() {
    TransactionStore.removeChangeListener(this.onChange);
    HistoryStore.removeChangeListener(this.onChange);

    Socket.disconnect();
  },
  onChange: function() {
    if (this.isMounted()) {
      this.setState(this.getInitialState());
    }
  },
  render: function() {
    var hasTransactions = this.state.transactions && this.state.transactions.length > 0;
    return (
      <div>
        <Recommendation average={this.state.average} />
        {hasTransactions &&
          <div>
            <SentSummary transactions={this.state.transactions} />
            <TransactionList transactions={this.state.transactions} />
          </div>
        }
        {!hasTransactions &&
          <div className="margin-zero row middle-xs center-xs">
            <p><em>You have not spent any Bitcoins.</em></p>
          </div>
        }
      </div>
    );
  }
});
