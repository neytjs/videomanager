/*
This is a minor subcomponent for providing the user an interface for updating the stars ranking
property for a given video stored in their videos.db NeDB database.
*/

import React, {Component} from 'react';

class RateStars extends Component {
  constructor(props) {
    super(props);
  }

  generateStars(amount) {

    let stars = [];

    for (var i = 0; i < 5; i++) {
      if (i < amount) {
        stars.push("★");
      } else {
        stars.push("☆");
      }
    }

    if (amount === 0) {
      for (var i = 0; i < 5; i++) {
        stars.push("☆");
      }
    }

    return stars.map((star, i) => {
      return (
        <span key={"starz" + i} onClick={() => this.props.starChange(i)}>{star}</span>
      )
    });
  }

  render() {
    return (
      <div className="rate-stars">
        {this.generateStars(this.props.starsAmount)}
      </div>
    )
  }
}

export default RateStars;
