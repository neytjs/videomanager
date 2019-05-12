import React, {Component} from 'react';

class SelectGenre extends Component {

  genOpts() {
    return this.props.appData.video_genre.map((genre, i) => {
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
