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

module.exports = React.createClass({
  render: function() {
    var d = new Date(this.props.date);

    var month = MONTH_NAMES[d.getMonth()];
    var day = d.getDate();

    var year;
    if (d.getYear() != (new Date()).getYear()) {
      year = d.getYear() + 1900;
    }

    return (
      <div className="date-light">
        <div className="day number">{day}</div>
        <div>{month}</div>
        {year && <div className="number">{year}</div>}
      </div>
    );
  }
});
