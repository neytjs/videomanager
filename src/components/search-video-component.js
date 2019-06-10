/*
The search-video subcomponent provides the user an interface for querying data in the videos.db
NeDB database to return a specific subset of videos.
*/

import React, {Component} from 'react';
import SelectYear from './select-year-component';
import SelectGenre from './select-genre-component';
const remote = window.require('electron').remote;

class SearchVideos extends Component {
  constructor(props) {
    super(props);

    this.min_default = this.props.appData.min_year;
    this.max_default = new Date().getFullYear();
    this.pressEnter = this.pressEnter.bind(this);

    this.state = {
      title: "",
      band: "",
      genre: "",
      lyrics: "",
      mintomax: "",
      maxtomin: "",
      tag: "",
      stars: ""
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.pressEnter, false);

    if (remote.getGlobal('search').view_all === false) {
      this.setState({
        title: remote.getGlobal('search').search_arguments.video_title,
        band: remote.getGlobal('search').search_arguments.band,
        genre: remote.getGlobal('search').search_arguments.genre,
        lyrics: remote.getGlobal('search').search_arguments.lyrics,
        mintomax: (remote.getGlobal('search').search_arguments.mintomax === this.min_default ? "" : remote.getGlobal('search').search_arguments.mintomax),
        maxtomin: (remote.getGlobal('search').search_arguments.maxtomin === this.max_default ? "" : remote.getGlobal('search').search_arguments.maxtomin),
        tag: remote.getGlobal('search').search_arguments.tag,
        stars: remote.getGlobal('search').search_arguments.stars
      });
    }
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.pressEnter, false);
  }

  pressEnter(event) {
    if (event.keyCode === 13) {
      this.handleSubmit();
    }
  }

  handleSubmit() {

    if (this.state.title === "" && this.state.band === "" && this.state.mintomax === "" && this.state.maxtomin === "" && this.state.genre === "" && this.state.lyrics === "" && this.state.tag === "" && this.state.stars === "") {
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

      this.props.searchVideos({video_title: this.state.title, band: this.state.band, mintomax: mintomax, maxtomin: maxtomin, genre: this.state.genre, lyrics: this.state.lyrics, ifyears: ifyears, tag: this.state.tag, stars: this.state.stars});
    }
  }

  resetSearch() {

    this.setState({ title: "", band: "", mintomax: "", maxtomin: "", genre: "", lyrics: "", tag: "", stars: "" });
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
    this.setState({ title: event.target.value });
  }

  handle_band_Change(event) {
    this.setState({ band: event.target.value });
  }

  handle_genre_Change(event) {
    this.setState({ genre: event.target.value });
  }

  handle_lyrics_Change(event) {
    this.setState({ lyrics: event.target.value });
  }

  handle_mintomax_Change(event) {
    this.setState({ mintomax: event.target.value });
  }

  handle_maxtomin_Change(event) {
    this.setState({ maxtomin: event.target.value });
  }

  handle_tag_Change(event) {
    this.setState({ tag: event.target.value });
  }

  handle_star_Change(event) {
    this.setState({ stars: event.target.value });
  }

  render() {
    return (
      <div>
        <h3>Search:</h3>
          Title: <input value={this.state.title} onChange={this.handle_title_Change.bind(this)}/>
          <br/>
          Band: <input value={this.state.band} onChange={this.handle_band_Change.bind(this)}/>
          <br/>
          Year:{ ' ' }
          <SelectYear insertFunction={this.handle_mintomax_Change.bind(this)} insertValue={this.state.mintomax} minimumYear={this.min_default} minOrMax="maxtomin" appData={this.props.appData}></SelectYear> to{ ' ' }
          <SelectYear insertFunction={this.handle_maxtomin_Change.bind(this)} insertValue={this.state.maxtomin} minimumYear={this.min_default} minOrMax="maxtomin" appData={this.props.appData}></SelectYear>
          <br/>
          Lyrics: <input value={this.state.lyrics} onChange={this.handle_lyrics_Change.bind(this)}/>
          <br/>
          Genre: <SelectGenre insertFunction={this.handle_genre_Change.bind(this)} insertValue={this.state.genre} appData={this.props.appData}></SelectGenre>
          <br/>
          Tag: <input value={this.state.tag} onChange={this.handle_tag_Change.bind(this)}/>
          <br/>
          Stars: <select onChange={this.handle_star_Change.bind(this)} value={this.state.stars}>
                        <option value=""></option>
                        <option value="1">1 star</option>
                        <option value="2">2 stars</option>
                        <option value="3">3 stars</option>
                        <option value="4">4 stars</option>
                        <option value="5">5 stars</option>
                      </select>
          <br/>
        <button onClick={this.handleSubmit.bind(this)}>Search</button>
        <button onClick={this.resetSearch.bind(this)}>Reset</button>
        <button onClick={this.props.showHideSearch}>Hide</button>
      </div>
    )
  }
}

export default SearchVideos;
