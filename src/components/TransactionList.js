var Transaction = require("./Transaction.js");

module.exports = React.createClass({
  render: function() {
    return (
      <div className="transaction-list">
        <div className="title">Spending history</div>
        {this.props.transactions.map(function(t, i) {
          return <Transaction key={t.Id} transaction={t} index={i} />
        })}
      </div>
    );
  }
});
