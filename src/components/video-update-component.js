import React, {Component} from 'react';
import SelectYear from './select-year-component';
import SelectGenre from './select-genre-component';
import SelectType from './select-type-component';

class VideoUpdate extends Component {
  constructor(props) {
    super(props);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handleBandChange = this.handleBandChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleLyricsChange = this.handleLyricsChange.bind(this);
    this.handleGenreChange = this.handleGenreChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);

    this.state = {
      video_title: props.displayVideo.video_title,
      video_code: props.displayVideo.video_code,
      video_band: props.displayVideo.video_band,
      video_year: props.displayVideo.video_year,
      video_lyrics: props.displayVideo.video_lyrics.join(" "),
      video_genre: props.displayVideo.video_genre,
      video_type: props.displayVideo.video_type,
      video_tags: props.displayVideo.video_tags,
      video_stars: props.displayVideo.video_stars,
      tag: ""
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.displayVideo.video_title !== this.state.video_title || nextProps.displayVideo.video_code !== this.state.video_code || nextProps.displayVideo.video_band !== this.state.video_band || nextProps.displayVideo.video_year !== this.state.video_year || nextProps.displayVideo.video_lyrics !== this.state.video_lyrics || nextProps.displayVideo.video_genre !== this.state.video_genre || nextProps.displayVideo.video_type !== this.state.video_type  || nextProps.displayVideo.video_tags !== this.state.video_tags) {
      this.setState({ video_title: nextProps.displayVideo.video_title, video_code: nextProps.displayVideo.video_code, video_band: nextProps.displayVideo.video_band, video_year: nextProps.displayVideo.video_year, video_lyrics: nextProps.displayVideo.video_lyrics.join(" "), video_genre: nextProps.displayVideo.video_genre, video_type: nextProps.displayVideo.video_type, video_tags: nextProps.displayVideo.video_tags });
    }
  }

  handleSubmit(e) {
      if (this.state.video_code === "" || this.state.video_title === "" || this.state.video_band === "" || this.state.video_year === "" || this.state.video_genre === "" || this.state.video_type === "") {
        alert("A new title, band, year, genre, type, and video code are required.");
      } else {
        this.props.updateVideo(this.state.video_title, this.state.video_code, this.state.video_band, this.state.video_year, this.state.video_lyrics, this.state.video_genre, this.props.displayVideo.video_code, this.state.video_type, this.state.video_tags, this.state.video_stars);
        this.props.editStatus();
      }

      e.preventDefault();
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

  handleLyricsChange(event) {
    this.setState({ video_lyrics: event.target.value });
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
    let new_tag = this.refs.tag.value;
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

    e.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          New title: <input type="text" value={this.state.video_title} onChange={this.handleTitleChange} />
          <br/>
          New video code: <input type="text" value={this.state.video_code} onChange={this.handleCodeChange} />
          <br/>
          New band: <input type="text" value={this.state.video_band} onChange={this.handleBandChange} />
          <br/>
          New year: <SelectYear insertFunction={this.handleYearChange.bind(this)} insertValue={this.state.video_year} minimumYear="1960" minOrMax="maxtomin" appData={this.props.appData}></SelectYear>
          <br/>
          New lyrics: <input type="text" value={this.state.video_lyrics} onChange={this.handleLyricsChange} />
          <br/>
          New genre: <SelectGenre insertFunction={this.handleGenreChange.bind(this)} insertValue={this.state.video_genre} appData={this.props.appData}></SelectGenre>
          <br/>
          New type: <SelectType insertFunction={this.handleTypeChange.bind(this)} insertValue={this.state.video_type} appData={this.props.appData}></SelectType>
          <br/>
          New tags: {this.displayingEditableTags()}  <input onChange={this.handle_tags_Change.bind(this)} value={this.state.tag} ref="tag" /> <button onClick={this.addTag.bind(this)}>Add Tag</button>
          <br/>
          <button onClick={this.handleSubmit.bind(this)}>Submit</button>
        </form>
      </div>
    )
  }
}

export default VideoUpdate;
