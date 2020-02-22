import React, {Component} from 'react';
import SearchVideos from './search-video-component';
import AddVideo from './add-video-component';
import VideoDetails from './video-details.component';
import Table from './table-component';
import Utilities from './js/utilities.js';
const remote = window.require('electron').remote;

class VideoList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      videos: [],
      selected_video: remote.getGlobal('history_viewer').video,
      video_id: 0,
      video_el: 0,
      counter: 0,
      body_background_color: "",
      total_videos: 0,
      search: "",
      searchRef: React.createRef(),
      videoRef: React.createRef(),
      search_hidden: remote.getGlobal('search').search_hidden,
      ascdesc: remote.getGlobal('search').ascdesc,
      sorted: remote.getGlobal('search').sorted,
      loading: true,
      displaying: false,
      history: remote.getGlobal('search').history,
      page: remote.getGlobal('search').page,
      per_page: this.props.appData.per_page_viewall,
      start: 0
    };
  }


  async componentDidMount() {
    let loading = await this.viewAll();
    this.setState({ loading: loading });
  }


  loadVideoFromHistory() {

    if (remote.getGlobal('history_viewer').video.video_id) {
      let just_added = false;
      let history_clicked = false;
      if (remote.getGlobal('history_viewer').history_clicked === true || remote.getGlobal('history_viewer').just_added === true) {
        just_added = remote.getGlobal('history_viewer').just_added;
        history_clicked = remote.getGlobal('history_viewer').history_clicked;

        this.setState({ history: true });

        remote.getGlobal('history_viewer').history_clicked = false;
        remote.getGlobal('history_viewer').just_added = false;

        if (remote.getGlobal('search').prev_view !== "none") {
          remote.getGlobal('search').search_hidden = remote.getGlobal('search').prev_view;
          this.setState({search_hidden: remote.getGlobal('search').prev_view});
        }
      }
      let id = remote.getGlobal('history_viewer').video.video_id;

      this.props.videos_shortterm.findOne({_id: id}, function(err, video) {
        if (just_added === false) {

          this.displayVideo(video, id, 0);
        } else if (history_clicked === true && remote.getGlobal('search').view_all === false) {

          this.displayVideo(video, id, 0);
        } else {
          this.displayVideo(video, id, 0, true);
        }
      }.bind(this));
    }
  }


  viewAll(display_all, page) {
    let returnPromise = () => {
      return new Promise(resolve => {

        this.setState({loading: true});

        if (display_all === true) {
          this.setState({page: 1}, function() {
            remote.getGlobal('search').page = this.state.page;
          });
        }

        this.props.videos_shortterm.find({}, function(err, docs) {
          let videos = docs;
          let total_videos = videos.length;
          let counter = videos.length;

          videos = this.videosSorter(videos, this.state.ascdesc, this.state.sorted);


          let paginate_data = {};
          if (page) {

            paginate_data = this.paginateVideos(videos, page);
            this.setState({page: page}, function() {

              remote.getGlobal('search').page = page;
            });
          } else {
            paginate_data = this.paginateVideos(videos);
          }

          videos = paginate_data.viewable_videos;

          this.setState({counter: counter, total_videos: total_videos, videos: videos, search: "", start: paginate_data.start});

          if (remote.getGlobal('add').just_inserted_code !== "") {

            this.props.videos_shortterm.findOne({video_code: remote.getGlobal('add').just_inserted_code}, function(err, vid) {

              this.props.addToHistory(vid._id);

              remote.getGlobal('history_viewer').video.video_id = vid._id;

              remote.getGlobal('history_viewer').just_added = true;

              this.loadVideoFromHistory();

              remote.getGlobal('add').just_inserted_code = "";
            }.bind(this));
          } else {

            this.loadVideoFromHistory();
          }

          if (videos.length === 0 && remote.getGlobal('search').search_hidden === "none") {
            remote.getGlobal('search').search_hidden = "adding";
            this.setState({search_hidden: "adding"});
          }

          if (display_all === true) {

            remote.getGlobal('search').view_all = true;
            remote.getGlobal('search').search_arguments.title.searched = "";
            remote.getGlobal('search').search_arguments.band.searched = "";
            remote.getGlobal('search').search_arguments.genre.searched = null;
            remote.getGlobal('search').search_arguments.lyrics.searched = "";
            remote.getGlobal('search').search_arguments.mintomax.searched = "";
            remote.getGlobal('search').search_arguments.maxtomin.searched = "";
            remote.getGlobal('search').search_arguments.tag.searched = null;
            remote.getGlobal('search').search_arguments.stars.searched = null;

            this.setState({loading: false});
          } else if (remote.getGlobal('search').view_all === false) {

            this.searchVideos({
              title: remote.getGlobal('search').search_arguments.title.searched,
              band: remote.getGlobal('search').search_arguments.band.searched,
              mintomax: remote.getGlobal('search').search_arguments.mintomax.searched,
              maxtomin: remote.getGlobal('search').search_arguments.maxtomin.searched,
              genre: remote.getGlobal('search').search_arguments.genre.searched,
              lyrics: remote.getGlobal('search').search_arguments.lyrics.searched,
              ifyears: remote.getGlobal('search').search_arguments.ifyears,
              tag: remote.getGlobal('search').search_arguments.tag.searched,
              stars: remote.getGlobal('search').search_arguments.stars.searched
            });
            this.setState({ search_hidden: remote.getGlobal('search').search_hidden });
          } else {

            this.setState({loading: false});
            remote.getGlobal('interfaceClick').clicked = false;
            resolve(false);
          }
        }.bind(this));
      });
    }

    if (remote.getGlobal('editing').editing_video === true) {

      let confirm_delete = confirm("Warning, any unsaved changes will be lost if confirmed.");

      if (confirm_delete === true) {
        returnPromise();
      }
    } else {
      returnPromise();
    }
  }


  displayVideo(vid, id, el, from_list) {
    let runDisplay = () => {

      this.setState({selected_video: vid, video_id: id, video_el: el, displaying: true}, function() {

        if (from_list === true) {
          this.scrollControl("videoRef");
        }

        if (remote.getGlobal('editing').loc !== 0 && remote.getGlobal('search').view_all !== false) {
          this.scrollControl("edit_loc");
        }
      });
    }
    if (remote.getGlobal('editing').editing_video === true) {

      let confirm_delete = confirm("Warning, any unsaved changes will be lost if confirmed.");

      if (confirm_delete === true) {
        runDisplay();
      }
    } else {
      runDisplay();
    }
  }


  searchVideos(searchArgs) {
    let runSearch = () => {
      let video_title = searchArgs.title;
      let band = searchArgs.band;
      let mintomax = searchArgs.mintomax;
      let maxtomin = searchArgs.maxtomin;
      let genre = searchArgs.genre;
      let lyrics = searchArgs.lyrics;
      let ifyears = searchArgs.ifyears;
      let tag = searchArgs.tag;
      let stars = searchArgs.stars;
      let key_press = (searchArgs.key_press) ? searchArgs.key_press : false;

      if (video_title !== "" || band !== "" || genre !== null || lyrics !== "" || tag !== null || stars !== null || ifyears !== false) {

        this.setState({loading: true});

        remote.getGlobal('search').view_all = false;
        remote.getGlobal('search').prev_view = remote.getGlobal('add').just_inserted_code !== "" || remote.getGlobal('search').prev_view === "adding" ? "adding" : "searching";
        remote.getGlobal('search').search_arguments.title.searched = video_title;
        remote.getGlobal('search').search_arguments.band.searched = band;
        remote.getGlobal('search').search_arguments.genre.searched = genre;
        remote.getGlobal('search').search_arguments.lyrics.searched = lyrics;
        remote.getGlobal('search').search_arguments.mintomax.searched = mintomax;
        remote.getGlobal('search').search_arguments.maxtomin.searched = maxtomin;
        remote.getGlobal('search').search_arguments.tag.searched = tag;
        remote.getGlobal('search').search_arguments.stars.searched = stars;
        remote.getGlobal('search').search_arguments.ifyears = ifyears;

        let search_title = Utilities.customSplit(video_title);
        let search_band = Utilities.customSplit(band);
        let search_lyrics = Utilities.customSplit(lyrics);


        let tags = [];

        if (typeof tag === "string") {
          tags.push(tag);
        } else {
          if (tag !== null) {
            for (var i = 0, length = tag.length; i < length; i++) {
              tags.push(tag[i].value);
            }
          }
        }


        let genres = [];
        if (genre !== null) {
          for (var i = 0, length = genre.length; i < length; i++) {
            genres.push(genre[i].value.toLowerCase());
          }
        }

        let stars_ratings = [];
        if (stars !== null) {
          for (var i = 0, length = stars.length; i < length; i++) {
            stars_ratings.push(stars[i].value.toLowerCase());
          }
        }


        if (key_press) {
          this.setState({page: 1}, function() {

            remote.getGlobal('search').page = 1;
          });
        }


        this.props.videos_shortterm.find({}, function(err, docs) {

          if (docs.length > 0) {

            docs = Utilities.arrayComparerFindAny(stars_ratings, docs, "video_stars");
            docs = Utilities.arrayComparerFindAny(genres, docs, "video_genre");

            docs = Utilities.yearPruning(docs, mintomax, maxtomin);

            docs = Utilities.arrayComparerFindAll(search_title.notquotes, docs, "video_title");
            docs = Utilities.arrayComparer(search_title.quotes, docs, "video_title");

            if (remote.getGlobal('search').band_search_clicked === false) {
              docs = Utilities.arrayComparerFindAll(search_band.notquotes, docs, "video_band");
              docs = Utilities.arrayComparer(search_band.quotes, docs, "video_band");
            } else {
              docs = Utilities.findExactStringMatches(band, docs, "video_band");
              remote.getGlobal('search').band_search_clicked = false;
            }
            docs = Utilities.arrayComparerFindAll(search_lyrics.notquotes, docs, "video_lyrics");
            docs = Utilities.arrayComparer(search_lyrics.quotes, docs, "video_lyrics");

            docs = Utilities.arrayComparerFindAll(tags, docs, "video_tags");

            this.setState({videos: docs});

            this.setState({counter: docs.length});

            docs = this.videosSorter(docs, this.state.ascdesc, this.state.sorted);

            let paginate_data = this.paginateVideos(docs);

            docs = paginate_data.viewable_videos;

            this.setState({videos: docs, start: paginate_data.start}, function() {

              this.searchString(video_title, band, mintomax, maxtomin, genres, lyrics, ifyears, tags, stars_ratings, key_press);
            });
          } else {

            this.setState({videos: docs, counter: this.state.videos.length}, function() {

              this.searchString(video_title, band, mintomax, maxtomin, genres, lyrics, ifyears, tags, stars_ratings, key_press);
            });
          }
        }.bind(this));
      }
    }

    if (remote.getGlobal('editing').editing_video === true) {

      let confirm_delete = confirm("Warning, any unsaved changes will be lost if confirmed.");

      if (confirm_delete === true) {
        runSearch();
      }
    } else {
      runSearch();
    }
  }


  searchString(video_title, band, mintomax, maxtomin, genres, lyrics, ifyears, tags, stars, key_press) {
    let search_string = "Searching videos ";
    let search_array = [];

    let genres_string = "";
    if (genres.length > 0) {
      search_array.push("genre");

      if (genres.length === 1) {
        genres_string = genres[0];
      } else {
        genres_string += "[";
        for (var i = 0, length = genres.length; i < length; i++) {
          if (i !== (length - 1)) {
            genres_string += genres[i] + ", ";
          } else {
            genres_string += genres[i];
          }
        }
        genres_string += "]";
      }
    }

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

    let tag = "";

    if (tags.length > 0) {
      search_array.push("tag");

      if (tags.length === 1) {
        tag = tags[0];
      } else {
        tag += "[";
        for (var i = 0, length = tags.length; i < length; i++) {
          if (i !== (length - 1)) {
            tag += tags[i] + ", ";
          } else {
            tag += tags[i];
          }
        }
        tag += "]";
      }
    }

    let stars_string = "";
    if (stars.length > 0) {
      search_array.push("stars");

      if (stars.length === 1) {
        stars_string = stars[0];
      } else {
        stars_string += "[";
        for (var i = 0, length = stars.length; i < length; i++) {
          if (i !== (length - 1)) {
            stars_string += stars[i] + ", ";
          } else {
            stars_string += stars[i];
          }
        }
        stars_string += "]";
      }
    }


    let counter = 0;

    let recursions = search_array.length;


    function innerRecursiveFunction() {

      if (search_array[counter] === "video_title") {
        search_string += "titled \"" + video_title + "\"";
      }

      if (search_array[counter] === "band") {
        search_string += "with bands called \"" + band + "\"";
      }

      if (search_array[counter] === "mintomax") {
        search_string += "between the years of " + mintomax + " and " + maxtomin;
      }

      if (search_array[counter] === "lyrics") {
        search_string += "with the lyrics \"" + lyrics + "\"";
      }

      if (search_array[counter] === "genre") {
        search_string += "in the " + ((genres.length === 1) ? "genre" : "genres") + " of " + ((genres.length === 1) ? "\"" : "") + genres_string + ((genres.length === 1) ? "\"" : "");
      }

      if (search_array[counter] === "tag") {
        search_string += "tagged as " + ((tags.length === 1) ? "\"" : "") + tag + ((tags.length === 1) ? "\"" : "");
      }

      if (search_array[counter] === "stars") {
        search_string += "rated " + stars_string + " stars";
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

    this.setState({search: search_string, search_hidden: remote.getGlobal('search').search_hidden, loading: false}, function() {

      if (this.state.history === true || remote.getGlobal('search').updated === true) {

        if (remote.getGlobal('editing').loc !== 0) {
          this.scrollControl("edit_loc");
        } else {
          this.scrollControl("videoRef");
        }
        this.setState({ history: false }, function() {
          remote.getGlobal('search').history = false;
          remote.getGlobal('search').updated = false;
        });
      } else {

        if (remote.getGlobal('interfaceClick').clicked === true && key_press === false) {
          this.scrollControl("top");

          remote.getGlobal('interfaceClick').clicked = false;
        } else {
          this.scrollControl("searchRef");
        }
      }
    });
  }


  deleteVideo(video_id) {

    var confirm_delete = confirm("Do you really want to delete this video?");

    if (confirm_delete === true) {

      this.props.videos.remove({ _id: video_id }, {}, function (err, numRemoved) {

      });

      this.props.videos_shortterm.remove({ _id: video_id }, {}, function (err, numRemoved) {
        this.props.videos_shortterm.find({}, function(err, entries) {

          let all_tags = Utilities.allTags(entries);
          this.setState({all_tags: all_tags}, function() {

            this.props.updateAllTags(all_tags);
          });
        }.bind(this));
      }.bind(this));

      this.props.history.remove({ video_id: video_id, list_id: remote.getGlobal('listTracker').list_id }, { multi: true }, function (err, numRemoved) {

      });
      this.props.history_shortterm.remove({ video_id: video_id, list_id: remote.getGlobal('listTracker').list_id }, { multi: true }, function (err, numRemoved) {

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

      this.props.history.update({video_code: old_video_code}, {$set:{video_code: new_video_code, video_title: new_video_title, video_band: new_band}}, { multi: true });
    }.bind(this));

    this.props.videos_shortterm.update({video_code: old_video_code}, {$set:{video_code: new_video_code, video_title: new_video_title, video_band: new_band, video_year: new_year, video_lyrics: new_lyrics, video_lyrics_html: new_lyrics_html, video_genre: new_genre, video_type: new_type, video_tags: new_tags}}, function(err, doc) {
      this.props.videos_shortterm.find({}, function(err, entries) {

        let all_tags = Utilities.allTags(entries);
        this.setState({all_tags: all_tags}, function() {

          this.props.updateAllTags(all_tags);
        });
      }.bind(this));
    }.bind(this));


    let state = Object.assign({}, this.state);
    let el;



    var video_present = false;

    for (var i = 0, vid_length = state.videos.length; i < vid_length; i++) {

      if (this.state.videos[i].video_code === old_video_code) {

        video_present = true;

        el = i;
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

      state.counter = this.state.videos.length;
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

    remote.getGlobal('editing').loc = window.pageYOffset;

    remote.getGlobal('search').updated = true;

    this.setState(state);
  }


  deSelect() {

    let state = Object.assign({}, this.state);

    state.selected_video = {};

    this.setState(state);

    remote.getGlobal('history_viewer').video = {};
  }

  showHideSearch(display) {
    remote.getGlobal('search').prev_view = (display === "none") ? display : remote.getGlobal('search').prev_view;
    remote.getGlobal('search').search_hidden = display;
    this.setState({ search_hidden: display });
    this.scrollControl("top");
  }

  refreshVideo() {
    let current_vid = this.state.selected_video;
    this.setState({ selected_video: {} }, function() {
      this.setState({ selected_video: current_vid });
    });
  }

  scrollControl(position) {

    if (position === "top_click") {
      window.scrollTo(0, 0);
    } else {
      setTimeout(function() {
        if (position === "top") {
          window.scrollTo(0, 0);
        } else if (position === "searchRef") {
          let offset = this.state.searchRef.current.getBoundingClientRect();
          window.scrollTo(0, offset.top);
        } else if (position === "videoRef") {
          window.scrollTo(0, 0);
          let offset = this.state.videoRef.current.getBoundingClientRect();
          window.scrollTo(0, offset.top);
        } else if (position === "edit_loc") {
          window.scrollTo(0, remote.getGlobal('editing').loc);
          remote.getGlobal('editing').loc = 0;
        }
      }.bind(this), 300);
    }
  }

  videosSorter(videos, ascdesc, sort_symbol, theader_call) {

    if (theader_call === true) {
      this.setState({ ascdesc: ascdesc, sorted: sort_symbol }, function() {
        this.viewAll();
      });
    } else {
      if (sort_symbol === "bsn_a" || sort_symbol === "bsn_d") {
        videos.sort(function(a, b) {
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
        });
      } else if (sort_symbol === "" || sort_symbol === "bb_d") {
        videos.sort(function(a, b) {
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
        });
      } else if (sort_symbol === "by_a" || sort_symbol === "by_d") {
        videos.sort(function(a, b) {
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
        });
      } else if (sort_symbol === "bs_a" || sort_symbol === "bs_d") {
        videos.sort(function(a, b) {
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
        });
      }

      return videos;
    }

    remote.getGlobal('search').ascdesc = ascdesc;
    remote.getGlobal('search').sorted = sort_symbol;
  }

  handlePageChange(page) {

    this.viewAll(false, page);
  }

  createPageNumbers() {
    const { counter, page, per_page, videos } = this.state;
    let videos_length = videos.length;
    let pages = [];
    for (var i = 1, length = Math.ceil(counter / per_page); i <= length; i++) {
      pages.push(i);
    }
    let pages_length = pages.length;
    let pagination = [];

    if ((videos_length >= per_page && page === 1) || (counter > per_page && page > 1)) {

    	if (page > 2) {
        pagination.push({ page: 1, status: "First", style: "default" });
    	}

    	for (var i = 1; i <= (page + 1) && i <= pages_length; i++) {
    		if ((page - 1) <= i) {
          if (page === i) {
            pagination.push({ page: i, status: "normal", style: "selected" });
          } else {
            pagination.push({ page: i, status: "normal", style: "default" });
          }
    		}
    	}


    	if (page < (pages_length - 1)) {
    		for (var i = pages_length; i <= pages_length; i++) {
          pagination.push({ page: i, status: "Last", style: "default" });
    		}
    	}
    }

    return pagination.map((pg, i) => {
      return (
        <span key={"pagination" + i}>
          { pg.status === "Last" ? "... " : "" }
          { pg.style === "default" ? <a onClick={this.handlePageChange.bind(this, pg.page)}>{ pg.status === "normal" ? pg.page : pg.status }</a>
            : <b>{ pg.page }</b> }
          {' '}
          { pg.status === "First" ? "... " : "" }
        </span>
      )
    });
  }

  paginateVideos(videos, page) {


    if (isNaN(page) === true)  {
      page = this.state.page;
    }

    let per_page = this.state.per_page;

    let start = (page > 1) ? (page * per_page) - per_page : 0;

    let viewable_videos = [];
    for (var i = 0, length = videos.length; i < length; i++) {
      if (i < (start + per_page) && i >= start) {
        viewable_videos.push(videos[i]);
      }
    }

    return { viewable_videos: viewable_videos, start: start }
  }


  render() {
  const { counter, search, displaying, colors, searchRef, videoRef, search_hidden, start, per_page, loading, total_videos } = this.state;
    return (
      <div>
          { loading === true ? <div>Loading videos...</div> :
            <div>
            {
              search_hidden === "searching" ?
              <div>
                <SearchVideos searchVideos={this.searchVideos.bind(this)} hideSearch={this.showHideSearch.bind(this, "none")} appData={this.props.appData} all_tags={this.props.all_tags} cssTemplate={this.props.cssTemplate}></SearchVideos>
              </div>
              : ""
            }
            {
              search_hidden === "adding" ?
              <div>
                <AddVideo videos={this.props.videos} videos_shortterm={this.props.videos_shortterm} hideAdd={this.showHideSearch.bind(this, "none")} appData={this.props.appData} updateAllTags={this.props.updateAllTags} cssTemplate={this.props.cssTemplate}></AddVideo>
              </div>
              : ""
            }
            <div ref={videoRef}>
              {
                displaying === true ?
                <VideoDetails displayVideo={this.state.selected_video} assignStar={this.assignStar.bind(this)} searchVideos={this.searchVideos.bind(this)} videoId={this.state.video_id} updateVideo={this.updateVideo.bind(this)} deleteVideo={this.deleteVideo.bind(this)} deSelect={this.deSelect.bind(this)} appData={this.props.appData} cssTemplate={this.props.cssTemplate} refreshVideo={this.refreshVideo.bind(this)}></VideoDetails>
                : ""
              }
            </div>
            { search !== "" ?
            <div ref={searchRef}>
              {search}
            </div>
            : "" }
            { counter > 0 || total_videos > 0 ?
              <div>
                <b>{counter.toLocaleString('en-US', {minimumFractionDigits: 0})} videos{counter > 0 ? <span> (viewing {start + 1} - {start + per_page < counter ? start + per_page : counter}):</span> : ":"} { (counter < this.state.total_videos) ? <button onClick={() => this.viewAll(true)}>View All Videos</button> : ""}</b>
                <br/>
                { this.createPageNumbers() }
                <Table videos={this.state.videos} table={"main"} displayVideo={this.displayVideo.bind(this)} addToHistory={this.props.addToHistory} videosSorter={this.videosSorter.bind(this)}></Table>
                { this.createPageNumbers() }
                <br/>
                { (counter > 15 || (search_hidden === "searching" && counter > 6 || search_hidden === "adding" && counter > 1 )) ? <button onClick={() => this.scrollControl("top_click")}>Top</button> : ""}
              </div>
             : "" }
          </div>
        }
      </div>
    )
  }
}

export default VideoList;
