/*
video-list-component is the app's most important subcomponent and holds methods organizing the 'CRUD'
aspects of the app, letting the user insert, read, update and delete data stored in the main videos.db
NeDB database that holds the data for their videos list. It also organizes the layout of the video list,
so that the appropriate subcomponent will load if they want to conduct a search or view a video.
*/

import React, {Component} from 'react';
import VideoDetails from './video-details.component';
import Ui from './ui-component';
import Table from './table-component';
import Utilities from './js/utilities.js';
const remote = window.require('electron').remote;

class VideoList extends Component {
  constructor(props) {
    super(props);
    this.displayVideo = this.displayVideo.bind(this);
    this.updateVideo = this.updateVideo.bind(this);
    this.assignStar = this.assignStar.bind(this);
    this.deleteVideo = this.deleteVideo.bind(this);
    this.hideVideo = this.hideVideo.bind(this);
    this.showHidden = this.showHidden.bind(this);
    this.searchVideos = this.searchVideos.bind(this);
    this.viewAll = this.viewAll.bind(this);
    this.deSelect = this.deSelect.bind(this);
    this.addToHistory = this.addToHistory.bind(this);
    this.loadVideoFromHistory = this.loadVideoFromHistory.bind(this);
    this.searchString = this.searchString.bind(this);

    this.state = {
      videos: [],
      selected_video: {},
      video_id: 0,
      video_el: 0,
      counter: 0,
      body_background_color: "",
      total_videos: 0,
      hidden_videos: [],
      hidden: 0,
      search: "",
      searchRef: React.createRef(),
      displaying: false
    };
  }

  componentDidMount() {
    this.viewAll();
  }

    loadVideoFromHistory() {

      if (remote.getGlobal('history_viewer').video.video_id) {
        let id = remote.getGlobal('history_viewer').video.video_id;
        let vids_length = this.state.videos.length;

        for (var i = 0; i < vids_length; i++) {
          if (this.state.videos[i]._id === id) {

            this.displayVideo(this.state.videos[i], id, i);
          }
        }
      }
    }

