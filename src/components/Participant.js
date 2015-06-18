module.exports = React.createClass({
  render: function() {
    var direction;
    if (this.props.from) {
      direction = "From";
    } else if (this.props.to) {
      direction = "To";
    }

    var name = this.props.participant.Name;
    if (!name) {
      name = <em>Unknown</em>;
    } else if (name.length > 18) {
      name = name.substring(0, 18) + "...";
    }

    return (
      <div className="participant">
        <div className="title-light">{direction}</div>
        <span className="participant-name">{name}</span>
      </div>
    );
  }
});
