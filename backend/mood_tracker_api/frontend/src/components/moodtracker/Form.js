import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { addMood } from "../../actions/moods";

class Form extends Component {
  state = {
    date: "",
    moodlevel: "",
    user: "",
  };

  static propTypes = {
    addMood: PropTypes.func.isRequired,
  };

  onChange = (e) => this.setState({ [e.target.name]: e.target.value });

  onSubmit = (e) => {
    e.preventDefault();
    const { date, moodlevel, user } = this.state;
    const mood = { date, moodlevel, user };
    this.props.addMood(mood);
    this.setState({
      date: "",
      moodlevel: "",
    });
  };

  render() {
    const { date, moodlevel } = this.state;
    return (
      <div>
        <h2>Add Mood</h2>
        <form onSubmit={this.onSubmit}>
          <div>
            <label>Date</label>
            <input
              className="form-control"
              type="date"
              name="date"
              onChange={this.onChange}
              value={date}
            />
          </div>
          {/* Add Mood Level */}
          <div className="form-group">
            <label>Mood-level</label>
            <input
              max="5"
              min="1"
              className="form-control"
              type="number"
              name="moodlevel"
              onChange={this.onChange}
              value={moodlevel}
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(null, { addMood })(Form);