  viewAll() {

    this.props.videos_shortterm.find({}, function(err, docs) {

      this.setState({videos: docs.sort(function(a, b) {

        if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
          return 1;
        }
        if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
          return -1;
        }

        if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
          return 1;
        }
        if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
          return -1;
        }

        return 0;
      })});

      this.setState({counter: this.state.videos.length, total_videos: this.state.videos.length, search: ""});

      this.loadVideoFromHistory();
    }.bind(this));
  }

  displayVideo(vid, id, el) {

    this.setState({selected_video: vid, video_id: id, video_el: el, displaying: true});

    window.scrollTo(0, 0);
  }

  searchVideos(video_title, band, mintomax, maxtomin, genre, lyrics, ifyears, tag, stars) {

    let search_title = Utilities.customSplit(video_title);
    let search_band = Utilities.customSplit(band);
    let search_lyrics = Utilities.customSplit(lyrics);

    var tags = [];

    if (tag !== "") {
      tags.push(tag);
    }

     var genre_regex = new RegExp(genre, 'i');
     var stars_regex = new RegExp(stars, 'i');

     var query = { video_genre: { $regex: genre_regex }, video_stars: { $regex: stars_regex } };

     this.props.videos_shortterm.find(query, function(err, docs) {

        if (docs.length > 0) {

          docs = Utilities.yearPruning(docs, mintomax, maxtomin);

          docs = Utilities.arrayComparerFindAll(search_title.notquotes, docs, "video_title");
          docs = Utilities.arrayComparer(search_title.quotes, docs, "video_title");
          docs = Utilities.arrayComparerFindAll(search_band.notquotes, docs, "video_band");
          docs = Utilities.arrayComparer(search_band.quotes, docs, "video_band");
          docs = Utilities.arrayComparerFindAll(search_lyrics.notquotes, docs, "video_lyrics");
          docs = Utilities.arrayComparer(search_lyrics.quotes, docs, "video_lyrics");

          docs = Utilities.arrayComparer(tags, docs, "video_tags");

          this.setState({videos: docs.sort(function(a, b) {

              if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
                return 1;
              }
              if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
                return -1;
              }

              if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
                return 1;
              }
              if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
                return -1;
              }

              return 0;
          })});

            this.searchString(video_title, band, mintomax, maxtomin, genre, lyrics, ifyears, tag, stars);

            this.setState({counter: this.state.videos.length, hidden_videos: [], hidden: 0});
        } else {

          this.searchString(video_title, band, mintomax, maxtomin, genre, lyrics, ifyears, tag, stars);

          this.setState({videos: docs});

          this.setState({counter: this.state.videos.length, hidden_videos: [], hidden: 0});
        }

        let offset = this.state.searchRef.current.getBoundingClientRect();
        window.scrollTo(0, offset.top);
     }.bind(this));
  }

  searchString(video_title, band, mintomax, maxtomin, genre, lyrics, ifyears, tag, stars) {
    let search_string = "Searching videos ";
    let search_array = [];

    if (video_title !== "") {
      search_array.push("video_title");
    }

    if (band !== "") {
      search_array.push("band");
    }

    if (mintomax !== "" && maxtomin !== "" && ifyears === true) {
      search_array.push("mintomax");
    }

    if (lyrics.length > 0) {
      search_array.push("lyrics");
    }

    if (genre !== "") {
      search_array.push("genre");
    }

    if (tag !== "") {
      search_array.push("tag");
    }

    if (stars !== "") {
      search_array.push("stars");
    }

    let counter = 0;

    let recursions = search_array.length;

    function innerRecursiveFunction() {

      if (search_array[counter] === "video_title") {
        search_string += "titles with " + video_title;
      }

      if (search_array[counter] === "band") {
        search_string += "bands called " + band;
      }

      if (search_array[counter] === "mintomax") {
        search_string += "between the years of " + mintomax + " and " + maxtomin;
      }

      if (search_array[counter] === "lyrics") {
        search_string += "with the lyrics \"" + lyrics + "\"";
      }

      if (search_array[counter] === "genre") {
        search_string += "in the genre of " + genre;
      }

      if (search_array[counter] === "tag") {
        search_string += "with tags of \"" + tag + "\"";
      }

      if (search_array[counter] === "stars") {
        search_string += "that have a rating of " + stars + " stars";
      }

      if (counter < (recursions - 2)) {
        search_string += ", ";
      }

      if (counter === (recursions - 2)) {
        if (recursions === 2) {
          search_string += " and ";
        } else {
          search_string += ", and ";
        }
      }

      if (counter === (recursions - 1)) {
        search_string += ".";
      }

      counter = counter + 1;

      if (counter < recursions) {
        innerRecursiveFunction();
      }
    }

    innerRecursiveFunction();

    this.setState({search: search_string})
  }

  deleteVideo(video_id) {

    var confirm_delete = confirm("Do you really want to delete this video?");

    if (confirm_delete === true) {

      this.props.videos.remove({ _id: video_id }, {}, function (err, numRemoved) {

      });

      this.props.videos_shortterm.remove({ _id: video_id }, {}, function (err, numRemoved) {

      });

      this.props.history.remove({ video_id: video_id }, { multi: true }, function (err, numRemoved) {

      });

      let state = Object.assign({}, this.state);

      let video_el = state.video_el;

      state.videos.splice(video_el, 1);

      delete state.selected_video;

      state.selected_video = {};

      this.setState(state);

      this.setState({counter: this.state.videos.length});
    }
  }

  hideVideo(elm, video_code) {

      let state = Object.assign({}, this.state);

      state.hidden_videos.push(state.videos[elm]);

      state.hidden = state.hidden_videos.length;

      state.videos.splice(elm, 1);

      this.setState(state);

      this.setState({counter: (this.state.videos.length + this.state.hidden_videos.length)});
  }

  showHidden() {

      let state = Object.assign({}, this.state);

      let hidden_videos_length = state.hidden_videos.length;

      for (var i = 0; i < hidden_videos_length; i++) {
        state.videos.push(state.hidden_videos[i]);
      }

      state.videos = state.videos.sort(function(a, b) {

          if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
            return 1;
          }
          if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
            return -1;
          }

          if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
            return 1;
          }
          if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
            return -1;
          }

          return 0;
      });

      state.hidden_videos.splice(0, state.hidden);

      state.hidden = 0;

      this.setState(state);

      this.setState({counter: this.state.videos.length});
  }

  assignStar(video_id, star) {

    this.props.videos.update({_id: video_id}, {$set:{video_stars: star}}, function(err, doc) {

    });

    this.props.videos_shortterm.update({_id: video_id}, {$set:{video_stars: star}}, function(err, doc) {

    });

    let state = Object.assign({}, this.state);
    state.selected_video.video_stars = star;

    for (var i = 0, videos_length = state.videos.length; i < videos_length; i++) {
      if (state.videos[i]._id === video_id) {
        state.videos[i].video_stars = star;
      }
    }

    if (state.hidden > 0) {

      for (var i = 0, videos_length = state.hidden_videos.length; i < videos_length; i++) {
        if (state.hidden_videos[i]._id === video_id) {
          state.hidden_videos[i].video_stars = star;
        }
      }
    }

    this.setState(state);
  }

  updateVideo(new_video_title, new_video_code, new_band, new_year, new_lyrics, new_genre, old_video_code, new_type, new_tags, new_stars) {

    let new_lyrics_html = new_lyrics;

    new_lyrics = Utilities.htmlStringCleanerArrayConverter(new_lyrics);

    new_video_code = new_video_code.trim();
    new_video_title = new_video_title.trim();
    new_band = new_band.trim();
    new_year = new_year.trim();

    this.props.videos.update({video_code: old_video_code}, {$set:{video_code: new_video_code, video_title: new_video_title, video_band: new_band, video_year: new_year, video_lyrics: new_lyrics, video_lyrics_html: new_lyrics_html, video_genre: new_genre, video_type: new_type, video_tags: new_tags}}, function(err, doc) {

    });

    this.props.videos_shortterm.update({video_code: old_video_code}, {$set:{video_code: new_video_code, video_title: new_video_title, video_band: new_band, video_year: new_year, video_lyrics: new_lyrics, video_lyrics_html: new_lyrics_html, video_genre: new_genre, video_type: new_type, video_tags: new_tags}}, function(err, doc) {

    });

    let state = Object.assign({}, this.state);
    let el = state.video_el;



    var video_present = false;

    for (var i = 0, vid_length = state.videos.length; i < vid_length; i++) {

      if (this.state.videos[i].video_code === old_video_code) {

        video_present = true;
      }
    }

    if (video_present === true) {

      state.videos[el].video_title = new_video_title;
      state.videos[el].video_code = new_video_code;
      state.videos[el].video_band = new_band;
      state.videos[el].video_year = new_year;
      state.videos[el].video_lyrics = new_lyrics;
      state.videos[el].video_lyrics_html = new_lyrics_html;
      state.videos[el].video_genre = new_genre;
      state.videos[el].video_type = new_type;
      state.videos[el].video_tags = new_tags;
      state.videos[el].video_stars = new_stars;

      state.videos = state.videos.sort(function(a, b) {

          if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
            return 1;
          }
          if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
            return -1;
          }

          if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
            return 1;
          }
          if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
            return -1;
          }

          return 0;
      });

      this.setState({counter: this.state.videos.length});
    }

      state.selected_video.video_title = new_video_title;
      state.selected_video.video_code = new_video_code;
      state.selected_video.video_band = new_band;
      state.selected_video.video_year = new_year;
      state.selected_video.video_lyrics = new_lyrics;
      state.selected_video.video_lyrics_html = new_lyrics_html;
      state.selected_video.video_genre = new_genre;
      state.selected_video.video_type = new_type;
      state.selected_video.video_tags = new_tags;
      state.selected_video.video_stars = new_stars;

    this.setState(state);
  }

  deSelect() {

    let state = Object.assign({}, this.state);

    state.selected_video = {};

    this.setState(state);
  }

  addToHistory(code, title, band, genre, year, lyrics, lyrics_html, type, tags, stars, id) {

    remote.getGlobal('history_viewer').video = {};

      var history = {
        video_code: code,
        video_title: title,
        video_band: band,
        video_genre: genre,
        video_year: year,
        video_lyrics: lyrics,
        video_lyrics_html: lyrics_html,
        video_type: type,
        view_date: Date.now(),
        video_tags: tags,
        video_stars: stars,
        video_id: id
      };

      this.props.history.insert(history, function(err, doc) {
      });
  }

  orderBySong(ascdesc) {
    this.setState({videos: this.state.videos.sort(function(a, b) {
      if (ascdesc === "ASC") {

        if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
          return 1;
        }
        if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
          return -1;
        }

        if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
          return 1;
        }
        if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
          return -1;
        }

        return 0;
      } else {

        if (a.video_title.toLowerCase() < b.video_title.toLowerCase()) {
          return 1;
        }
        if (b.video_title.toLowerCase() < a.video_title.toLowerCase()) {
          return -1;
        }

        if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
          return 1;
        }
        if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
          return -1;
        }

        return 0;
      }
    })});
  }

  orderByBand(ascdesc) {
    this.setState({videos: this.state.videos.sort(function(a, b) {
      if (ascdesc === "ASC") {

        if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
          return 1;
        }
        if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
          return -1;
        }

        if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
          return 1;
        }
        if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
          return -1;
        }

        return 0;
      } else {

        if (a.video_band.toLowerCase() < b.video_band.toLowerCase()) {
          return 1;
        }
        if (b.video_band.toLowerCase() < a.video_band.toLowerCase()) {
          return -1;
        }

        if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
          return 1;
        }
        if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
          return -1;
        }

        return 0;
      }
    })});
  }

  orderByYear(ascdesc) {
    this.setState({videos: this.state.videos.sort(function(a, b) {
      if (ascdesc === "ASC") {

        if (a.video_year < b.video_year) {
          return 1;
        }
        if (b.video_year < a.video_year) {
          return -1;
        }

        if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
          return 1;
        }
        if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
          return -1;
        }

        if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
          return 1;
        }
        if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
          return -1;
        }

        return 0;
      } else {

        if (a.video_year > b.video_year) {
          return 1;
        }
        if (b.video_year > a.video_year) {
          return -1;
        }

        if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
          return 1;
        }
        if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
          return -1;
        }

        if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
          return 1;
        }
        if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
          return -1;
        }

        return 0;
      }
    })});
  }

  orderByStars(ascdesc) {
    this.setState({videos: this.state.videos.sort(function(a, b) {
      if (ascdesc === "ASC") {

        if (a.video_stars < b.video_stars) {
          return 1;
        }
        if (b.video_stars < a.video_stars) {
          return -1;
        }

        if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
          return 1;
        }
        if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
          return -1;
        }

        if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
          return 1;
        }
        if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
          return -1;
        }

        return 0;
      } else {

        if (a.video_stars > b.video_stars) {
          return 1;
        }
        if (b.video_stars > a.video_stars) {
          return -1;
        }

        if (a.video_band.toLowerCase() > b.video_band.toLowerCase()) {
          return 1;
        }
        if (b.video_band.toLowerCase() > a.video_band.toLowerCase()) {
          return -1;
        }

        if (a.video_title.toLowerCase() > b.video_title.toLowerCase()) {
          return 1;
        }
        if (b.video_title.toLowerCase() > a.video_title.toLowerCase()) {
          return -1;
        }

        return 0;
      }
    })});
  }

  render() {
    const { show_search, show_add, counter, hidden, search, displaying, colors, searchRef } = this.state;
    return (
      <div>
        <Ui currentLoc={"main"} searchVideos={this.searchVideos.bind(this)} appData={this.props.appData}></Ui>
        { displaying === true ?
          <div>
            <hr/>
            <VideoDetails displayVideo={this.state.selected_video} assignStar={this.assignStar.bind(this)} searchVideos={this.searchVideos.bind(this)} videoId={this.state.video_id} updateVideo={this.updateVideo.bind(this)} deleteVideo={this.deleteVideo.bind(this)} deSelect={this.deSelect.bind(this)} appData={this.props.appData}></VideoDetails>
          </div>
        : ""
        }
        <hr/>
        <div ref={searchRef}>
          { search !== "" ?
          <span>
            {search}
            <br/>
          </span>
          : <br/> }
          <b>{counter.toLocaleString('en-US', {minimumFractionDigits: 0})} results{ hidden > 0 ? <span> <a onClick={this.showHidden}>{"(" + hidden + " hidden)"}</a></span> : "" }: { (counter < this.state.total_videos) ? <button onClick={this.viewAll}>View All Videos</button> : ""}</b>
          <Table videos={this.state.videos} table={"main"} displayVideo={this.displayVideo.bind(this)} hideVideo={this.hideVideo.bind(this)} addToHistory={this.addToHistory.bind(this)}
           orderBySong={this.orderBySong.bind(this)} orderByBand={this.orderByBand.bind(this)} orderByYear={this.orderByYear.bind(this)} orderByStars={this.orderByStars.bind(this)}></Table>
        </div>
      </div>
    )
  }
}

export default VideoList;
