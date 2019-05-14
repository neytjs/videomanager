/*
This is a minor subcomponent for providing the user an interface for selecting a video type for
video searchs based upon their application settings data stored in the app_data.db NeDB database.
*/

import React, {Component} from 'react';

class SelectType extends Component {

  genOpts() {
    return this.props.appData.video_type.map((type, i) => {
      return (
        <option key={type.label + i} value={type.label.toLowerCase()}>{type.label}</option>
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

export default SelectType;
