import React, {Component} from 'react';
import Ui from './ui-component';
import Utilities from './js/utilities.js';

class Metrics extends Component {
  constructor() {
    super();
    this.lineBreak = {
      whiteSpace: 'pre-line'
    }
    this.loadVideosAndMetrics = this.loadVideosAndMetrics.bind(this);
    this.calculateMpGenre = this.calculateMpGenre.bind(this);
    this.calculateMpYear = this.calculateMpYear.bind(this);
    this.calculateMpBand = this.calculateMpBand.bind(this);
    this.displayGenrePieChart = this.displayGenrePieChart.bind(this);

    this.state = {
      videos: [],
      mp_genre: "",
      mp_year: "",
      mp_band: "",
      total_songs: 0
    }
  }

  componentDidMount() {
    this.loadVideosAndMetrics();
  }

  loadVideosAndMetrics() {
    this.props.videos_shortterm.find({}, function(err, docs) {
      this.setState({videos: docs, total_songs: docs.length});
      this.calculateMpGenre();
      this.calculateMpYear();
      this.calculateMpBand();
      this.displayGenrePieChart();
    }.bind(this));
  }

  calculateMpGenre() {
    if (this.state.videos.length > 0) {
      let occurrences = Utilities.occurrenceCounter(this.state.videos, "video_genre");
      occurrences.sort(function(a, b) { return b.quantity - a.quantity; });
      let most_popular_genre = occurrences[0].video_genre + ' (' + occurrences[0].quantity + ' videos)';
      this.setState({mp_genre: most_popular_genre});
    }
  }

  calculateMpYear() {
    if (this.state.videos.length > 0) {
      let occurrences = Utilities.occurrenceCounter(this.state.videos, "video_year");
      occurrences.sort(function(a, b) { return b.quantity - a.quantity; });
      let top_ten_bands = "";

      if (occurrences.length >= 10) {
        for (var i = 0; i < 10; i++) {
          top_ten_bands += occurrences[i].video_year + ' (' + occurrences[i].quantity + ' videos) \n';
        }
      } else if (occurrences.length >= 5) {
        for (var i = 0; i < 5; i++) {
          top_ten_bands += occurrences[i].video_year + ' (' + occurrences[i].quantity + ' videos) \n';
        }
      } else if (occurrences.length >= 3) {
        for (var i = 0; i < 3; i++) {
          top_ten_bands += occurrences[i].video_year + ' (' + occurrences[i].quantity + ' videos) \n';
        }
      } else {
        top_ten_bands = occurrences[0].video_year;
      }

      this.setState({mp_year: top_ten_bands});
    }
  }

  calculateMpBand() {
    if (this.state.videos.length > 0) {
      let occurrences = Utilities.occurrenceCounter(this.state.videos, "video_band");
      occurrences.sort(function(a, b) { return b.quantity - a.quantity; });
      let top_ten_bands = "";

      if (occurrences.length >= 10) {
        for (var i = 0; i < 10; i++) {
          top_ten_bands += occurrences[i].video_band + ' (' + occurrences[i].quantity + ' videos) \n';
        }
      } else if (occurrences.length >= 5) {
        for (var i = 0; i < 5; i++) {
          top_ten_bands += occurrences[i].video_band + ' (' + occurrences[i].quantity + ' videos) \n';
        }
      } else if (occurrences.length >= 3) {
        for (var i = 0; i < 3; i++) {
          top_ten_bands += occurrences[i].video_band + ' (' + occurrences[i].quantity + ' videos) \n';
        }
      } else {
        top_ten_bands = occurrences[0].video_band;
      }

      this.setState({mp_band: top_ten_bands});
    }
  }

  displayGenrePieChart() {
    if (this.state.videos.length > 0) {
      let occurrences = Utilities.occurrenceCounter(this.state.videos, "video_genre");
      occurrences.sort(function(a, b) { return b.quantity - a.quantity; });
      let number_of_genres = occurrences.length;
      let pie_chart_data = [];
      for (var i = 0; i < number_of_genres; i++) {
        pie_chart_data.push({ genre_name: occurrences[i].video_genre, genre_quantity: occurrences[i].quantity, genre_percentage: ((occurrences[i].quantity / this.state.total_songs) * 100) })
      }
      
      let canvas = this.refs.genreCanvas;
      let height = this.refs.genreCanvas.height;
      let width = this.refs.genreCanvas.width;

      Utilities.pieChartCreator(height, width, pie_chart_data, canvas);
    }
  }

  render() {
    const { mp_genre, mp_year, mp_band } = this.state;
    return (
      <div>
        <Ui currentLoc={"metrics"} colorData={this.props.colorData}></Ui>
        <hr />
        <h3>Your metrics:</h3>
        <h3>Most popular genre:</h3>
        {mp_genre}
        <h3>Most popular year(s):</h3>
        <div style={this.lineBreak}>{mp_year}</div>
        <h3>Most popular band(s):</h3>
        <div style={this.lineBreak}>{mp_band}</div>
        <h3>Genre Pie Chart:</h3>
        <canvas ref="genreCanvas" width="400" height="400"></canvas>
      </div>
    )
  }
}

export default Metrics;
