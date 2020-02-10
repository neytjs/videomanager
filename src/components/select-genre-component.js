import React, {Component} from 'react';

class SelectGenre extends Component {

  genOpts() {
    let genres = [];

    for (var i = -1, length = this.props.appData.video_genre.length; i < length; i++) {
      if (i === -1) {
        genres.push("");
      } else {
        genres.push(this.props.appData.video_genre[i])
      }
    }

    return genres.map((genre, i) => {
      return (
        <option key={genre + i} value={genre.toLowerCase()}>{genre}</option>
      )
    });
  }

  render() {
    return (
      <select onChange={this.props.insertFunction} value={this.props.insertValue}>
        {this.genOpts()}
      </select>
    )
  }
}

export default SelectGenre;
