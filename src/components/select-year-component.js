import React, {Component} from 'react';

class SelectYear extends Component {
  createYears(range) {

    let minimum_year = this.props.appData.min_year;
    let current_year = new Date().getFullYear();

    if (range === "mintomax") {
      let numbers = [""];

      for (var i = minimum_year; i <= current_year; i++) {
        numbers.push(i);
      }

      return numbers.map((year) => {
        return (
          <option key={"year"+year} value={year}>{year}</option>
        )
      });
    } else if (range === "maxtomin") {
      let numbers = [""];

      for (var i = current_year, min = minimum_year; i >= min; i--) {
        numbers.push(i);
      }

      return numbers.map((year) => {
        return (
          <option key={"year"+year} value={year}>{year}</option>
        )
      });
    }
  }

  render() {
    return (
      <select onChange={this.props.insertFunction} value={this.props.insertValue}>{this.createYears(this.props.minOrMax)}</select>
    )
  }
}

export default SelectYear;
