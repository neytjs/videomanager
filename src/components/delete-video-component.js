import React, {Component} from 'react';

class DeleteVideo extends Component {
  render() {
    return (
      <button onClick={() => this.props.deleteVideo(this.props.videoId)}>Delete</button>
    )
  }
}

export default DeleteVideo;
