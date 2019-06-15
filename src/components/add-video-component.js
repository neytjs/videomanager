/*
The add-video subcomponent provides the user an interface for inserting data into the videos.db
NeDB database that holds their videos data.
*/

import React, {Component} from 'react';
import Utilities from './js/utilities.js';
import Ui from './ui-component';
import SelectYear from './select-year-component';
import SelectGenre from './select-genre-component';
import SelectType from './select-type-component';

class AddVideo extends Component {
  constructor() {
    super();
    this.addVideo = this.addVideo.bind(this);
    this.addTag = this.addTag.bind(this);
    this.handle_title_Change = this.handle_title_Change.bind(this);
    this.handle_code_Change = this.handle_code_Change.bind(this);
    this.handle_band_Change = this.handle_band_Change.bind(this);
    this.handle_year_Change = this.handle_year_Change.bind(this);
    this.handle_lyrics_Change = this.handle_lyrics_Change.bind(this);
    this.handle_genre_Change = this.handle_genre_Change.bind(this);
    this.handle_type_Change = this.handle_type_Change.bind(this);
    this.handle_tags_Change = this.handle_tags_Change.bind(this);
    this.pressEnter = this.pressEnter.bind(this);
    this.onpasteholder = React.createRef();

    this.state = {
      message: "",
      title: "",
      code: "",
      band: "",
      year: "",
      genre: "",
      type: "",
      tag: "",
      tags: [],
      focused: false
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.pressEnter, false);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.pressEnter, false);
  }

  focusOn() {
    this.setState({focused: true});
  }

  focusOut() {
    this.setState({focused: false});
  }

  pressEnter(event) {
    if (event.keyCode === 13 && this.state.focused === false) {
      this.handleSubmit();
    }
  }

  handleSubmit() {

      if (this.state.code === "" || this.state.title === "" || this.state.band === "" || this.state.year === "" || this.state.genre === "" || this.state.type === "") {
        alert("A title, band, year, genre, type, and video code are required.");
      } else {

        this.addVideo(this.state.code, this.state.title, this.state.band, this.state.year, Utilities.removeDangerousTags(this.lyrics_text.innerHTML), this.state.genre, this.state.type, this.state.tags);

        this.setState({ code: "", title: "", band: "", year: "", genre: "", type: "", tag: "", tags: [] });

        this.lyrics_text.innerHTML = "";
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
                video_stars: "0"
              };

              this.props.videos.insert(video, function(err, docs) {

                this.lyrics_text.innerHTML = "";

                let output = "You have successfully added " + title + " to your collection.";

                this.setState({message: output});
              }.bind(this));

              this.props.videos_shortterm.remove({}, { multi: true }, function (err, numRemoved) {
                this.props.videos.find({}, function(err, entries) {
                  this.props.videos_shortterm.insert(entries, function(err, docs) {
                  }.bind(this));
                }.bind(this));
              }.bind(this));
            }
      }.bind(this));
    }


  addTag(e) {
    let new_tag = this.state.tag;

    new_tag = new_tag.replace(/[^A-Za-z0-9\s]/g,'');

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
      } else {
        alert("You have already entered that tag for this video.");
      }
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
  }

  handle_title_Change(event) {
    this.setState({ title: event.target.value });
  }

  handle_code_Change(event) {
    this.setState({ code: event.target.value });
  }

  handle_band_Change(event) {
    this.setState({ band: event.target.value });
  }

  handle_year_Change(event) {
    this.setState({ year: event.target.value });
  }

  handle_lyrics_Change(event) {
    this.setState({ lyrics: event.target.value });
  }

  handle_genre_Change(event) {
    this.setState({ genre: event.target.value });
  }

  handle_type_Change(event) {
    this.setState({ type: event.target.value });
  }

  handle_tags_Change(event) {
    this.setState({ tag: event.target.value });
  }


  handleTabKey(e) {

    if (e.keyCode == 9) {

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

    var span = document.createElement('span');
    span.innerHTML = this.onpasteholder.innerHTML;


    if (window.getSelection) {


      var sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        var range = sel.getRangeAt(0);
        range.insertNode(span);
        range = range.cloneRange();
        range.selectNodeContents(span);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  render() {
    return (
      <div>
        <Ui currentLoc={"add"}></Ui>
        <hr />
        <h3>Add a video:</h3>
          Title: <input value={this.state.title} onChange={this.handle_title_Change}/>
          <br/>
          Video Code: <input value={this.state.code} onChange={this.handle_code_Change}/>
          <br/>
          Band: <input value={this.state.band} onChange={this.handle_band_Change}/>
          <br/>
          Year: <SelectYear insertFunction={this.handle_year_Change.bind(this)} insertValue={this.state.year} minOrMax="maxtomin" appData={this.props.appData}></SelectYear>
          <br/>
          Lyrics: <div className="editor" ref={lyrics_text => this.lyrics_text = lyrics_text} onKeyDown={this.handleTabKey} onPaste={this.handlePaste.bind(this)} onFocus={this.focusOn.bind(this)} onBlur={this.focusOut.bind(this)} contentEditable></div>
          <div className="onpasteholder" ref={onpasteholder => this.onpasteholder = onpasteholder}></div>
          <br/>
          Genre: <SelectGenre insertFunction={this.handle_genre_Change.bind(this)} insertValue={this.state.genre} appData={this.props.appData}></SelectGenre>
          <br/>
          Type: <SelectType insertFunction={this.handle_type_Change.bind(this)} insertValue={this.state.type} appData={this.props.appData}></SelectType>
          <br/>
          Tags: <input value={this.state.tag} onChange={this.handle_tags_Change}/> <button onClick={this.addTag.bind(this)}>Add Tag</button> {this.displayingTags()}
          <br/>
          <button onClick={this.handleSubmit.bind(this)}>Submit</button>
        {this.state.message}
      </div>
    )
  }
}

export default AddVideo;
