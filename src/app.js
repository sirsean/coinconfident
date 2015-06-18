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
  <Route name="app" path="/" handler={App}>
    <Route name="support" handler={Support}>
      <Route name="history" handler={History} />
      <Route name="sessions" handler={Sessions} />
      <DefaultRoute handler={SupportMain} />
    </Route>
    <Route name="help" handler={Help}>
      <Route name="recent_trend" handler={HelpMovingAverage} />
      <DefaultRoute handler={HelpMain} />
    </Route>
    <DefaultRoute handler={Main} />
  </Route>
);

ReactRouter.run(routes, function(Handler) {
  React.render(<Handler />, document.body);
});
