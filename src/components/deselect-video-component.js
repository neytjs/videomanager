import React, {Component} from 'react';

class DeSelect extends Component {
  render() {
    return (
      <button onClick={() => this.props.deSelect()}>Hide</button>
    )
  }
}

export default DeSelect;
