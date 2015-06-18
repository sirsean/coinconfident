module.exports = React.createClass({
  render: function() {
    return (
      <div>
        <p>We calculate the recent trend of Bitcoin based on a moving average, which is intended to smooth out random price fluctuations to give a better idea of what the price of Bitcoin has been doing recently.</p>
        <p>We use a 14-day moving average over the past 30 days. This means that we're taking the average price over rolling 14 day periods, starting 30 days ago, and then we average those averages into a single total.</p>
        <p>If the current price is above this moving average, it means that Bitcoin is "high" right now and it's a good time to spend them. If the current price is below that moving average, it's "low" and you'd be better off hanging onto them for now.</p>
      </div>
    );
  }
});
