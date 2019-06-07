/*
The video-update subcomponent provides the user an interface for updating data in the videos.db
NeDB database that holds their videos data.
*/

import React, {Component} from 'react';
import Utilities from './js/utilities.js';
import SelectYear from './select-year-component';
import SelectGenre from './select-genre-component';
import SelectType from './select-type-component';

class VideoUpdate extends Component {
  constructor(props) {
    super(props);
    this.video_title = React.createRef();
    this.video_code = React.createRef();
    this.video_band = React.createRef();
    this.lyrics_text = React.createRef();
    this.onpasteholder = React.createRef();
    this.tag = React.createRef();

    this.state = {
      video_title: props.displayVideo.video_title,
      video_code: props.displayVideo.video_code,
      video_band: props.displayVideo.video_band,
      video_year: props.displayVideo.video_year,
      video_lyrics_html: props.displayVideo.video_lyrics_html,
      video_genre: props.displayVideo.video_genre,
      video_type: props.displayVideo.video_type,
      video_tags: props.displayVideo.video_tags,
      video_stars: props.displayVideo.video_stars,
      tag: ""
    }
  }

  componentDidMount() {
    this.lyrics_text.innerHTML = this.state.video_lyrics_html;
  }


  componentWillReceiveProps(nextProps) {

    if (nextProps.displayVideo.video_title !== this.state.video_title || nextProps.displayVideo.video_code !== this.state.video_code || nextProps.displayVideo.video_band !== this.state.video_band || nextProps.displayVideo.video_year !== this.state.video_year || nextProps.displayVideo.video_lyrics_html !== this.state.video_lyrics_html || nextProps.displayVideo.video_genre !== this.state.video_genre || nextProps.displayVideo.video_type !== this.state.video_type  || nextProps.displayVideo.video_tags !== this.state.video_tags) {
      this.setState({ video_title: nextProps.displayVideo.video_title, video_code: nextProps.displayVideo.video_code, video_band: nextProps.displayVideo.video_band, video_year: nextProps.displayVideo.video_year, video_lyrics_html: nextProps.displayVideo.video_lyrics_html, video_genre: nextProps.displayVideo.video_genre, video_type: nextProps.displayVideo.video_type, video_tags: nextProps.displayVideo.video_tags }, () => {

        this.lyrics_text.innerHTML = this.state.video_lyrics_html;

        this.video_title.value = this.state.video_title;
        this.video_code.value = this.state.video_code;
        this.video_band.value = this.state.video_band;
        this.tag.value = "";
      });
    }
  }

  handleSubmit(e) {

    if (this.state.video_code === "" || this.state.video_title === "" || this.state.video_band === "" || this.state.video_year === "" || this.state.video_genre === "" || this.state.video_type === "") {
      alert("A new title, band, year, genre, type, and video code are required.");
    } else {

      this.props.updateVideo(this.state.video_title, this.state.video_code, this.state.video_band, this.state.video_year, Utilities.removeDangerousTags(this.lyrics_text.innerHTML), this.state.video_genre, this.props.displayVideo.video_code, this.state.video_type, this.state.video_tags, this.state.video_stars);

      this.props.editStatus();
    }
  }


  handleTitleChange(event) {
    this.setState({ video_title: event.target.value });
  }

  handleCodeChange(event) {
    this.setState({ video_code: event.target.value });
  }

  handleBandChange(event) {
    this.setState({ video_band: event.target.value });
  }

  handleYearChange(event) {
    this.setState({ video_year: event.target.value });
  }

  handleGenreChange(event) {
    this.setState({ video_genre: event.target.value });
  }

  handleTypeChange(event) {
    this.setState({ video_type: event.target.value });
  }

  handle_tags_Change(event) {
    this.setState({ tag: event.target.value });
  }


  handleTabKey(e) {

    if (e.keyCode === 9) {

      document.execCommand('insertHTML', false, '&#009');

      e.preventDefault();
    }
  }

