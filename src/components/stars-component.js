import React, {Component} from 'react';

class Stars extends Component {
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

    return (
      <div>{stars.join("")}</div>
    )
  }

  render() {
    return (
      <div className="stars">
        {this.generateStars(this.props.starsAmount)}
      </div>
    )
  }
}

export default Stars;
