import React, {Component} from 'react';
import ReactHtmlParser from 'react-html-parser';
import memoize from "memoize-one";
import VideoUpdate from './video-update-component';
import RateStars from './rate-stars-component.js';
const remote = window.require('electron').remote;

class VideoDetails extends Component {
  constructor(props) {
    super(props);

    this.min_default = this.props.appData.min_year;
    this.max_default = new Date().getFullYear();

    this.state = {
      viewing_lyrics: remote.getGlobal('history_viewer').viewing_lyrics,
      videoId: remote.getGlobal('history_viewer').video.video_id,
      editing_video: remote.getGlobal('editing').editing_video,
      stars: ""
    }
  }


  componentDidMount() {
    this.loadStars();
  }

  componentDidUpdate() {
    this.compare(this.props.videoId, this.state.videoId);
  }

  compare = memoize(
    (videoIdProp, videoIdState) => videoIdProp !== videoIdState ? this.setState({ viewing_lyrics: false }, function() { this.loadStars(); remote.getGlobal('history_viewer').viewing_lyrics = false; }) : videoIdState
  );

  loadStars() {
    let stars = this.props.displayVideo !== null ? this.props.displayVideo.video_stars : "";
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
    this.props.searchVideos({title: "", band: "", mintomax: this.min_default, maxtomin: this.max_default, genre: null, lyrics: "", ifyears: false, tag: [{value: tag, label: tag}], stars: null, key_press: true});

    remote.getGlobal('search').search_hidden = "searching";
    remote.getGlobal('search').tag_search = true;
    remote.getGlobal('search').search_arguments.title.field = "";
    remote.getGlobal('search').search_arguments.band.field = "";
    remote.getGlobal('search').search_arguments.genre.field = null;
    remote.getGlobal('search').search_arguments.lyrics.field = "";
    remote.getGlobal('search').search_arguments.mintomax.field = "";
    remote.getGlobal('search').search_arguments.maxtomin.field = "";
    remote.getGlobal('search').search_arguments.tag.field = [{value: tag, label: tag}];
    remote.getGlobal('search').search_arguments.stars.field = null;
    remote.getGlobal('search').search_arguments.field = "";
  }

  runBandSearch(band) {
    this.props.searchVideos({title: "", band: band, mintomax: this.min_default, maxtomin: this.max_default, genre: null, lyrics: "", ifyears: false, tag: null, stars: null, key_press: true});

    remote.getGlobal('search').search_hidden = "searching";
    remote.getGlobal('search').band_search = true;
    remote.getGlobal('search').band_search_clicked = true;
    remote.getGlobal('search').search_arguments.title.field = "";
    remote.getGlobal('search').search_arguments.band.field = band;
    remote.getGlobal('search').search_arguments.genre.field = null;
    remote.getGlobal('search').search_arguments.lyrics.field = "";
    remote.getGlobal('search').search_arguments.mintomax.field = "";
    remote.getGlobal('search').search_arguments.maxtomin.field = "";
    remote.getGlobal('search').search_arguments.tag.field = null;
    remote.getGlobal('search').search_arguments.stars.field = null;
    remote.getGlobal('search').search_arguments.field = "";
  }

  cancelEdit() {
    this.setState({ editing_video: false });
  }

  editVideo() {

    if (this.state.editing_video === false) {
      remote.getGlobal('editing').editing_video = true;
      this.setState({ editing_video: true });
    } else {
      remote.getGlobal('editing').editing_video = false;
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

    if (this.props.displayVideo !== null && Object.keys(this.props.displayVideo).length > 0) {
      if (editing_video === false) {
      return (
        <div className="ui">
          <h3>{this.props.displayVideo.video_title} (<a onClick={this.runBandSearch.bind(this, this.props.displayVideo.video_band)}>{this.props.displayVideo.video_band}</a>) <div className="float_right"><button onClick={() => this.props.deSelect()}>Hide</button> <button onClick={() => this.props.deleteVideo(this.props.videoId)}>Delete</button></div></h3>
          <div>
              <RateStars starsAmount={this.state.stars} starChange={this.starChange.bind(this)}></RateStars>
          </div>
          <div>{this.displayingTags()}</div>
          <div>Released: {this.props.displayVideo.video_year}</div>
          <div>
            {this.genIframe()}
          </div>
          <div>
          <button onClick={this.editVideo.bind(this)}>Edit</button> <button onClick={this.props.refreshVideo}>Refresh</button>
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
          <VideoUpdate videoId={this.props.videoId} updateVideo={this.props.updateVideo} displayVideo={this.props.displayVideo} editStatus={this.editVideo.bind(this)} cancelEdit={this.cancelEdit.bind(this)} appData={this.props.appData} cssTemplate={this.props.cssTemplate}></VideoUpdate>
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
