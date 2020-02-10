import React, {Component} from 'react';
import Utilities from './js/utilities.js';
import Chart from 'chart.js';
const remote = window.require('electron').remote;

class Metrics extends Component {
  constructor() {
    super();
    this.genreBarChar = React.createRef();
    this.yearsBarChar = React.createRef();
    this.decadesBarChar = React.createRef();
    this.bandsBarChar = React.createRef();
    this.fiveStarsBarChar = React.createRef();
    this.rankingsBarChar = React.createRef();
    this.genreLineChar = React.createRef();
    this.genrePieChar = React.createRef();
    this.genreCanvas = React.createRef();
    this.tagsBarChar = React.createRef();
    this.mpg = React.createRef();
    this.mpy = React.createRef();
    this.mpd = React.createRef();
    this.mpb = React.createRef();
    this.bmwfsv = React.createRef();
    this.hrb = React.createRef();
    this.mct = React.createRef();
    this.gvotpd = React.createRef();
    this.gpc = React.createRef();
    this.max_days = 28;
    this.labels = {
      mpg: "Most popular genres:",
      mpy: "Most popular years:",
      mpd: "Most popular decades:",
      mpb: "Most popular bands:",
      bmwfsv: "Bands with most five star videos:",
      hrb: "Highest ranked bands:",
      mct: "Most common tags:",
      gvotpd: "Genre viewing over the past " + this.max_days + " days:",
      gpc: "Genre pie chart:"
    }

    this.state = {
      videos: [],
      history: [],
      mp_genre: "",
      total_songs: 0,
      enough_stars: false,
      enough_five_stars: false,
      enough_history: false,
      enough_tags: false,
      backgroundColors: ['#ff6666', '#00cc00', '#4d4dff', '#ffff00', '#a64dff', '#ffa366', '#ff80b3', '#00ffbf', '#88cc00', '#e6004c', '#c2c2a3', '#d2a679', '#ffdb4d', '#ff80ff', '#cccccc', '#4dff88', '#ff531a', '#ff0000'],
      borderColors: ['#ff0000', '#006600', '#0000cc', '#e6e600', '#6600cc', '#ff6600', '#ff0066', '#00b386', '#669900', '#990033', '#999966', '#996633', '#e6b800', '#ff00ff', '#999999', '#00cc44', '#cc3300', '#b30000'],
      loaded: false
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
      this.topTags();
      this.displayGenrePieChart();

      this.props.history.find({list_id: remote.getGlobal('listTracker').list_id}, function(err, docs) {
        this.setState({history: docs});
        this.calculateGenreLineChart();

        this.setState({loaded: true});
      }.bind(this));
    }.bind(this));
  }

  calculateMpGenre() {

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
        quantities.push(occurrences[i].quantity);
      }


      var ctx = this.genreBarChar;


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
            borderWidth: 1,
            barPercentage: 0.5,
            barThickness: 'flex',
            maxBarThickness: 25,
            minBarLength: 2,
            gridLines: {
              offsetGridLines: true
            }
          }]
        },
        options: {
          title: {
  					display: true,
  					text: this.labels.mpg
          },
          scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(label, index, labels) {

                         if (Math.floor(label) === label) {
                             return label;
                         }

                  }
                }
              }]
          }
        }
      });
    }
  }

  calculateMpYear() {

    if (this.state.videos.length > 0) {
      let occurrences = Utilities.occurrenceCounter(this.state.videos, "video_year");


      occurrences.sort(function(a, b) { return b.quantity - a.quantity; });

      let occurrences_length = occurrences.length;

      let max = 15;

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


      var ctx = this.yearsBarChar;


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
            borderWidth: 1,
            barPercentage: 0.5,
            barThickness: 'flex',
            maxBarThickness: 25,
            minBarLength: 2,
            gridLines: {
              offsetGridLines: true
            }
          }]
        },
        options: {
          title: {
  					display: true,
  					text: this.labels.mpy
          },
          scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(label, index, labels) {

                         if (Math.floor(label) === label) {
                             return label;
                         }

                  }
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


      var ctx = this.decadesBarChar;


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
            borderWidth: 1,
            barPercentage: 0.5,
            barThickness: 'flex',
            maxBarThickness: 25,
            minBarLength: 2,
            gridLines: {
              offsetGridLines: true
            }
          }]
        },
        options: {
          title: {
  					display: true,
  					text: this.labels.mpd
          },
          scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(label, index, labels) {

                         if (Math.floor(label) === label) {
                             return label;
                         }

                  }
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

        let max = 15;

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


        var ctx = this.bandsBarChar;


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
              borderWidth: 1,
              barPercentage: 0.5,
              barThickness: 'flex',
              maxBarThickness: 25,
              minBarLength: 2,
              gridLines: {
                offsetGridLines: true
              }
            }]
          },
          options: {
            title: {
    					display: true,
    					text: this.labels.mpb
            },
            scales: {
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    callback: function(label, index, labels) {

                           if (Math.floor(label) === label) {
                               return label;
                           }

                    }
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

          let max = 15;

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


          var ctx = this.fiveStarsBarChar;


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
                borderWidth: 1,
                barPercentage: 0.5,
                barThickness: 'flex',
                maxBarThickness: 25,
                minBarLength: 2,
                gridLines: {
                  offsetGridLines: true
                }
              }]
            },
            options: {
              title: {
      					display: true,
      					text: this.labels.bmwfsv
              },
              scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      callback: function(label, index, labels) {

                             if (Math.floor(label) === label) {
                                 return label;
                             }

                      }
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
      var tabulated = [];
      var minimum_quantity = 2;

      for (var i = 0, length = occurrences.length; i < length; i++) {
        var ranking = 0;
        for (var j = 0, jlength = occurrences[i].count_property.length; j < jlength; j++) {
          let reducer = (a, b) => a + b;
          ranking = occurrences[i].count_property.reduce(reducer);
        }

        if (ranking > 0) {
          tabulated.push({ label: occurrences[i].video_band, ranking: ranking });
        }
      }

      if (tabulated.length >= minimum_quantity) {
        this.setState({enough_stars: true});

        tabulated.sort(function(a, b) { return b.ranking - a.ranking; });

          let tabulated_length = tabulated.length;

          let max = 15;

          if (tabulated_length > max) {

            tabulated.splice(max);
          }


          let labels = [];
          for (var i = 0, l_length = tabulated.length; i < l_length; i++) {
            labels.push(tabulated[i].label);
          }


          let ratings = [];
          for (var i = 0, q_length = tabulated.length; i < q_length; i++) {
            ratings.push(tabulated[i].ranking);
          }


          var ctx = this.rankingsBarChar;


          var colors = Utilities.doubleShuffler(this.state.backgroundColors, this.state.borderColors);

          var myLineChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: 'cumulative stars ranking',
                data: ratings,
                backgroundColor: colors.first_array,
                borderColor: colors.second_array,
                borderWidth: 1,
                barPercentage: 0.5,
                barThickness: 'flex',
                maxBarThickness: 25,
                minBarLength: 2,
                gridLines: {
                  offsetGridLines: true
                }
              }]
            },
            options: {
              title: {
      					display: true,
      					text: this.labels.hrb
              },
              scales: {
                  yAxes: [{
                    ticks: {
                      beginAtZero: true,
                      callback: function(label, index, labels) {

                         if (Math.floor(label) === label) {
                             return label;
                         }

                      }
                    }
                  }]
              }
            }
          });
      }
    }
  }


  topTags() {

    let tags = [];

    for (var i = 0, vid_length = this.state.videos.length; i < vid_length; i++) {
      for (var j = 0, tags_length = this.state.videos[i].video_tags.length; j < tags_length; j++) {
        tags.push({tag: this.state.videos[i].video_tags[j]});
      }
    }

    let results = Utilities.occurrenceCounter(tags, "tag");

    let results_length = (results) ? results.length : 0;
    let minimum_quantity = 2;
    if (results_length >= minimum_quantity) {
      this.setState({enough_tags: true});

      results.sort(function(a, b) { return b.quantity - a.quantity; });

      let max = 15;

      if (results_length > max) {

        results.splice(max);
      }

      let labels = [];
      for (var i = 0, l_length = results.length; i < l_length; i++) {
        labels.push(results[i].tag);
      }


      let quantities = [];
      for (var i = 0, q_length = results.length; i < q_length; i++) {
        quantities.push(results[i].quantity);
      }


      var ctx = this.tagsBarChar;

      var barChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'number of tags',
            data: quantities,
            backgroundColor: this.state.backgroundColors,
            borderColor: this.state.borderColors,
            borderWidth: 1,
            barPercentage: 0.5,
            barThickness: 'flex',
            maxBarThickness: 25,
            minBarLength: 2,
            gridLines: {
              offsetGridLines: true
            }
          }]
        },
        options: {
          title: {
  					display: true,
  					text: this.labels.mct
          },
          scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(label, index, labels) {

                         if (Math.floor(label) === label) {
                             return label;
                         }

                  }
                }
              }]
          }
        }
      });
    }
  }

  calculateGenreLineChart() {
    if (this.state.history.length >= 2) {

      this.setState({enough_history: true});

      var x_axis = [];
      var days = [];
      var x_y_data = [];
      var unique_days = [];
      var max_days = this.max_days;

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


      var ctx = this.genreLineChar;


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
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
          },

          title: {
  					display: true,
  					text: this.labels.gvotpd
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


        var ctx = this.genrePieChar;


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
    					text: this.labels.gpc
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

  scrollingTo(ref) {
    if (ref === "top") {
      window.scrollTo(0, 0);
    } else {
      let offset = this[ref].current.getBoundingClientRect();
      window.scrollTo(0, offset.top);
    }
  }

  createMenu() {
    return Object.keys(this.labels).map((label) => {
      if (this[label].current) {
        return (
          <li key={label}><a onClick={() => this.scrollingTo(label)}>{this.labels[label].replace(/:/ig, "")}</a></li>
        )
      }
    })
  }

  render() {
    const { videos, enough_stars, enough_five_stars, enough_history, enough_tags, loaded } = this.state;
    return (
      <div>
        { videos.length > 0 ?
        <div>
          <div>
            <div>
              <h3>Metrics:</h3>
              { loaded === true ? <ul>{this.createMenu()}</ul> : ""}
            </div>
            <div className="ui" ref={this.mpg}>
              <canvas ref={genreBarChar => this.genreBarChar = genreBarChar} height="25% !important" width="70% !important"></canvas>
            </div>
            <div className="ui" ref={this.mpy}>
              <canvas ref={yearsBarChar => this.yearsBarChar = yearsBarChar} height="25% !important" width="70% !important"></canvas>
            </div>
            <div className="ui" ref={this.mpd}>
              <canvas ref={decadesBarChar => this.decadesBarChar = decadesBarChar} height="25% !important" width="70% !important"></canvas>
            </div>
            <div className="ui" ref={this.mpb}>
              <canvas ref={bandsBarChar => this.bandsBarChar = bandsBarChar} height="25% !important" width="70% !important"></canvas>
            </div>
            { enough_five_stars === true ? <div className="ui" ref={this.bmwfsv}>
            <canvas ref={fiveStarsBarChar => this.fiveStarsBarChar = fiveStarsBarChar} height="25% !important" width="70% !important"></canvas></div> : "" }
            { enough_stars === true ? <div className="ui" ref={this.hrb}>
            <canvas ref={rankingsBarChar => this.rankingsBarChar = rankingsBarChar} height="25% !important" width="70% !important"></canvas></div> : "" }
            { enough_tags === true ? <div className="ui" ref={this.mct}>
              <canvas ref={tagsBarChar => this.tagsBarChar = tagsBarChar} height="25% !important" width="70% !important"></canvas>
            </div> : "" }
            { enough_history === true ? <div className="ui" ref={this.gvotpd}>
            <canvas ref={genreLineChar => this.genreLineChar = genreLineChar} height="25% !important" width="70% !important"></canvas>
            </div> : "" }
            <div className="ui" ref={this.gpc}>
              <canvas ref={genrePieChar => this.genrePieChar = genrePieChar} height="25% !important" width="70% !important"></canvas>
            </div>
          </div>
          <button onClick={() => this.scrollingTo("top")}>Top</button>
        </div>
        : <div>
            { loaded === true ? <h3>Add videos to view your metrics.</h3> : "" }
          </div> }
      </div>
    )
  }
}

export default Metrics;
