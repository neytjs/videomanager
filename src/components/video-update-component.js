import React, {Component} from 'react';
import memoize from "memoize-one";
import Utilities from './js/utilities.js';
import SelectYear from './select-year-component';
import SelectGenre from './select-genre-component';
import SelectType from './select-type-component';
import Editor from './editor-component';
const remote = window.require('electron').remote;

class VideoUpdate extends Component {
  constructor(props) {
    super(props);
    this.pressEnter = this.pressEnter.bind(this);
    this.video_title = React.createRef();
    this.video_code = React.createRef();
    this.video_band = React.createRef();
    this.tag = React.createRef();
    this.CKEditor = React.createRef();

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
      _id: props.displayVideo._id,
      tag: "",
      editing: false
    }
  }

  componentDidMount() {
    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "update";
    document.addEventListener("keydown", this.pressEnter, false);
  }

  componentDidUpdate() {

    if (this.state.editing === false) {
      this.compareUpdate(this.props.displayVideo, this.state);
    }

    if (this.props.displayVideo._id !== this.state._id) {
      this.props.cancelEdit();
    }
  }

  componentWillUnmount() {
    remote.getGlobal('editing').editing_video = false;
    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "";
    document.removeEventListener("keydown", this.pressEnter, false);
  }

  pressEnter(event) {
    if (event.keyCode === 13 && remote.getGlobal('enterTracker').tag_insert_tracker === false && remote.getGlobal('enterTracker').component_tracker === "update") {
      this.handleSubmit();
    } else if (event.keyCode === 13 && remote.getGlobal('enterTracker').tag_insert_tracker === true && remote.getGlobal('enterTracker').component_tracker === "update") {
      this.addTag();
    }
  }

  compare = memoize(
    (focusedProp, focusedState) => focusedProp !== focusedState ? focusedProp : focusedState
  );





  compareUpdate = memoize(
    (displayVideoProp, displayVideoState) => displayVideoProp.video_title !== displayVideoState.video_title || displayVideoProp.video_code !== displayVideoState.video_code || displayVideoProp.video_band !== displayVideoState.video_band || displayVideoProp.video_year !== displayVideoState.video_year || displayVideoProp.video_lyrics_html !== displayVideoState.video_lyrics_html || displayVideoProp.video_genre !== displayVideoState.video_genre || displayVideoProp.video_type !== displayVideoState.video_type || displayVideoProp.video_tags !== displayVideoState.video_tags || displayVideoProp.video_stars !== displayVideoState.video_stars ? this.setState({ video_title: displayVideoProp.video_title, video_code: displayVideoProp.video_code, video_band: displayVideoProp.video_band, video_year: displayVideoProp.video_year, video_lyrics_html: displayVideoProp.video_lyrics_html, video_genre: displayVideoProp.video_genre, video_type: displayVideoProp.video_type, video_tags: displayVideoProp.video_tags, video_stars: displayVideoProp.video_stars }, () => {

            this.video_title.value = this.state.video_title;
            this.video_code.value = this.state.video_code;
            this.video_band.value = this.state.video_band;
            this.tag.value = "";
          }) : ""
  );

  handleSubmit() {

    if (this.video_code.value === "" || this.video_title.value === "" || this.video_band.value === "" || this.state.video_year === "" || this.state.video_genre === "" || this.state.video_type === "") {
      alert("A new title, band, year, genre, type, and video code are required.");
    } else {

      this.props.updateVideo(this.video_title.value, this.video_code.value, this.video_band.value, this.state.video_year, this.CKEditor.editor.getData(), this.state.video_genre, this.props.displayVideo.video_code, this.state.video_type, this.state.video_tags, this.state.video_stars);

      this.props.editStatus();

      this.setState({editing: false});
    }
  }


  handleTitleChange(event) {
    this.setState({ video_title: event.target.value, editing: true });
  }

  handleCodeChange(event) {
    this.setState({ video_code: event.target.value, editing: true });
  }

  handleBandChange(event) {
    this.setState({ video_band: event.target.value, editing: true });
  }

  handleYearChange(event) {
    this.setState({ video_year: event.target.value, editing: true }, function() {
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "update";
    });
  }

  handle_video_lyrics_html_Change(event) {
    this.setState({ video_lyrics_html: event.editor.getData(), editing: true }, function() {
      remote.getGlobal('enterTracker').component_tracker = "update";
    });
  }

  handleGenreChange(event) {
    this.setState({ video_genre: event.target.value, editing: true }, function() {
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "update";
    });
  }

  handleTypeChange(event) {
    this.setState({ video_type: event.target.value, editing: true }, function() {
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "update";
    });
  }

  handle_tags_Change(event) {
    this.setState({ tag: event.target.value, editing: true });
  }

  handle_tracker_onClick() {
    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "update";
  }

  handle_tracker_tags_onClick() {
    remote.getGlobal('enterTracker').tag_insert_tracker = true;
    remote.getGlobal('enterTracker').component_tracker = "update";
  }


  handleTabKey(e) {

    if (e.keyCode === 9) {

      document.execCommand('insertHTML', false, '&#009');

      e.preventDefault();
    }
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

    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "update";
  }


  addTag(e) {
    let new_tag = this.tag.value;

    new_tag = Utilities.keepAllLettersNumbers(new_tag);

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
        this.tag.value = "";

        this.tag.blur();
        remote.getGlobal('enterTracker').tag_insert_tracker = false;
        remote.getGlobal('enterTracker').component_tracker = "update";
      } else {
        alert("You have already entered that tag for this video.");
      }
    } else {
      remote.getGlobal('enterTracker').component_tracker = "update";
      this.handleSubmit();
    }
  }

  render() {
    const { video_lyrics_html } = this.state;
    return (
      <div className="ui">
        New title: <input type="text" ref={video_title => this.video_title = video_title} defaultValue={this.state.video_title} onBlur={this.handleTitleChange.bind(this)} onClick={this.handle_tracker_onClick.bind(this)} />
        <br/>
        New video code: <input type="text" ref={video_code => this.video_code = video_code} defaultValue={this.state.video_code} onBlur={this.handleCodeChange.bind(this)} onClick={this.handle_tracker_onClick.bind(this)} />
        <br/>
        New band: <input type="text" ref={video_band => this.video_band = video_band} defaultValue={this.state.video_band} onBlur={this.handleBandChange.bind(this)} onClick={this.handle_tracker_onClick.bind(this)} />
        <br/>
        New year: <SelectYear insertFunction={this.handleYearChange.bind(this)} insertValue={this.state.video_year} minimumYear="1960" minOrMax="maxtomin" appData={this.props.appData}></SelectYear>
        <br/>
        <Editor editorData={video_lyrics_html} handleEditorChange={this.handle_video_lyrics_html_Change.bind(this)} theRef={CKEditor => this.CKEditor = CKEditor} cssTemplate={this.props.cssTemplate}></Editor>
        <br/>
        New genre: <SelectGenre insertFunction={this.handleGenreChange.bind(this)} insertValue={this.state.video_genre} appData={this.props.appData}></SelectGenre>
        <br/>
        New type: <SelectType insertFunction={this.handleTypeChange.bind(this)} insertValue={this.state.video_type} appData={this.props.appData}></SelectType>
        <br/>
        New tags: {this.displayingEditableTags()}  <input type="text" ref={tag => this.tag = tag} onBlur={this.handle_tags_Change.bind(this)} defaultValue={this.state.tag} onClick={this.handle_tracker_tags_onClick.bind(this)} /> <button onClick={this.addTag.bind(this)}>Add Tag</button>
        <br/>
        <button onClick={this.handleSubmit.bind(this)}>Save</button> <button onClick={this.props.cancelEdit}>Cancel</button>
      </div>
    )
  }
}

export default VideoUpdate;
