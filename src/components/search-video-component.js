import React, {Component} from 'react';
import Select from 'react-select';
import memoize from "memoize-one";
import Utilities from './js/utilities.js';
import SelectYear from './select-year-component';
import SelectGenre from './select-genre-component';
const remote = window.require('electron').remote;

class SearchVideos extends Component {
  constructor(props) {
    super(props);

    this.min_default = this.props.appData.min_year;
    this.max_default = new Date().getFullYear();
    this.pressEnter = this.pressEnter.bind(this);
    this.video_title = React.createRef();
    this.video_band = React.createRef();
    this.video_lyrics = React.createRef();

    this.state = {
      title: remote.getGlobal('search').search_arguments.title.field,
      band: remote.getGlobal('search').search_arguments.band.field,
      genre: remote.getGlobal('search').search_arguments.genre.field,
      lyrics: remote.getGlobal('search').search_arguments.lyrics.field,
      mintomax: remote.getGlobal('search').search_arguments.mintomax.field,
      maxtomin: remote.getGlobal('search').search_arguments.maxtomin.field,
      tag: remote.getGlobal('search').search_arguments.tag.field,
      stars: remote.getGlobal('search').search_arguments.stars.field,
      focused: props.focused,
      genre_opts: this.props.appData.video_genre,
      all_tags: this.props.all_tags
    }
  }





  compare = memoize(
    (focusedProp, focusedState) => focusedProp !== focusedState ? focusedProp : focusedState
  );

  componentDidMount() {
    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "search";
    document.addEventListener("keydown", this.pressEnter, false);

    if (remote.getGlobal('search').view_all === false) {
      this.setState({
        title: remote.getGlobal('search').search_arguments.title.field,
        band: remote.getGlobal('search').search_arguments.band.field,
        genre: remote.getGlobal('search').search_arguments.genre.field,
        lyrics: remote.getGlobal('search').search_arguments.lyrics.field,
        mintomax: (remote.getGlobal('search').search_arguments.mintomax.field === this.min_default ? "" : remote.getGlobal('search').search_arguments.mintomax.field),
        maxtomin: (remote.getGlobal('search').search_arguments.maxtomin.field === this.max_default ? "" : remote.getGlobal('search').search_arguments.maxtomin.field),
        tag: remote.getGlobal('search').search_arguments.tag.field,
        stars: remote.getGlobal('search').search_arguments.stars.field
      });
    }
  }

  componentWillUnmount() {

    if (remote.getGlobal('search').band_search === true) {
      this.video_band.value = remote.getGlobal('search').search_arguments.band.field;
      remote.getGlobal('search').band_search = false;
    } else if (remote.getGlobal('search').tag_search === true) {
      this.video_band.value = "";
      remote.getGlobal('search').tag_search = false;
    } else {

      remote.getGlobal('search').search_arguments.title.field = this.video_title.value;
      remote.getGlobal('search').search_arguments.band.field = this.video_band.value;
      remote.getGlobal('search').search_arguments.lyrics.field = this.video_lyrics.value;
    }
    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "";
    document.removeEventListener("keydown", this.pressEnter, false);
  }

  pressEnter(event) {
    if (event.keyCode === 13 && remote.getGlobal('enterTracker').tag_insert_tracker === false && remote.getGlobal('enterTracker').component_tracker === "search") {
      this.handleSubmit();
    }
  }

