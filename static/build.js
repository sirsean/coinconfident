(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Dispatcher = require("../dispatcher/Dispatcher.js");

module.exports = {
  gotTransaction: function(transaction) {
    Dispatcher.dispatch({
      type: "GOT_TRANSACTION",
      transaction: transaction
    });
  },
  loadLatestHistory: function() {
    Dispatcher.dispatch({
      type: "LOAD_LATEST_HISTORY"
    });
  },
  gotLatestHistory: function(history) {
    Dispatcher.dispatch({
      type: "GOT_LATEST_HISTORY",
      history: history
    });
  },
  reloadHistory: function() {
    Dispatcher.dispatch({
      type: "RELOAD_HISTORY"
    });
  },
  loadAverageHistory: function() {
    Dispatcher.dispatch({
      type: "LOAD_AVERAGE_HISTORY"
    });
  },
  gotAverageHistory: function(average) {
    Dispatcher.dispatch({
      type: "GOT_AVERAGE_HISTORY",
      average: average
    });
  }
};

},{"../dispatcher/Dispatcher.js":22}],2:[function(require,module,exports){
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;

var App = require("./components/App.js");
var Main = require("./components/Main.js");
var Support = require("./components/Support.js");
var History = require("./components/History.js");
var Sessions = require("./components/Sessions.js");
var SupportMain = require("./components/SupportMain.js");
var Help = require("./components/Help.js");
var HelpMain = require("./components/HelpMain.js");
var HelpMovingAverage = require("./components/HelpMovingAverage.js");

var routes = (
  React.createElement(Route, {name: "app", path: "/", handler: App}, 
    React.createElement(Route, {name: "support", handler: Support}, 
      React.createElement(Route, {name: "history", handler: History}), 
      React.createElement(Route, {name: "sessions", handler: Sessions}), 
      React.createElement(DefaultRoute, {handler: SupportMain})
    ), 
    React.createElement(Route, {name: "help", handler: Help}, 
      React.createElement(Route, {name: "recent_trend", handler: HelpMovingAverage}), 
      React.createElement(DefaultRoute, {handler: HelpMain})
    ), 
    React.createElement(DefaultRoute, {handler: Main})
  )
);

ReactRouter.run(routes, function(Handler) {
  React.render(React.createElement(Handler, null), document.body);
});

},{"./components/App.js":3,"./components/Help.js":4,"./components/HelpMain.js":5,"./components/HelpMovingAverage.js":6,"./components/History.js":7,"./components/Main.js":8,"./components/Sessions.js":12,"./components/Support.js":15,"./components/SupportMain.js":16}],3:[function(require,module,exports){
var RouteHandler = ReactRouter.RouteHandler;

var UserStore = require("../stores/UserStore.js");
var UserBar = require("./UserBar.js");

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {
      user: UserStore.state.user(),
    };
  },
  componentDidMount: function() {
    UserStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    UserStore.removeChangeListener(this.onChange);
  },
  onChange: function() {
    if (this.isMounted()) {
      this.setState(this.getInitialState());
    }
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(UserBar, {user: this.state.user}), 
        React.createElement(RouteHandler, null)
      )
    );
  }
});

},{"../stores/UserStore.js":26,"./UserBar.js":21}],4:[function(require,module,exports){
var RouteHandler = ReactRouter.RouteHandler;
var Link = ReactRouter.Link;

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.createElement("div", {className: "help"}, 
        React.createElement(Link, {to: "app"}, "< Back"), 
        React.createElement(RouteHandler, null)
      )
    );
  }
});

},{}],5:[function(require,module,exports){
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.createElement("div", null
      )
    );
  }
});

},{}],6:[function(require,module,exports){
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("p", null, "We calculate the recent trend of Bitcoin based on a moving average, which is intended to smooth out random price fluctuations to give a better idea of what the price of Bitcoin has been doing recently."), 
        React.createElement("p", null, "We use a 14-day moving average over the past 30 days. This means that we're taking the average price over rolling 14 day periods, starting 30 days ago, and then we average those averages into a single total."), 
        React.createElement("p", null, "If the current price is above this moving average, it means that Bitcoin is \"high\" right now and it's a good time to spend them. If the current price is below that moving average, it's \"low\" and you'd be better off hanging onto them for now.")
      )
    );
  }
});

},{}],7:[function(require,module,exports){
var HistoryStore = require("../stores/HistoryStore.js");
var Actions = require("../actions/Actions.js");

module.exports = React.createClass({displayName: 'exports',
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
      React.createElement("div", null, 
        React.createElement("div", null, 
          React.createElement("h2", null, "Latest History"), 
          this.state.latest &&
            React.createElement("div", null, 
              React.createElement("p", null, "At ", this.state.latest.At), 
              React.createElement("p", null, "$", this.state.latest.Price)
            ), 
          
          !this.state.latest &&
            React.createElement("div", null, 
              React.createElement("p", null, React.createElement("em", null, "None"))
            )
          
        ), 
        React.createElement("div", null, 
          React.createElement("h2", null, "Reload History"), 
          React.createElement("button", {onClick: this.reload}, "Reload")
        )
      )
    );
  }
});

},{"../actions/Actions.js":1,"../stores/HistoryStore.js":23}],8:[function(require,module,exports){
var UserStore = require("../stores/UserStore.js");
var Transactions = require("./Transactions.js");
var Unauth = require("./Unauth.js");

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {
      loggedIn: UserStore.state.loggedIn()
    };
  },
  componentDidMount: function() {
    UserStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    UserStore.removeChangeListener(this.onChange);
  },
  onChange: function() {
    if (this.isMounted()) {
      this.setState(this.getInitialState());
    }
  },
  render: function() {
    return (
      React.createElement("div", null, 
        this.state.loggedIn &&
          React.createElement(Transactions, null), 
        
        !this.state.loggedIn &&
          React.createElement(Unauth, null)
        
      )
    );
  }
});

},{"../stores/UserStore.js":26,"./Transactions.js":19,"./Unauth.js":20}],9:[function(require,module,exports){
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    var direction;
    if (this.props.from) {
      direction = "From";
    } else if (this.props.to) {
      direction = "To";
    }

    var name = this.props.participant.Name;
    if (!name) {
      name = React.createElement("em", null, "Unknown");
    } else if (name.length > 18) {
      name = name.substring(0, 18) + "...";
    }

    return (
      React.createElement("div", {className: "participant"}, 
        React.createElement("div", {className: "title-light"}, direction), 
        React.createElement("span", {className: "participant-name"}, name)
      )
    );
  }
});

},{}],10:[function(require,module,exports){
var SimpleCurrency = require("./SimpleCurrency.js");
var Link = ReactRouter.Link;

module.exports = React.createClass({displayName: 'exports',
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
      React.createElement("div", {className: "recommendation"}, 
        React.createElement("div", {className: "row center-xs middle-xs"}, 
          React.createElement("div", {className: "recommendation-currency"}, currency)
        ), 
        React.createElement("div", {className: "row center-xs middle-xs"}, 
          React.createElement("div", {className: "recommendation-blurb"}, recommendation)
        ), 
        !this.state.showDetailed &&
        React.createElement("div", {className: "why row center-xs middle-xs"}, 
          React.createElement("a", {className: "button", onClick: this.toggleDetailed}, "want to know why? ", React.createElement("span", {className: "arrow"}, "▼"))
        ), 
        
        this.state.showDetailed &&
        React.createElement("div", null, 
          React.createElement("div", {className: "row center-xs middle-xs"}, 
            percentDifference >= 0 &&
            React.createElement("div", {className: "recommendation-description"}, 
              React.createElement("strong", null, "The current price of Bitcoin is ", React.createElement(SimpleCurrency, {amount: {Currency: "USD", Amount: current}}), "."), 
              React.createElement("br", null), 
              "This is ", React.createElement("em", null, "above"), " the ", React.createElement(Link, {to: "recent_trend"}, "recent trend"), ", which means now is a good time to feel confident spending your Bitcoins."
            ), 
            
            percentDifference < 0 &&
            React.createElement("div", {className: "recommendation-description"}, 
              React.createElement("strong", null, "The current price of Bitcoin is ", React.createElement(SimpleCurrency, {amount: {Currency: "USD", Amount: current}}), "."), 
              React.createElement("br", null), 
              "This is ", React.createElement("em", null, "below"), " the ", React.createElement(Link, {to: "recent_trend"}, "recent trend"), ", which means it may not be an ideal time to spend your Bitcoins."
            )
            
          ), 
          React.createElement("div", {className: "why row center-xs middle-xs"}, 
            React.createElement("a", {className: "button", onClick: this.toggleDetailed}, "close ", React.createElement("span", {className: "arrow"}, "▲"))
          )
        )
        
      )
    );
  }
});

},{"./SimpleCurrency.js":13}],11:[function(require,module,exports){
require("../util/Round.js");
var SimpleCurrency = require("./SimpleCurrency.js");
var Model = require("../util/Model.js");

module.exports = React.createClass({displayName: 'exports',
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
      arrow = React.createElement("div", {className: "arrow up"}, "↑");
    } else {
      arrow = React.createElement("div", {className: "arrow down"}, "↓");
    }

    return (
      React.createElement("div", {className: "sent-summary"}, 
        React.createElement("div", {className: "margin-zero row"}, 
          React.createElement("div", {className: "padding-zero title col-xs-12"}, 
            "Total Bitcoins Spent"
          )
        ), 
        React.createElement("div", {className: "details margin-zero row center-xs end-xs"}, 
          React.createElement("div", {className: "col-xs-4"}, 
            React.createElement(SimpleCurrency, {amount: {Currency: "USD", Amount: -originalSent}}), 
            React.createElement("span", {className: "subtitle"}, "value then")
          ), 
          React.createElement("div", {className: "col-xs-4"}, 
            React.createElement(SimpleCurrency, {amount: {Currency: "USD", Amount: -currentSent}}), 
            React.createElement("span", {className: "subtitle"}, "current value")
          ), 
          React.createElement("div", {className: "col-xs-4 top-xs middle-xs"}, 
            React.createElement("div", {className: "row top-xs"}, 
              arrow, 
              React.createElement("div", {className: percentClassName}, Math.abs(sentPercent)), 
              React.createElement("div", {className: percentSymbolClassName}, "%")
            )
          )
        )
      )
    );
  }
});

},{"../util/Model.js":27,"../util/Round.js":28,"./SimpleCurrency.js":13}],12:[function(require,module,exports){
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("p", null, "sessions")
      )
    );
  }
});

},{}],13:[function(require,module,exports){
require("../util/Round.js");

var SYMBOLS = {
  USD: "$",
  BTC: "\u0243"
};

var DECIMALS = {
  USD: -2,
  BTC: -8
};

module.exports = React.createClass({displayName: 'exports',
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
      React.createElement("span", {className: "currency"}, 
        React.createElement("span", {className: "symbol"}, symbol), 
        React.createElement("span", {className: "amount number"}, amount)
      )
    );
  }
});

},{"../util/Round.js":28}],14:[function(require,module,exports){
var MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    var d = new Date(this.props.date);

    var month = MONTH_NAMES[d.getMonth()];
    var day = d.getDate();

    var year;
    if (d.getYear() != (new Date()).getYear()) {
      year = d.getYear() + 1900;
    }

    return (
      React.createElement("div", {className: "date-light"}, 
        React.createElement("div", {className: "day number"}, day), 
        React.createElement("div", null, month), 
        year && React.createElement("div", {className: "number"}, year)
      )
    );
  }
});

},{}],15:[function(require,module,exports){
var RouteHandler = ReactRouter.RouteHandler;
var Link = ReactRouter.Link;

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("ul", null, 
          React.createElement("li", null, React.createElement(Link, {to: "history"}, "History")), 
          React.createElement("li", null, React.createElement(Link, {to: "sessions"}, "Sessions"))
        ), 
        React.createElement(RouteHandler, null)
      )
    );
  }
});

},{}],16:[function(require,module,exports){
module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("p", null, "support main")
      )
    );
  }
});

},{}],17:[function(require,module,exports){
require("../util/Round.js");
var Participant = require("./Participant.js");
var SimpleCurrency = require("./SimpleCurrency.js");
var SimpleDate = require("./SimpleDate.js");
var Model = require("../util/Model.js");

module.exports = React.createClass({displayName: 'exports',
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
      React.createElement("div", {className: transactionClassName}, 
        React.createElement("div", {className: "col-xs-2 center-xs middle-xs"}, 
          React.createElement(SimpleDate, {date: t.CreatedAt})
        ), 
        React.createElement("div", {className: "col-xs-6"}, 
          React.createElement(Participant, {to: true, participant: t.Recipient, recipientAddress: t.RecipientAddress})
        ), 
        React.createElement("div", {className: "col-xs-2 end-xs"}, 
          React.createElement(SimpleCurrency, {amount: t.OriginalConversion}), 
          React.createElement("span", {className: "when"}, "then")
        ), 
        React.createElement("div", {className: "col-xs-2 end-xs"}, 
          React.createElement(SimpleCurrency, {amount: t.CurrentConversion}), 
          React.createElement("span", {className: "when"}, "now")
        )
      )
    );
  }
});

},{"../util/Model.js":27,"../util/Round.js":28,"./Participant.js":9,"./SimpleCurrency.js":13,"./SimpleDate.js":14}],18:[function(require,module,exports){
var Transaction = require("./Transaction.js");

module.exports = React.createClass({displayName: 'exports',
  render: function() {
    return (
      React.createElement("div", {className: "transaction-list"}, 
        React.createElement("div", {className: "title"}, "Spending history"), 
        this.props.transactions.map(function(t, i) {
          return React.createElement(Transaction, {key: t.Id, transaction: t, index: i})
        })
      )
    );
  }
});

},{"./Transaction.js":17}],19:[function(require,module,exports){
var TransactionStore = require("../stores/TransactionStore.js");
var HistoryStore = require("../stores/HistoryStore.js");
var Socket = require("../util/Socket.js");
var TransactionList = require("./TransactionList.js");
var SentSummary = require("./SentSummary.js");
var Recommendation = require("./Recommendation.js");
var Actions = require("../actions/Actions.js");

module.exports = React.createClass({displayName: 'exports',
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
      React.createElement("div", null, 
        React.createElement(Recommendation, {average: this.state.average}), 
        hasTransactions &&
          React.createElement("div", null, 
            React.createElement(SentSummary, {transactions: this.state.transactions}), 
            React.createElement(TransactionList, {transactions: this.state.transactions})
          ), 
        
        !hasTransactions &&
          React.createElement("div", {className: "margin-zero row middle-xs center-xs"}, 
            React.createElement("p", null, React.createElement("em", null, "You have not spent any Bitcoins."))
          )
        
      )
    );
  }
});

},{"../actions/Actions.js":1,"../stores/HistoryStore.js":23,"../stores/TransactionStore.js":25,"../util/Socket.js":29,"./Recommendation.js":10,"./SentSummary.js":11,"./TransactionList.js":18}],20:[function(require,module,exports){
module.exports = React.createClass({displayName: 'exports',
  signin: function() {
    window.location = "/login";
  },
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "unauth"}, 
          React.createElement("strong", null, "CoinConfident"), " shows you how the current price of Bitcoin compares to recent trends — that way you'll know when it's a good time to spend your Bitcoins. Stay informed, remove the uncertainty, and  spend your coin confidently.", 

          React.createElement("div", {className: "signin-row row center-xs middle-xs"}, 
            React.createElement("button", {className: "signin", onClick: this.signin}, "Sign in with Coinbase")
          )
        ), 

        React.createElement("div", {className: "bottom"}, 
          "removing uncertainty", 
          React.createElement("span", {className: "divider"}, "|"), 
          React.createElement("strong", null, "inspiring confidence")
        )
      )
    );
  }
});

},{}],21:[function(require,module,exports){
var Link = ReactRouter.Link;

module.exports = React.createClass({displayName: 'exports',
  getInitialState: function() {
    return {
      adminUserId: "516aaecc4dc721e11600002e"
    };
  },
  renderLoggedIn: function() {
    return (
      React.createElement("div", {className: "user-bar row between-xs middle-xs"}, 
        React.createElement("div", {className: "padding-zero col-xs-4"}, 
          React.createElement("img", {src: "/img/logo.png", width: "48", height: "48"})
        ), 
        React.createElement("div", {className: "col-xs-4"}, 
          React.createElement("div", {className: "row end-xs"}, React.createElement("a", {href: "/logout"}, "Sign Out"))
        )
      )
    );
  },
  renderLoggedOut: function() {
    return (
      React.createElement("div", {className: "unauth-top"}, 
        React.createElement("div", {className: "unauth-header"}, 
          React.createElement("div", {className: "margin-zero row center-xs middle-xs"}, 
            React.createElement("img", {src: "/img/logo.png", width: "80", height: "80"})
          ), 
          React.createElement("div", {className: "title margin-zero row center-xs middle-xs"}, 
            "CoinConfident"
          )
        )
      )
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

},{}],22:[function(require,module,exports){
/*
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Dispatcher
 * @typechecks
 */

"use strict";

var _lastID = 1;
var _prefix = 'ID_';

/**
 * Dispatcher is used to broadcast payloads to registered callbacks. This is
 * different from generic pub-sub systems in two ways:
 *
 *   1) Callbacks are not subscribed to particular events. Every payload is
 *      dispatched to every registered callback.
 *   2) Callbacks can be deferred in whole or part until other callbacks have
 *      been executed.
 *
 * For example, consider this hypothetical flight destination form, which
 * selects a default city when a country is selected:
 *
 *   var flightDispatcher = new Dispatcher();
 *
 *   // Keeps track of which country is selected
 *   var CountryStore = {country: null};
 *
 *   // Keeps track of which city is selected
 *   var CityStore = {city: null};
 *
 *   // Keeps track of the base flight price of the selected city
 *   var FlightPriceStore = {price: null}
 *
 * When a user changes the selected city, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'city-update',
 *     selectedCity: 'paris'
 *   });
 *
 * This payload is digested by `CityStore`:
 *
 *   flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'city-update') {
 *       CityStore.city = payload.selectedCity;
 *     }
 *   });
 *
 * When the user selects a country, we dispatch the payload:
 *
 *   flightDispatcher.dispatch({
 *     actionType: 'country-update',
 *     selectedCountry: 'australia'
 *   });
 *
 * This payload is digested by both stores:
 *
 *    CountryStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       CountryStore.country = payload.selectedCountry;
 *     }
 *   });
 *
 * When the callback to update `CountryStore` is registered, we save a reference
 * to the returned token. Using this token with `waitFor()`, we can guarantee
 * that `CountryStore` is updated before the callback that updates `CityStore`
 * needs to query its data.
 *
 *   CityStore.dispatchToken = flightDispatcher.register(function(payload) {
 *     if (payload.actionType === 'country-update') {
 *       // `CountryStore.country` may not be updated.
 *       flightDispatcher.waitFor([CountryStore.dispatchToken]);
 *       // `CountryStore.country` is now guaranteed to be updated.
 *
 *       // Select the default city for the new country
 *       CityStore.city = getDefaultCityForCountry(CountryStore.country);
 *     }
 *   });
 *
 * The usage of `waitFor()` can be chained, for example:
 *
 *   FlightPriceStore.dispatchToken =
 *     flightDispatcher.register(function(payload) {
 *       switch (payload.actionType) {
 *         case 'country-update':
 *         case 'city-update':
 *           flightDispatcher.waitFor([CityStore.dispatchToken]);
 *           FlightPriceStore.price =
 *             getFlightPriceStore(CountryStore.country, CityStore.city);
 *           break;
 *     }
 *   });
 *
 * The `country-update` payload will be guaranteed to invoke the stores'
 * registered callbacks in order: `CountryStore`, `CityStore`, then
 * `FlightPriceStore`.
 */
function Dispatcher() {
  this._callbacks = {};
  this._isPending = {};
  this._isHandled = {};
  this._isDispatching = false;
  this._pendingPayload = null;
}

  /**
   * Registers a callback to be invoked with every dispatched payload. Returns
   * a token that can be used with `waitFor()`.
   *
   * @param {function} callback
   * @return {string}
   */
Dispatcher.prototype.register = function(callback) {
  var id = _prefix + _lastID++;
  this._callbacks[id] = callback;
  return id;
}

  /**
   * Removes a callback based on its token.
   *
   * @param {string} id
   */
Dispatcher.prototype.unregister = function(id) {
  delete this._callbacks[id];
}

  /**
   * Waits for the callbacks specified to be invoked before continuing execution
   * of the current callback. This method should only be used by a callback in
   * response to a dispatched payload.
   *
   * @param {array<string>} ids
   */
Dispatcher.prototype.waitFor = function(ids) {
  for (var ii = 0; ii < ids.length; ii++) {
    var id = ids[ii];
    if (this._isPending[id]) {
      continue;
    }
    this._invokeCallback(id);
  }
}

  /**
   * Dispatches a payload to all registered callbacks.
   *
   * @param {object} payload
   */
Dispatcher.prototype.dispatch = function(payload) {
  console.log(payload);
  this._startDispatching(payload);
  try {
    for (var id in this._callbacks) {
      if (this._isPending[id]) {
        continue;
      }
      this._invokeCallback(id);
    }
  } finally {
    this._stopDispatching();
  }
}

  /**
   * Is this Dispatcher currently dispatching.
   *
   * @return {boolean}
   */
Dispatcher.prototype.isDispatching = function() {
  return this._isDispatching;
}

  /**
   * Call the callback stored with the given id. Also do some internal
   * bookkeeping.
   *
   * @param {string} id
   * @internal
   */
Dispatcher.prototype._invokeCallback = function(id) {
  this._isPending[id] = true;
  this._callbacks[id](this._pendingPayload);
  this._isHandled[id] = true;
}

  /**
   * Set up bookkeeping needed when dispatching.
   *
   * @param {object} payload
   * @internal
   */
Dispatcher.prototype._startDispatching = function(payload) {
  for (var id in this._callbacks) {
    this._isPending[id] = false;
    this._isHandled[id] = false;
  }
  this._pendingPayload = payload;
  this._isDispatching = true;
}

  /**
   * Clear bookkeeping used for dispatching.
   *
   * @internal
   */
Dispatcher.prototype._stopDispatching = function() {
  this._pendingPayload = null;
  this._isDispatching = false;
}

var singleDispatcher = new Dispatcher();

module.exports = singleDispatcher;

},{}],23:[function(require,module,exports){
var Store = require("./Store.js");
var Actions = require("../actions/Actions.js");

var latest = null;
var average = null;

module.exports = new Store({
  state: {
    latest: function() {
      return latest;
    },
    average: function() {
      return average;
    }
  },
  handlers: {
    "LOAD_LATEST_HISTORY": function() {
      $.ajax({
        method: "GET",
        url: "/api/history/latest",
        dataType: "json",
        success: function(response) {
          Actions.gotLatestHistory(response);
        }
      });
    },
    "GOT_LATEST_HISTORY": function(action) {
      latest = action.history;
    },
    "RELOAD_HISTORY": function() {
      $.ajax({
        method: "POST",
        url: "/api/history/reload"
      });
    },
    "LOAD_AVERAGE_HISTORY": function() {
      $.ajax({
        method: "GET",
        url: "/api/history/average",
        dataType: "json",
        success: function(response) {
          Actions.gotAverageHistory(response);
        }
      });
    },
    "GOT_AVERAGE_HISTORY": function(action) {
      average = action.average;
    }
  }
});

},{"../actions/Actions.js":1,"./Store.js":24}],24:[function(require,module,exports){
var Dispatcher = require("../dispatcher/Dispatcher.js");

/*
 * Use like this:
 *
 *   var value = 1;
 *   var SomeStore = new Store({
 *     state: {
 *       stuff: function() {
 *         return value;
 *       }
 *     },
 *     handlers: {
 *       DO_STUFF: function(action) {
 *         value += action.amount;
 *       }
 *     }
 *   });
 */
function Store(options) {
  this._adding = false;
  this._removing = false;
  this._emitting = false;
  this._listeners = [];
  this._names = [];

  if (options.handlers) {
    for (var key in options.handlers) {
      (function(type, handler) {
        var id = Dispatcher.register(function(action) {
          if (action.type == type) {
            handler.call(null, action);
            this.emitChange();
          }
        }.bind(this));
      }.bind(this))(key, options.handlers[key]);
    }
  }

  this.state = options.state;
}

Store.prototype.isBusy = function() {
  return this._emitting || this._adding || this._removing;
}

Store.prototype.emitChange = function() {
  if (this.isBusy()) {
    setTimeout(function() {
      this.emitChange();
    }.bind(this), 50);
    return;
  }
  this._emitting = true;
  this._listeners.forEach(function(listener, index) {
    listener.call(null);
  }.bind(this));
  this._emitting = false;
}

Store.prototype.addChangeListener = function(listener, name) {
  if (this.isBusy()) {
    setTimeout(function() {
      this.addChangeListener(listener, name);
    }.bind(this), 50);
    return;
  }
  this._adding = true;
  this._listeners.push(listener);
  this._names.push(name);
  this._adding = false;
}

Store.prototype.removeChangeListener = function(listener) {
  if (this.isBusy()) {
    setTimeout(function() {
      this.removeChangeListener(listener);
    }.bind(this), 50);
    return;
  }
  this._removing = true;
  var index = this._listeners.indexOf(listener);
  if (index != -1) {
    this._listeners.splice(index, 1);
    this._names.splice(index, 1);
  }
  this._removing = false;
}

module.exports = Store;

},{"../dispatcher/Dispatcher.js":22}],25:[function(require,module,exports){
var Store = require("./Store.js");
var Model = require("../util/Model.js");

var transactions = {};
var sortedTransactions = [];
var sortedSentTransactions = [];

function transactionComparator(a, b) {
  var aDate = new Date(a.CreatedAt);
  var bDate = new Date(b.CreatedAt);
  if (aDate < bDate) {
    return 1;
  } else if (aDate > bDate) {
    return -1;
  } else {
    return 0;
  }
}

function sortTransactions() {
  sortedTransactions = [];
  for (var id in transactions) {
    if (transactions.hasOwnProperty(id)) {
      sortedTransactions.push(transactions[id]);
    }
  }
  sortedTransactions.sort(transactionComparator);
}

function sortSentTransactions() {
  sortedSentTransactions = [];
  for (var id in transactions) {
    if (transactions.hasOwnProperty(id)) {
      var t = transactions[id];
      if (Model.isSent(t.Amount) && Model.isComplete(t)) {
        sortedSentTransactions.push(t);
      }
    }
  }
  sortedSentTransactions.sort(transactionComparator);
}

module.exports = new Store({
  state: {
    transactions: function() {
      sortTransactions();
      return sortedTransactions;
    },
    sentTransactions: function() {
      sortSentTransactions();
      return sortedSentTransactions;
    }
  },
  handlers: {
    "GOT_TRANSACTION": function(action) {
      action.transaction.OriginalConversion.Amount = parseFloat(action.transaction.OriginalConversion.Amount);
      action.transaction.CurrentConversion.Amount = parseFloat(action.transaction.CurrentConversion.Amount);
      transactions[action.transaction.Id] = action.transaction;
    }
  }
});

},{"../util/Model.js":27,"./Store.js":24}],26:[function(require,module,exports){
var Store = require("./Store.js");

var user = Global.user;

module.exports = new Store({
  state: {
    user: function() {
      return user;
    },
    loggedIn: function() {
      return (user && user.Id);
    }
  }
});

},{"./Store.js":24}],27:[function(require,module,exports){
module.exports = {
  isComplete: function(transaction) {
    return transaction.Status == "complete";
  },
  isSent: function(amount) {
    return amount.Amount < 0;
  },
  isReceived: function(amount) {
    return amount.Amount > 0;
  },
  isDateAfter: function(a, b) {
    var aDate = new Date(a);
    var bDate = new Date(b);

    return aDate > bDate;
  }
};

},{}],28:[function(require,module,exports){
// Closure
(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

},{}],29:[function(require,module,exports){
var Actions = require("../actions/Actions.js");

var conn = null;

module.exports = {
  connect: function() {
    console.log("connecting");
    conn = new WebSocket("ws://" + location.host + "/ws");
    conn.onclose = function(e) {
      console.log("connection closed", e);
    },
    conn.onmessage = function(e) {
      // assuming we're only receiving transactions
      Actions.gotTransaction(JSON.parse(e.data));
    }
  },
  disconnect: function() {
    conn.close();
  },
  send: function(obj) {
    conn.send(JSON.stringify(obj));
  }
};

},{"../actions/Actions.js":1}]},{},[2]);
