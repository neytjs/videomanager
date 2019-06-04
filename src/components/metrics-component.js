/*
The metrics component provides the user an interface for viewing analysis of their videos.db
NeDB database data in a chart form using Chart.js.
*/

import React, {Component} from 'react';
import Ui from './ui-component';
import Utilities from './js/utilities.js'; // importing so we can use our occurrenceCounter and splicer methods for the search feature
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
      history: [],
      mp_genre: "",
      total_songs: 0,
      enough_stars: false,
      enough_five_stars: false,
      enough_history: false,
      backgroundColors: ['#ff6666', '#00cc00', '#4d4dff', '#ffff00', '#a64dff', '#ffa366', '#ff80b3', '#00ffbf', '#88cc00', '#e6004c', '#c2c2a3', '#d2a679', '#ffdb4d', '#ff80ff', '#cccccc', '#00cc44', '#ff531a', '#ff0000'],
      borderColors: ['#ff0000', '#006600', '#0000cc', '#e6e600', '#6600cc', '#ff6600', '#ff0066', '#00b386', '#669900', '#990033', '#999966', '#996633', '#e6b800', '#ff00ff', '#999999', '#009933', '#cc3300', '#b30000'],
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
      this.calculateMpDecade();
      this.calculateMpBand();
      this.calculateMpFiveStars();
      this.calculateMpStars();
      this.displayGenrePieChart();