  handleSubmit() {
    let title = this.video_title.value;
    let band = this.video_band.value;
    let lyrics = this.video_lyrics.value;

    if (title === "" && band === "" && this.state.mintomax === "" && this.state.maxtomin === "" && (this.state.genre === null || this.state.genre.length === 0) && lyrics === "" && (this.state.tag === null || this.state.tag.length === 0) && (this.state.stars === null || this.state.stars.length === 0)) {
      alert("Please enter something to search for.");
    } else if ((this.state.mintomax === "" && this.state.maxtomin !== "") || (this.state.mintomax !== "" && this.state.maxtomin === "")) {
      alert("You must select both a start year and end year to search for.");
    } else {

      let mintomax = this.state.mintomax;
      let maxtomin = this.state.maxtomin;
      let ifyears = true;

      if (mintomax === "" && maxtomin === "") {
        mintomax = this.min_default;
        maxtomin = this.max_default;
        ifyears = false;
      }

      if (mintomax > maxtomin) {
        let temp_min = mintomax;
        let temp_max = maxtomin;
        mintomax = temp_max;
        maxtomin = temp_min;
      }

      this.props.searchVideos({title: title, band: band, mintomax: mintomax, maxtomin: maxtomin, genre: this.state.genre, lyrics: lyrics, ifyears: ifyears, tag: this.state.tag, stars: this.state.stars, key_press: true});

      remote.getGlobal('search').search_arguments.title.field = title;
      remote.getGlobal('search').search_arguments.band.field = band;
      remote.getGlobal('search').search_arguments.lyrics.field = lyrics;
    }
  }

  resetSearch() {

    this.setState({ title: "", band: "", mintomax: "", maxtomin: "", genre: null, lyrics: "", tag: null, stars: null }, function() {
      remote.getGlobal('search').search_arguments.title = { field: "", searched: "" };
      remote.getGlobal('search').search_arguments.band = { field: "", searched: "" };
      remote.getGlobal('search').search_arguments.genre = { field: null, searched: null };
      remote.getGlobal('search').search_arguments.lyrics = { field: "", searched: "" };
      remote.getGlobal('search').search_arguments.mintomax = { field: "", searched: "" };
      remote.getGlobal('search').search_arguments.maxtomin = { field: "", searched: "" };
      remote.getGlobal('search').search_arguments.tag = { field: null, searched: null };
      remote.getGlobal('search').search_arguments.stars = { field: null, searched: null };

      this.video_title.value = "";
      this.video_band.value = "";
      this.video_lyrics.value = "";
    });
  }

  createYears(range) {

    let minimum_year = this.min_default;

    if (range === "mintomax") {
      let numbers = [""];

      for (var i = minimum_year, current_year = this.max_default; i <= current_year; i++) {
        numbers.push(i);
      }

      return numbers.map((year) => {
        return (
          <option key={"year"+year} value={year}>{year}</option>
        )
      });
    } else if (range === "maxtomin") {
      let numbers = [""];

      for (var i = this.max_default, min = minimum_year; i >= min; i--) {
        numbers.push(i);
      }

      return numbers.map((year) => {
        return (
          <option key={"year"+year} value={year}>{year}</option>
        )
      });
    }
  }

  handle_title_Change(event) {
    this.setState({ title: event.target.value }, function() {
      remote.getGlobal('search').search_arguments.title.field = this.state.title;
    });
  }

  handle_band_Change(event) {
    this.setState({ band: event.target.value }, function() {
      remote.getGlobal('search').search_arguments.band.field = this.state.band;
    });
  }

  handle_lyrics_Change(event) {
    this.setState({ lyrics: event.target.value }, function() {
      remote.getGlobal('search').search_arguments.lyrics.field = this.state.lyrics;
    });
  }

  handle_mintomax_Change(event) {
    this.setState({ mintomax: event.target.value }, function() {
      remote.getGlobal('search').search_arguments.mintomax.field = this.state.mintomax;
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "search";
    });
  }

  handle_maxtomin_Change(event) {
    this.setState({ maxtomin: event.target.value }, function() {
      remote.getGlobal('search').search_arguments.maxtomin.field = this.state.maxtomin;
      remote.getGlobal('enterTracker').tag_insert_tracker = false;
      remote.getGlobal('enterTracker').component_tracker = "search";
    });
  }

  handle_tracker_onClick() {
    remote.getGlobal('enterTracker').tag_insert_tracker = false;
    remote.getGlobal('enterTracker').component_tracker = "search";
  }





