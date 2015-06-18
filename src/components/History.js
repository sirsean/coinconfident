var HistoryStore = require("../stores/HistoryStore.js");
var Actions = require("../actions/Actions.js");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      latest: HistoryStore.state.latest()
    };
  },
  componentDidMount: function() {
    HistoryStore.addChangeListener(this.onChange);
    Actions.loadLatestHistory();
  },
  componentWillUnmount: function() {
    HistoryStore.removeChangeListener(this.onChange);
  },
  onChange: function() {
    if (this.isMounted()) {
      this.setState(this.getInitialState());
    }
  },
  reload: function() {
    Actions.reloadHistory();
  },
  render: function() {
    return (
      <div>
        <div>
          <h2>Latest History</h2>
          {this.state.latest &&
            <div>
              <p>At {this.state.latest.At}</p>
              <p>${this.state.latest.Price}</p>
            </div>
          }
          {!this.state.latest &&
            <div>
              <p><em>None</em></p>
            </div>
          }
        </div>
        <div>
          <h2>Reload History</h2>
          <button onClick={this.reload}>Reload</button>
        </div>
      </div>
    );
  }
});
