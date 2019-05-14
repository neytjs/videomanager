/*
This is a minor subcomponent for providing the user an interface for selecting a video genre for
video searchs based upon their application settings data stored in the app_data.db NeDB database.
*/

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
