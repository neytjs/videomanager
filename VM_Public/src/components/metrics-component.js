import React, {Component} from 'react';
import Ui from './ui-component';
import Utilities from './js/utilities.js';
import Chart from 'chart.js';

class Metrics extends Component {
  constructor() {
    super();
    this.loadVideosAndMetrics = this.loadVideosAndMetrics.bind(this);
    this.calculateMpGenre = this.calculateMpGenre.bind(this);
    this.calculateMpYear = this.calculateMpYear.bind(this);
    this.calculateMpBand = this.calculateMpBand.bind(this);
    this.displayGenrePieChart = this.displayGenrePieChart.bind(this);

    this.state = {
      videos: [],
      mp_genre: "",
      total_songs: 0,
      backgroundColors: ['#ff6666', '#00cc00', '#4d4dff', '#ffff00', '#a64dff', '#ffa366', '#ff80b3', '#00ffbf', '#88cc00', '#e6004c'],
      borderColors: ['#ff0000', '#006600', '#0000cc', '#e6e600', '#6600cc', '#ff6600', '#ff0066', '#00b386', '#669900', '#990033'],
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

      let most_popular_genre = occurrences[0].video_genre + ' (' + occurrences[0].quantity.toLocaleString('en-US', {minimumFractionDigits: 0}) + ' videos)';

      this.setState({mp_genre: most_popular_genre});
    }
  }

  calculateMpYear() {

    if (this.state.videos.length > 0) {
      let occurrences = Utilities.occurrenceCounter(this.state.videos, "video_year");

      occurrences.sort(function(a, b) { return b.quantity - a.quantity; });

      let occurrences_length = occurrences.length;

      let max = 10;

      if (occurrences_length > max) {

        occurrences.splice(max);
      }

      let labels = [];
      for (var i = 0, l_length = occurrences.length; i < l_length; i++) {
        labels.push(occurrences[i].video_year);
      }

      let quantities = [];
      for (var i = 0, q_length = occurrences.length; i < q_length; i++) {
        quantities.push(occurrences[i].quantity);
      }

      var ctx = this.refs.yearsBarChar;

      var colors = Utilities.doubleShuffler(this.state.backgroundColors, this.state.borderColors);

      var myLineChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'number of videos',
            data: quantities,
            backgroundColor: colors.first_array,
            borderColor: colors.second_array,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true,
                userCallback: function(label, index, labels) {

                       if (Math.floor(label) === label) {
                           return label;
                       }

                }
              }
            }],
            xAxes: [{
              barPercentage: 0.5,
              barThickness: 'flex',
              maxBarThickness: 25,
              minBarLength: 2,
              gridLines: {
                offsetGridLines: true
              }
            }]
          }
        }
      });
    }
  }

  calculateMpBand() {

    if (this.state.videos.length > 0) {
      let occurrences = Utilities.occurrenceCounter(this.state.videos, "video_band");

      occurrences.sort(function(a, b) { return b.quantity - a.quantity; });

        let occurrences_length = occurrences.length;

        let max = 10;

        if (occurrences_length > max) {

          occurrences.splice(max);
        }

        let labels = [];
        for (var i = 0, l_length = occurrences.length; i < l_length; i++) {
          labels.push(occurrences[i].video_band);
        }

        let quantities = [];
        for (var i = 0, q_length = occurrences.length; i < q_length; i++) {
          quantities.push(occurrences[i].quantity);
        }

        var ctx = this.refs.bandsBarChar;

        var colors = Utilities.doubleShuffler(this.state.backgroundColors, this.state.borderColors);

        var myLineChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              label: 'number of videos',
              data: quantities,
              backgroundColor: colors.first_array,
              borderColor: colors.second_array,
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  userCallback: function(label, index, labels) {

                         if (Math.floor(label) === label) {
                             return label;
                         }

                  }
                }
              }],
              xAxes: [{
                barPercentage: 0.5,
                barThickness: 'flex',
                maxBarThickness: 25,
                minBarLength: 2,
                gridLines: {
                  offsetGridLines: true
                }
              }]
            }
          }
        });
    }
  }

  displayGenrePieChart() {

    if (this.state.videos.length > 0) {
      let occurrences = Utilities.occurrenceCounter(this.state.videos, "video_genre");

      occurrences.sort(function(a, b) { return b.quantity - a.quantity; });

        let occurrences_length = occurrences.length;

        let max = 10;

        if (occurrences_length > max) {

          occurrences.splice(max);
        }

        let labels = [];
        for (var i = 0, l_length = occurrences.length; i < l_length; i++) {
          labels.push(occurrences[i].video_genre);
        }

        let quantities = [];
        for (var i = 0, q_length = occurrences.length; i < q_length; i++) {
          quantities.push((occurrences[i].quantity / this.state.total_songs) * 100);
        }

        var ctx = this.refs.genrePieChar;

        var colors = Utilities.doubleShuffler(this.state.backgroundColors, this.state.borderColors);

        var myLineChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: labels,
            datasets: [{
              label: 'number of tags',
              data: quantities,
              backgroundColor: colors.first_array,
              borderColor: colors.second_array,
              borderWidth: 1
            }]
          },
          options: {
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                  return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']].toFixed(1) + '%';
                }
              }
            }
          }
        });

    }
  }

  render() {
    let canvas_styling = {
      height: '25vh',
      width: '50vw'
    };
    let charts_container = {
      float: 'left'
    };
    const { mp_genre, videos } = this.state;
    return (
      <div>
        <Ui currentLoc={"metrics"} colorData={this.props.colorData}></Ui>
        <hr />
        { videos.length > 0 ?
        <div>
          <h3>Your metrics:</h3>
          <hr/>
          <div style={charts_container}>
            <h3>Most popular genre:</h3>
            {mp_genre}
            <hr/>
            <h3>Most popular year(s):</h3>
            <canvas ref="yearsBarChar" style={canvas_styling}></canvas>
            <hr/>
            <h3>Most popular bands(s):</h3>
            <canvas ref="bandsBarChar" style={canvas_styling}></canvas>
            <hr/>
            <h3>Genre Pie Chart:</h3>
            <canvas ref="genrePieChar" style={canvas_styling}></canvas>
            <canvas ref="genreCanvas" width="400" height="400"></canvas>
          </div>
        </div>
        : <div><h3>Add videos to view your metrics.</h3></div> }
      </div>
    )
  }
}

export default Metrics;