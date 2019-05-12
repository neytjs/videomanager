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