  handlePaste(event) {

    event.stopPropagation();
    event.preventDefault();


    let clipboardData = event.clipboardData || window.clipboardData;
    let pastedData = clipboardData.getData('text/html');

    this.onpasteholder.innerHTML = pastedData;
    Utilities.htmlTagStyleCleaner(this.onpasteholder.getElementsByTagName('*'));

    this.lyrics_text.innerHTML = this.onpasteholder.innerHTML;
  }


  displayingEditableTags() {

    let ran_num = new Date().getTime();

    return this.state.video_tags.map((entry, i) => {
      return (
        <span key={"tag_span" + ran_num + i}>
          {this.state.video_tags[i]} <button onClick={this.deleteTag.bind(this, i)}>X</button> {" "}
        </span>
      )
    });
  }


  deleteTag(i) {

    let state = Object.assign({}, this.state);

    this.state.video_tags.splice(i, 1);

    this.setState(state);
  }


  addTag(e) {
    let new_tag = this.tag.value;

    new_tag = new_tag.replace(/[^A-Za-z0-9\s]/g,'');

    new_tag = new_tag.trim();

    if (new_tag !== "") {

      let state = Object.assign({}, this.state);

      let counter = 0;
      let tags_length = state.video_tags.length;
      for (var i = 0; i < tags_length; i++) {

        let nt_trimlc = new_tag;
        nt_trimlc = nt_trimlc.toLowerCase();
        nt_trimlc = nt_trimlc.trim();
        let t_trimlc = state.video_tags[i];
        t_trimlc = t_trimlc.toLowerCase();
        t_trimlc = t_trimlc.trim();
        if (nt_trimlc === t_trimlc) {
          counter = counter + 1;
        }
      }

      if (counter === 0) {

        this.state.video_tags.push(new_tag);

        this.setState(state);

        this.setState({tag: ""});
      } else {
        alert("You have already entered that tag for this video.");
      }
    }
  }

  render() {
    return (
      <div>
        New title: <input type="text" ref={video_title => this.video_title = video_title} defaultValue={this.state.video_title} onBlur={this.handleTitleChange.bind(this)} />
        <br/>
        New video code: <input type="text" ref={video_code => this.video_code = video_code} defaultValue={this.state.video_code} onBlur={this.handleCodeChange.bind(this)} />
        <br/>
        New band: <input type="text" ref={video_band => this.video_band = video_band} defaultValue={this.state.video_band} onBlur={this.handleBandChange.bind(this)} />
        <br/>
        New year: <SelectYear insertFunction={this.handleYearChange.bind(this)} insertValue={this.state.video_year} minimumYear="1960" minOrMax="maxtomin" appData={this.props.appData}></SelectYear>
        <br/>
        New lyrics: <div className="editor" ref={lyrics_text => this.lyrics_text = lyrics_text} onKeyDown={this.handleTabKey} onPaste={this.handlePaste.bind(this)}contentEditable></div>
        <div className="onpasteholder" ref={onpasteholder => this.onpasteholder = onpasteholder}></div>
        <br/>
        New genre: <SelectGenre insertFunction={this.handleGenreChange.bind(this)} insertValue={this.state.video_genre} appData={this.props.appData}></SelectGenre>
        <br/>
        New type: <SelectType insertFunction={this.handleTypeChange.bind(this)} insertValue={this.state.video_type} appData={this.props.appData}></SelectType>
        <br/>
        New tags: {this.displayingEditableTags()}  <input type="text" ref={tag => this.tag = tag} onBlur={this.handle_tags_Change.bind(this)} defaultValue={this.state.tag} /> <button onClick={this.addTag.bind(this)}>Add Tag</button>
        <br/>
        <button onClick={this.handleSubmit.bind(this)}>Save</button> <button onClick={this.props.cancelEdit}>Cancel</button>
      </div>
    )
  }
}

export default VideoUpdate;