    filter = memoize(
      (propGenres, stateGenres) => propGenres.filter(item => stateGenres.includes(item))
    );

  render() {
    const { genre_opts, genre, stars, tag, all_tags, band, title, lyrics, mintomax, maxtomin } = this.state;


    const updatedGenres = this.filter(this.props.appData.video_genre, genre_opts);

    let genreOptions = [];
    for (var i = 0, length = updatedGenres.length; i < length; i++) {
      genreOptions.push({ value: updatedGenres[i], label: updatedGenres[i] })
    }
    const updatedTags = this.filter(this.props.all_tags, all_tags);
    const starsOptions = [
      { value: '1', label: '1 star' },
      { value: '2', label: '2 stars' },
      { value: '3', label: '3 stars' },
      { value: '4', label: '4 stars' },
      { value: '5', label: '5 stars' }
    ];
    return (
      <div className="ui">
        <h3>Search: <div className="float_right"><button onClick={this.props.hideSearch}>Hide</button></div></h3>
          Title: <input ref={video_title => this.video_title = video_title} defaultValue={title} onBlur={this.handle_title_Change.bind(this)} onClick={this.handle_tracker_onClick.bind(this)}/>
          <br/>
          Band: <input ref={video_band => this.video_band = video_band} defaultValue={band} onBlur={this.handle_band_Change.bind(this)} onClick={this.handle_tracker_onClick.bind(this)}/>
          <br/>
          Year:{ ' ' }
          <SelectYear insertFunction={this.handle_mintomax_Change.bind(this)} insertValue={mintomax} minimumYear={this.min_default} minOrMax="maxtomin" appData={this.props.appData}></SelectYear> to{ ' ' }
          <SelectYear insertFunction={this.handle_maxtomin_Change.bind(this)} insertValue={maxtomin} minimumYear={this.min_default} minOrMax="maxtomin" appData={this.props.appData}></SelectYear>
          <br/>
          Lyrics: <input ref={video_lyrics => this.video_lyrics = video_lyrics} defaultValue={lyrics} onBlur={this.handle_lyrics_Change.bind(this)} onClick={this.handle_tracker_onClick.bind(this)}/>
          <br/><br/>
          <Select
            styles={Utilities.reactSelectStyles(this.props.cssTemplate)}
            value={genre}
            onChange={value => this.setState({ genre: value }, function() {
              remote.getGlobal('search').search_arguments.genre.field = value;
              remote.getGlobal('enterTracker').tag_insert_tracker = false;
              remote.getGlobal('enterTracker').component_tracker = "search";
            })}
            options={genreOptions}
            closeMenuOnSelect={false}
            placeholder="Select a genre (or genres)..."
            isMulti
          />
          <br/>
          <Select
            styles={Utilities.reactSelectStyles(this.props.cssTemplate)}
            value={tag}
            onChange={value => this.setState({ tag: value }, function() {
              remote.getGlobal('search').search_arguments.tag.field = value;
              remote.getGlobal('enterTracker').tag_insert_tracker = false;
              remote.getGlobal('enterTracker').component_tracker = "search";
            })}
            options={Utilities.createTagOptions(updatedTags)}
            closeMenuOnSelect={false}
            placeholder="Select a tag (or tags)..."
            isMulti
          />
          <br/>
          <Select
            styles={Utilities.reactSelectStyles(this.props.cssTemplate)}
            value={stars}
            onChange={value => this.setState({ stars: value }, function() {
              remote.getGlobal('search').search_arguments.stars.field = value;
              remote.getGlobal('enterTracker').tag_insert_tracker = false;
              remote.getGlobal('enterTracker').component_tracker = "search";
            })}
            options={starsOptions}
            closeMenuOnSelect={false}
            placeholder="Select a star rating (or ratings)..."
            isMulti
          />
          <br/>
        <button onClick={this.handleSubmit.bind(this)}>Search</button>
        <button onClick={this.resetSearch.bind(this)}>Reset</button>
      </div>
    )
  }
}

export default SearchVideos;
