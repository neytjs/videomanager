import React, {Component} from 'react';
import Utilities from './js/utilities.js';
import SelectYear from './select-year-component';
import SelectGenre from './select-genre-component';
import SelectType from './select-type-component';
import Editor from './editor-component';
const remote = window.require('electron').remote;

class AddVideo extends Component {
  constructor() {
    super();
    this.video_title = React.createRef();
    this.video_code = React.createRef();
    this.video_band = React.createRef();
    this.tag = React.createRef();
    this.pressEnter = this.pressEnter.bind(this);
    this.CKEditor = React.createRef();

    this.state = {
      message: remote.getGlobal('add').message,
      title: remote.getGlobal('add').title,
      code: remote.getGlobal('add').code,
      band: remote.getGlobal('add').band,
      year: remote.getGlobal('add').year,
      genre: remote.getGlobal('add').genre,
      lyrics: remote.getGlobal('add').lyrics,
      type: remote.getGlobal('add').type,
      tag: remote.getGlobal('add').tag,
      tags: remote.getGlobal('add').tags
    }
  }

  componentDidMount() {
    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "add";
    document.addEventListener("keydown", this.pressEnter, false);
  }

  componentWillUnmount() {

    remote.getGlobal('add').title = this.video_title.value;
    remote.getGlobal('add').code = this.video_code.value;
    remote.getGlobal('add').band = this.video_band.value;
    remote.getGlobal('add').tag = this.tag.value;
    remote.getGlobal('add').lyrics = this.CKEditor.editor !== null ? this.CKEditor.editor.getData() : "";
    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "";
    document.removeEventListener("keydown", this.pressEnter, false);
  }

  pressEnter(event) {
    if (event.keyCode === 13 && remote.getGlobal('enterTracker').tag_insert_tracker === false && remote.getGlobal('enterTracker').component_tracker === "add") {
      this.handleSubmit();
    } else if (event.keyCode === 13 && remote.getGlobal('enterTracker').tag_insert_tracker === true && remote.getGlobal('enterTracker').component_tracker === "add") {
      this.addTag();
    }
  }

  handleSubmit() {

    if (this.video_code.value === "" || this.video_title.value === "" || this.video_band.value === "" || this.state.year === "" || this.state.genre === "" || this.state.type === "") {
      alert("A title, band, year, genre, type, and video code are required.");
    } else {
      let callAddVideo = () => {

        this.addVideo(this.video_code.value, this.video_title.value, this.video_band.value, this.state.year, this.CKEditor.editor.getData(), this.state.genre, this.state.type, this.state.tags);
      }

      if (remote.getGlobal('editing').editing_video === true) {

        let confirm_delete = confirm("Warning, any unsaved changes will be lost if confirmed.");

        if (confirm_delete === true) {
          callAddVideo();
        }
      } else {
        callAddVideo();
      }
    }
  }


  addVideo(code, title, band, year, lyrics, genre, type, tags) {
    let lyrics_html = lyrics;

    lyrics = Utilities.htmlStringCleanerArrayConverter(lyrics);

    code = code.trim();
    title = title.trim();
    band = band.trim();
    year = year.trim();


    this.props.videos.findOne({video_code: code}, function(err, doc) {

      if (doc) {
        alert('That video is already in your list!');
      } else {

        var video = {
          video_title: title,
          video_code: code,
          video_band: band,
          video_genre: genre,
          video_lyrics: lyrics,
          video_lyrics_html: lyrics_html,
          video_year: year,
          video_type: type,
          video_tags: tags,
          video_stars: "0",
          list_id: remote.getGlobal('listTracker').list_id
        };

        this.props.videos.insert(video, function(err, docs) {

          let output = "You have successfully added " + title + " to your collection.";

          this.setState({ code: "", title: "", band: "", year: "", genre: "", lyrics: "", type: "", tag: "", tags: [] });

          remote.getGlobal('add').message = output;
          remote.getGlobal('add').title = "";
          remote.getGlobal('add').code = "";
          remote.getGlobal('add').band = "";
          remote.getGlobal('add').year = "";
          remote.getGlobal('add').genre = "";
          remote.getGlobal('add').lyrics = "";
          remote.getGlobal('add').type = "";
          remote.getGlobal('add').tag = "";
          remote.getGlobal('add').tags = [];
          remote.getGlobal('add').just_inserted_code = code;
          this.video_title.value = "";
          this.video_code.value = "";
          this.video_band.value = "";
          this.tag.value = "";
        }.bind(this));

        this.props.videos_shortterm.remove({}, { multi: true }, function (err, numRemoved) {
          this.props.videos.find({}, function(err, entries) {
            this.props.videos_shortterm.insert(entries, function(err, docs) {

              let all_tags = Utilities.allTags(entries);
              this.setState({all_tags: all_tags}, function() {

                this.props.updateAllTags(all_tags);
              });
            }.bind(this));
          }.bind(this));
        }.bind(this));
      }
    }.bind(this));
  }


  addTag(e) {
    let new_tag = this.tag.value;

    new_tag = Utilities.keepAllLettersNumbers(new_tag);

    new_tag = new_tag.trim();

    if (new_tag !== "") {

      let tags = this.state.tags;

      let counter = 0;
      let tags_length = tags.length;
      for (var i = 0; i < tags_length; i++) {

        let nt_trimlc = new_tag;
        nt_trimlc = nt_trimlc.toLowerCase();
        nt_trimlc = nt_trimlc.trim();
        let t_trimlc = tags[i];
        t_trimlc = t_trimlc.toLowerCase();
        t_trimlc = t_trimlc.trim();
        if (nt_trimlc === t_trimlc) {
          counter = counter + 1;
        }
      }

      if (counter === 0) {

        tags.push(new_tag);

        this.setState({ tags: tags, tag: "" });
        this.tag.value = "";

        this.tag.blur();

        remote.getGlobal('add').tags = this.state.tags;
        remote.getGlobal('add').tag = "";
        remote.getGlobal('enterTracker').tag_insert_tracker = false;
        remote.getGlobal('enterTracker').component_tracker = "add";
      } else {
        alert("You have already entered that tag for this video.");
      }
    } else {
      remote.getGlobal('enterTracker').component_tracker = "add";
      this.handleSubmit();
    }
  }


