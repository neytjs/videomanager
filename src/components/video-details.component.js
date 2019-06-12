/*
The video-details subcomponent provides the user an interface for displaying data in the videos.db
NeDB database for each individual video.
*/

import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import VideoUpdate from './video-update-component';
import RateStars from './rate-stars-component.js';
const remote = window.require('electron').remote;

class VideoDetails extends Component {
  constructor(props) {
    super(props);
    this.loadStars = this.loadStars.bind(this);

    this.min_default = this.props.appData.min_year;
    this.max_default = new Date().getFullYear();

    this.state = {
      viewing_lyrics: remote.getGlobal('history_viewer').viewing_lyrics,
      editing_video: false,
      stars: ""
    }
  }


  componentDidMount() {
    this.loadStars();
  }


  componentDidUpdate(previousProps, previousState) {

    if (previousProps.videoId !== this.props.videoId) {
      this.setState({ viewing_lyrics: false });
      this.loadStars();
    }
  }

  loadStars() {
    let stars = this.props.displayVideo.video_stars;
    this.setState({ stars: stars });
  }

  viewHideLyrics() {

    if (this.state.viewing_lyrics === false) {
      this.setState({ viewing_lyrics: true });
      remote.getGlobal('history_viewer').viewing_lyrics = true;
    } else {
      this.setState({ viewing_lyrics: false });
      remote.getGlobal('history_viewer').viewing_lyrics = false;
    }
  }


  displayingTags() {

    let ran_num = new Date().getTime();

    return this.props.displayVideo.video_tags.map((video, i) => {
      return (
        <span key={"tag_span" + ran_num + i}>
          <a onClick={this.runTagSearch.bind(this, this.props.displayVideo.video_tags[i])}>{this.props.displayVideo.video_tags[i]}</a> {" "}
        </span>
      )
    });
  }


  runTagSearch(tag) {

    this.props.searchVideos({video_title: "", band: "", mintomax: this.min_default, maxtomin: this.max_default, genre: "", lyrics: "", ifyears: false, tag: tag, stars: ""});
  }

  runBandSearch(band) {

    this.props.searchVideos({video_title: "", band: band, mintomax: this.min_default, maxtomin: this.max_default, genre: "", lyrics: "", ifyears: false, tag: "", stars: ""});
  }

  cancelEdit() {
    this.setState({ editing_video: false });
  }

  editVideo() {

    if (this.state.editing_video === false) {
      this.setState({ editing_video: true });
    } else {
      this.setState({ editing_video: false });
    }
  }


  genIframe() {
    return this.props.appData.video_type.map((type, i) => {
      if (this.props.displayVideo.video_type === type.label.toLowerCase()) {
        return (
          <iframe key={this.props.displayVideo.video_code} width={type.width} height={type.height} src={type.url + this.props.displayVideo.video_code} frameBorder="0" allowFullScreen></iframe>
        )
      }
    });
  }


  starChange(star) {

    let stars = star + 1;

    stars = stars.toString();

    this.setState({stars: stars});
    this.props.assignStar(this.props.videoId, stars);
  }

  render() {
    const { viewing_lyrics, editing_video } = this.state;


    if (Object.keys(this.props.displayVideo).length > 0) {
      if (editing_video === false) {
      return (
        <div>
          <h3>{this.props.displayVideo.video_title} (<a onClick={this.runBandSearch.bind(this, "\"" + this.props.displayVideo.video_band + "\"")}>{this.props.displayVideo.video_band}</a>) <button onClick={() => this.props.deSelect()}>Hide</button> <button onClick={() => this.props.deleteVideo(this.props.videoId)}>Delete</button></h3>
          <div>
              <RateStars starsAmount={this.state.stars} starChange={this.starChange.bind(this)}></RateStars>
          </div>
          <div>{this.displayingTags()}</div>
          <div>Released: {this.props.displayVideo.video_year}</div>
          <div>
            {this.genIframe()}
          </div>
          <div>
          <button onClick={this.editVideo.bind(this)}>Edit</button>
          {
            (this.state.viewing_lyrics === false && this.props.displayVideo.video_lyrics[0] !== "") ? <button onClick={() => this.viewHideLyrics()}>View Lyrics</button> : (this.state.viewing_lyrics === true && this.props.displayVideo.video_lyrics[0] !== "") ? <button onClick={() => this.viewHideLyrics()}>Hide Lyrics</button> : ""
          }
          </div>
          {
            (viewing_lyrics === true && this.props.displayVideo.video_lyrics[0] !== "") ? <div><b>Lyrics:</b><br/> {ReactHtmlParser(this.props.displayVideo.video_lyrics_html)}</div> : ""
          }
        </div>
      )
      } else {
        return (
          <VideoUpdate videoId={this.props.videoId} updateVideo={this.props.updateVideo} displayVideo={this.props.displayVideo} editStatus={this.editVideo.bind(this)} cancelEdit={this.cancelEdit.bind(this)} focusOn={this.props.focusOn} focusOut={this.props.focusOut} appData={this.props.appData}></VideoUpdate>
        )
      }
    } else {
      return (
        <div>
          Select a video.
        </div>
      )
    }
  }
}

export default VideoDetails;