this.props.history.find({}, function(err, docs) {

  this.setState({history: docs});
  this.calculateGenreLineChart();
}.bind(this));



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
          title: {
  					display: true,
  					text: 'Most popular years:'
          },
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

  calculateMpDecade() {

    if (this.state.videos.length > 0) {
      let occurrences = this.state.videos;
      let tabulated = [
        { label: "1890s", quantity: 0 },
        { label: "1900s", quantity: 0 },
        { label: "1910s", quantity: 0 },
        { label: "1920s", quantity: 0 },
        { label: "1930s", quantity: 0 },
        { label: "1940s", quantity: 0 },
        { label: "1950s", quantity: 0 },
        { label: "1960s", quantity: 0 },
        { label: "1970s", quantity: 0 },
        { label: "1980s", quantity: 0 },
        { label: "1990s", quantity: 0 },
        { label: "2000s", quantity: 0 },
        { label: "2010s", quantity: 0 },
        { label: "2020s", quantity: 0 },
        { label: "2030s", quantity: 0 },
        { label: "2040s", quantity: 0 },
        { label: "2050s", quantity: 0 },
        { label: "2060s", quantity: 0 }
      ];

      for (var i = 0, length = occurrences.length; i < length; i++) {
        if (parseInt(occurrences[i].video_year) >= 2060 && parseInt(occurrences[i].video_year) <= 2069) {
          tabulated[17].quantity = tabulated[17].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 2050 && parseInt(occurrences[i].video_year) <= 2059) {
          tabulated[16].quantity = tabulated[16].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 2040 && parseInt(occurrences[i].video_year) <= 2049) {
          tabulated[15].quantity = tabulated[15].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 2030 && parseInt(occurrences[i].video_year) <= 2039) {
          tabulated[14].quantity = tabulated[14].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 2020 && parseInt(occurrences[i].video_year) <= 2029) {
          tabulated[13].quantity = tabulated[13].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 2010 && parseInt(occurrences[i].video_year) <= 2019) {
          tabulated[12].quantity = tabulated[12].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 2000 && parseInt(occurrences[i].video_year) <= 2009) {
          tabulated[11].quantity = tabulated[11].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1990 && parseInt(occurrences[i].video_year) <= 1999) {
          tabulated[10].quantity = tabulated[10].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1980 && parseInt(occurrences[i].video_year) <= 1989) {
          tabulated[9].quantity = tabulated[9].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1970 && parseInt(occurrences[i].video_year) <= 1979) {
          tabulated[8].quantity = tabulated[8].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1960 && parseInt(occurrences[i].video_year) <= 1969) {
          tabulated[7].quantity = tabulated[7].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1950 && parseInt(occurrences[i].video_year) <= 1959) {
          tabulated[6].quantity = tabulated[6].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1940 && parseInt(occurrences[i].video_year) <= 1949) {
          tabulated[5].quantity = tabulated[5].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1930 && parseInt(occurrences[i].video_year) <= 1939) {
          tabulated[4].quantity = tabulated[4].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1920 && parseInt(occurrences[i].video_year) <= 1929) {
          tabulated[3].quantity = tabulated[3].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1910 && parseInt(occurrences[i].video_year) <= 1919) {
          tabulated[2].quantity = tabulated[2].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1910 && parseInt(occurrences[i].video_year) <= 1919) {
          tabulated[1].quantity = tabulated[1].quantity + 1;
        } else if (parseInt(occurrences[i].video_year) >= 1890 && parseInt(occurrences[i].video_year) <= 1899) {
          tabulated[0].quantity = tabulated[0].quantity + 1;
        }
      }

      tabulated.sort(function(a, b) { return b.quantity - a.quantity; });

      let tabulated_length = tabulated.length;

      let max = 10;

      if (tabulated_length > max) {

        tabulated.splice(max);
      }

      tabulated = tabulated.filter(element => element.quantity > 0);

      let labels = [];
      for (var i = 0, l_length = tabulated.length; i < l_length; i++) {
        labels.push(tabulated[i].label);
      }

      let quantities = [];
      for (var i = 0, q_length = tabulated.length; i < q_length; i++) {
        quantities.push(tabulated[i].quantity);
      }

      var ctx = this.refs.decadesBarChar;

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
          title: {
  					display: true,
  					text: 'Most popular decades:'
          },
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
            title: {
    					display: true,
    					text: 'Most popular band:'
            },
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

  calculateMpFiveStars() {

    if (this.state.videos.length > 10) {
      let occurrences = Utilities.occurrenceCounter(this.state.videos, "video_band", "video_stars");
      var tabulated = [];
      var minimum_quantity = 2;

      for (var i = 0, length = occurrences.length; i < length; i++) {
        var rating = 0;
        for (var j = 0, jlength = occurrences[i].count_property.length; j < jlength; j++) {
          if (occurrences[i].count_property[j] === 5) {
            rating = rating + 1;
          }
        }

        if (rating > 0) {
          tabulated.push({ label: occurrences[i].video_band, rating: rating });
        }
      }

      if (tabulated.length >= minimum_quantity) {
        this.setState({enough_five_stars: true});

        tabulated.sort(function(a, b) { return b.rating - a.rating; });

          let tabulated_length = tabulated.length;

          let max = 10;

          if (tabulated_length > max) {

            tabulated.splice(max);
          }

          let labels = [];
          for (var i = 0, l_length = tabulated.length; i < l_length; i++) {
            labels.push(tabulated[i].label);
          }

          let ratings = [];
          for (var i = 0, q_length = tabulated.length; i < q_length; i++) {
            ratings.push(tabulated[i].rating);
          }

          var ctx = this.refs.fiveStarsBarChar;

          var colors = Utilities.doubleShuffler(this.state.backgroundColors, this.state.borderColors);

          var myLineChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'number of five star videos',
                data: ratings,
                backgroundColor: colors.first_array,
                borderColor: colors.second_array,
                borderWidth: 1
              }]
            },
            options: {
              title: {
      					display: true,
      					text: 'Bands with most five star videos:'
              },
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
  }

  calculateMpStars() {

    if (this.state.videos.length > 10) {
      let occurrences = Utilities.occurrenceCounter(this.state.videos, "video_band", "video_stars");

      var calc_minimum_quantity = occurrences.sort(function(a, b){return b.quantity - a.quantity});
      var top_twenty_percent = Math.round(calc_minimum_quantity.length * 0.2);
      calc_minimum_quantity.splice(top_twenty_percent);
      var minimum_quantity = calc_minimum_quantity[calc_minimum_quantity.length - 1].quantity;
      var tabulated = [];
      for (var i = 0, length = occurrences.length; i < length; i++) {
        var rating = occurrences[i].count_property.reduce(function(total, num){return total + num;}) / occurrences[i].quantity;
        if (occurrences[i].quantity >= minimum_quantity && rating !== 0) {
          tabulated.push({ label: occurrences[i].video_band, rating: rating.toFixed(2) });
        }
      }

      if (tabulated.length >= minimum_quantity) {
        this.setState({enough_stars: true});

        tabulated.sort(function(a, b) { return b.rating - a.rating; });

          let tabulated_length = tabulated.length;

          let max = 10;

          if (tabulated_length > max) {

            tabulated.splice(max);
          }

          let suggestedMin = (tabulated[tabulated.length - 1].rating - 1) > 0 ? Math.floor(tabulated[tabulated.length - 1].rating - 1) : 0;
          let suggestedMax = (tabulated[0].rating + 1) < 5 ? Math.ceil(tabulated[0].rating + 1) : 5;

          let labels = [];
          for (var i = 0, l_length = tabulated.length; i < l_length; i++) {
            labels.push(tabulated[i].label);
          }

          let ratings = [];
          for (var i = 0, q_length = tabulated.length; i < q_length; i++) {
            ratings.push(tabulated[i].rating);
          }

          var ctx = this.refs.ratingsBarChar;

          var colors = Utilities.doubleShuffler(this.state.backgroundColors, this.state.borderColors);

          var myLineChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'average stars rating',
                data: ratings,
                backgroundColor: colors.first_array,
                borderColor: colors.second_array,
                borderWidth: 1
              }]
            },
            options: {
              title: {
      					display: true,
      					text: 'Highest rated bands:'
              },
              scales: {
                yAxes: [{
                  ticks: {
                    suggestedMin: suggestedMin,
                    suggestedMax: suggestedMax,
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
  }

  calculateGenreLineChart() {
    if (this.state.history.length >= 2) {

      this.setState({enough_history: true});

      var x_axis = [];
      var days = [];
      var x_y_data = [];
      var unique_days = [];
      var max_days = 28;

      function getStartDay(ms) {
        var start = new Date(ms);
        return start.setHours(0, 0, 0, 0);
      }

      function getOldestNewest(history) {
        history.sort(function(a, b){ return a.view_date - b.view_date; });
        return [history[0].view_date, history[history.length - 1].view_date];
      }

      var labels = getOldestNewest(this.state.history);

      function countUniqueDays(history) {
        var days = {};
        for (var i = 0, length = history.length; i < length; i++) {
          days[getStartDay(history[i].view_date)] = "";
        }
        for (var day in days) {
          unique_days.push(day);
        }
      }

      countUniqueDays(this.state.history);

      if (unique_days.length > max_days) {

        var newest = labels[1];
        var new_history = [];

        for (var i = 0, length = this.state.history.length; i < length; i++) {
          if (this.state.history[i].view_date >= (newest - (86400000 * max_days))) {
            new_history.push(this.state.history[i]);
          }
        }

        this.setState({history: new_history});

        labels = getOldestNewest(this.state.history);
      }

      function calcX(history) {
        for (var i = 0, length = history.length; i < length; i++) {

          if (x_axis.length === 0) {
            x_axis.push({ video_genre: history[i].video_genre, x: [getStartDay(history[i].view_date)] });
          } else {

            var match = false;
            var j_elm = -1;
            for (var j = 0, jlength = x_axis.length; j < jlength; j++) {

              if (x_axis[j].video_genre === history[i].video_genre) {
                match = true;
                j_elm = j;
              }
            }

            if (match === true) {
              x_axis[j_elm].x.push(getStartDay(history[i].view_date));
            } else {

              x_axis.push({ video_genre: history[i].video_genre, x: [getStartDay(history[i].view_date)] })
            }
          }
        }
      }

      calcX(this.state.history);


      function daysTabulator(x_axis) {
        for (var i = 0, length = x_axis.length; i < length; i++) {
          for (var j = 0, jlength = x_axis[i].x.length; j < jlength; j++) {

            if (days.length === 0) {
              days.push({ day: x_axis[i].x[j], video_genre: x_axis[i].video_genre, tallies: [], day_total: [] });
            } else {

              var match = false;
              var k_elm = -1;
              for (var k = 0, klength = days.length; k < klength; k++) {

                if (days[k].day === x_axis[i].x[j] && days[k].video_genre === x_axis[i].video_genre) {
                  match = true;
                  k_elm = j;
                }
              }

              if (match === false) {

                days.push({ day: x_axis[i].x[j], video_genre: x_axis[i].video_genre, tallies: [], day_total: [] });
              }
            }
          }
        }

        for (var i = 0, length = x_axis.length; i < length; i++) {
          for (var j = 0, jlength = x_axis[i].x.length; j < jlength; j++) {
            for (var k = 0, klength = days.length; k < klength; k++) {

              if (x_axis[i].x[j] === days[k].day) {
                days[k].day_total.push(1);

                if (days[k].video_genre === x_axis[i].video_genre) {
                  days[k].tallies.push(1);
                }
              }
            }
          }
        }

        days.sort(function(a, b){return a.day - b.day});
      }

      daysTabulator(x_axis);


      function creatXY(days) {

        var genres = {};
        var genre_types = [];
        for (var i = 0, length = days.length; i < length; i++) {
          genres[days[i].video_genre] = "";
        }
        for (var genre in genres) {
          genre_types.push({video_genre: genre, data: []});
        }

        for (var i = 0, length = days.length; i < length; i++) {
          for (var j = 0, jlength = genre_types.length; j < jlength; j++) {
            if (days[i].video_genre === genre_types[j].video_genre) {

              genre_types[j].data.push({x: days[i].day, y: ((days[i].tallies.length / days[i].day_total.length) * 100).toFixed(1)});
            }
          }
        }

        return genre_types;
      }

      x_y_data = creatXY(days);

      var ctx = this.refs.genreLineChar;

      var colors = Utilities.doubleShuffler(this.state.backgroundColors, this.state.borderColors);

      function generateChartData() {
        var data = [];
        for (var i = 0, length = x_y_data.length; i < length; i++) {
          data.push({
            label: x_y_data[i].video_genre,
            data: x_y_data[i].data,
            backgroundColor: colors.first_array[i],
            borderColor: colors.second_array[i],
            borderWidth: 3,
            pointBackgroundColor: colors.first_array[i],
            pointBorderColor: colors.second_array[i],
            pointBorderWidth: 1,
            fill: false,
            tension: 0,
            showLine: true
          });
        }
        return data;
      }

      var data = generateChartData();

      var myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: data
        },
        options: {
          scales: {
              xAxes: [{
                  type: 'time'
              }]
          },

          title: {
  					display: true,
  					text: 'Genre viewing over the past ' + max_days + ' days:'
          },
          tooltips: {
            callbacks: {
              title: function(tooltipItem, data) {

                return new Date(tooltipItem[0].label).toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric"});
              },
              label: function(tooltipItem, data) {

                return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.value + '%';
              }
            }
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
            title: {
    					display: true,
    					text: 'Genre Pie Chart:'
            },
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
    const { mp_genre, videos, enough_stars, enough_five_stars, enough_history } = this.state;
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
            <canvas ref="yearsBarChar" style={canvas_styling}></canvas>
            <hr/>
            <canvas ref="decadesBarChar" style={canvas_styling}></canvas>
            <hr/>
            <canvas ref="bandsBarChar" style={canvas_styling}></canvas>
            <hr/>
            { enough_five_stars === true ? <div>
            <canvas ref="fiveStarsBarChar" style={canvas_styling}></canvas><hr/></div> : "" }
            { enough_stars === true ? <div>
            <canvas ref="ratingsBarChar" style={canvas_styling}></canvas><hr/></div> : "" }
            { enough_history === true ? <div>
            <canvas ref="genreLineChar" style={canvas_styling}></canvas>
            <hr/></div> : "" }
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