  displayingTags() {

    let ran_num = new Date().getTime();

    return this.state.tags.map((video, i) => {
      return (
        <span key={"tag_span" + ran_num + i}>
          {this.state.tags[i]} <button onClick={this.deleteTag.bind(this, i)}>X</button> {" "}
        </span>
      )
    });
  }


  deleteTag(i) {

    let state = Object.assign({}, this.state);

    state.tags.splice(i, 1);

    this.setState(state);

    remote.getGlobal('add').tags = this.state.tags;
    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "add";
  }

  hide_message() {
    this.setState( { message: "" }, function() {
      remote.getGlobal('add').message = "";
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "add";
    });
  }

  handle_title_Change(event) {
    this.setState({ title: event.target.value }, function() {
      remote.getGlobal('add').title = this.state.title;
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "add";
    });
  }

  handle_code_Change(event) {
    this.setState({ code: event.target.value }, function() {
      remote.getGlobal('add').code = this.state.code;
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "add";
    });
  }

  handle_band_Change(event) {
    this.setState({ band: event.target.value }, function() {
      remote.getGlobal('add').band = this.state.band;
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "add";
    });
  }

  handle_year_Change(event) {
    this.setState({ year: event.target.value }, function() {
      remote.getGlobal('add').year = this.state.year;
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "add";
    });
  }

  handle_lyrics_Change(event) {
    this.setState({ lyrics: event.editor.getData() }, function() {
      remote.getGlobal('add').lyrics = this.state.lyrics;
      remote.getGlobal('enterTracker').component_tracker = "add";
    });
  }

  handle_genre_Change(event) {
    this.setState({ genre: event.target.value }, function() {
      remote.getGlobal('add').genre = this.state.genre;
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "add";
    });
  }

  handle_type_Change(event) {
    this.setState({ type: event.target.value }, function() {
      remote.getGlobal('add').type = this.state.type;
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "add";
    });
  }

  handle_tags_Change(event) {
    this.setState({ tag: event.target.value }, function() {
      remote.getGlobal('add').tag = this.state.tag;
    });
  }

  handle_tracker_tags_onClick() {
    remote.getGlobal('enterTracker').tag_insert_tracker = true;
    remote.getGlobal('enterTracker').component_tracker = "add";
  }


  handleTabKey(e) {

    if (e.keyCode == 9) {

      document.execCommand('insertHTML', false, '&#009');

      e.preventDefault();
    }
  }


  resetAdd() {

    this.setState({title: "", code: "", band: "", year: "", genre: "", lyrics: "", type: "", tag: "", tags: []});
    this.video_title.value = "";
    this.video_code.value = "";
    this.video_band.value = "";
    this.tag.value = "";

    remote.getGlobal('add').title =  "";
    remote.getGlobal('add').code = "";
    remote.getGlobal('add').band = "";
    remote.getGlobal('add').year = "";
    remote.getGlobal('add').genre = "";
    remote.getGlobal('add').lyrics = "";
    remote.getGlobal('add').type = "";
    remote.getGlobal('add').tag = "";
    remote.getGlobal('add').tags = [];
    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "add";
  }

  render() {
    const { lyrics, message, tag, band, code, title, year, genre, type } = this.state;
    return (
      <div>
        <div className="ui">
          <h3>Add a video: <div className="float_right"><button onClick={this.props.hideAdd}>Hide</button></div></h3>
          Title: <input ref={video_title => this.video_title = video_title} defaultValue={title} onBlur={this.handle_title_Change.bind(this)}/>
          <br/>
          Video Code: <input ref={video_code => this.video_code = video_code} defaultValue={code} onBlur={this.handle_code_Change.bind(this)}/>
          <br/>
          Band: <input ref={video_band => this.video_band = video_band} defaultValue={band} onBlur={this.handle_band_Change.bind(this)}/>
          <br/>
          Year: <SelectYear insertFunction={this.handle_year_Change.bind(this)} insertValue={year} minOrMax="maxtomin" appData={this.props.appData}></SelectYear>
          <br/>
          Lyrics:
          <Editor editorData={lyrics} handleEditorChange={this.handle_lyrics_Change.bind(this)} theRef={CKEditor => this.CKEditor = CKEditor} cssTemplate={this.props.cssTemplate}></Editor>
          <br/>
          Genre: <SelectGenre insertFunction={this.handle_genre_Change.bind(this)} insertValue={genre} appData={this.props.appData}></SelectGenre>
          <br/>
          Type: <SelectType insertFunction={this.handle_type_Change.bind(this)} insertValue={type} appData={this.props.appData}></SelectType>
          <br/>
          Tags: <input ref={tag => this.tag = tag} defaultValue={tag} onBlur={this.handle_tags_Change.bind(this)} onClick={this.handle_tracker_tags_onClick.bind(this)} /> <button onClick={this.addTag.bind(this)}>Add Tag</button> {this.displayingTags()}
          <br/>
          <button onClick={this.handleSubmit.bind(this)}>Submit</button> <button className="button" onClick={this.resetAdd.bind(this)}>Reset</button>
        </div>
        {message} { message !== "" ? <button onClick={this.hide_message.bind(this)}>X</button> : "" }
      </div>
    )
  }
}

export default AddVideo;
