import React, { Component, Fragment } from "react";
import HeatMap from "react-heatmap-grid";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { getMoods, deleteMood } from "../../actions/moods";

const yLabels = ["Week1", "Week2", "Week3", "Week4", "Week5"];
const xLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const xLabelsVisibility = new Array(7).fill(true);

class heatMap extends Component {
  static propTypes = {
    moods: PropTypes.array.isRequired,
    getMoods: PropTypes.func.isRequired,
    deleteMood: PropTypes.func.isRequired,
  };

  // to get the Moods before the component mounts
  componentDidMount() {
    this.props.getMoods();
    // console.log("component Did Mount");
  }
  render() {
    // Heat Map Logic
    //make a montly dates array to compare
    var startDate = new Date("2020-10-01"); //YYYY-MM-DD
    var endDate = new Date("2020-11-01"); //YYYY-MM-DD

    var getDateArray = function (start, end) {
      var arr = new Array();
      var dt = new Date(start);
      while (dt <= end) {
        arr.push(new Date(dt).toISOString());
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    };

    var dateArr = getDateArray(startDate, endDate);
    // console.log(dateArr);

    // moodlevelarray and datearray from user's data
    let ourmoods = this.props.moods.map((mood) => mood.moodlevel);
    let ourdates = this.props.moods.map((mood) => mood.date);
    //find indices at which dates match with our comparison array and make a new array of moods
    let indices = [];
    for (const date of ourdates) {
      for (const dat of dateArr) {
        if (dat.includes(date)) {
          // console.log(dateArr.indexOf(dat));
          indices.push(dateArr.indexOf(dat));
        }
      }
    }

    let moodsArr = new Array(dateArr.length).fill(0);
    let i = 0;
    for (const idx of indices) {
      moodsArr[idx] = ourmoods[i];
      i++;
    }
    // console.log(moodsArr);

    //new date array in string format to compare to days, we wanna splice on first Monday
    var getDateArray2 = function (start, end) {
      var arr = new Array();
      var dt = new Date(start);
      while (dt <= end) {
        arr.push(new Date(dt).toString());
        dt.setDate(dt.getDate() + 1);
      }
      return arr;
    };

    var dateArr2 = getDateArray2(startDate, endDate);

    //split the array
    const n = 7;
    let x = [];
    for (const date of dateArr2) {
      if (date.includes("Mon")) {
        x.push(dateArr2.indexOf(date));
      }
    }
    // console.log(x);
    let firstmonday = x[0];
    // console.log(firstmonday);
    // console.log(moodsArr.length);

    const result = new Array(Math.floor(moodsArr.length / n))
      .fill()
      .map((_) => moodsArr.splice(firstmonday, n));
    // console.log(
    //     `FIRST spliced ARRAY OF ARRAYS ${result} with length of ${result.length}`
    // );

    //for all arrays in result array, if the array has length <7, then fill it with zeros
    for (const arr of result) {
      while (arr.length < 7) {
        arr.push(0);
      }
    }
    // console.log(result);
    //for all the values before first Monday, make another array and fill the first instances with zeros. Push this new array in the results array, at the first position.
    let firstArr = new Array(7);
    //make first positions zeros
    let num = 7 - firstmonday;
    let c = 0;
    for (i = 0; i < num; i++) {
      firstArr[i] = 0;
    }
    //fill the rest of the values
    for (i = num; i <= 6; i++) {
      firstArr[i] = moodsArr[c];
      c++;
    }
    // console.log(firstArr);

    result.unshift(firstArr);
    // console.log(result);

    //Heat Map
    // console.log("I am from HeatMap.js");
    // console.log(ourmoods, ourdates);
    const data = result;
    return (
      <div style={{ fontSize: "13px" }}>
        <HeatMap
          xLabels={xLabels}
          yLabels={yLabels}
          xLabelsLocation={"bottom"}
          xLabelsVisibility={xLabelsVisibility}
          xLabelWidth={60}
          data={data}
          squares
          height={45}
          onClick={(x, y) => alert(`Clicked ${x}, ${y}`)}
          cellStyle={(background, value, min, max, data, x, y) => ({
            background: `rgb(0, 151, 230, ${1 - (max - value) / (max - min)})`,
            fontSize: "0px",
            color: "#444",
          })}
          cellRender={(value) => value && <div>{value}</div>}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  moods: state.moods.moods, //we wants the moods reducer and the moods within that! moods=[] now we have a prop called moods
});

export default connect(mapStateToProps, { getMoods, deleteMood })(heatMap);