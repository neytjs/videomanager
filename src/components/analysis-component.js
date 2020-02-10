import React, {Component} from 'react';
import Select from 'react-select';
import Utilities from './js/utilities.js';
import Chart from 'chart.js';
import SelectYear from './select-year-component';
const remote = window.require('electron').remote;

class Analysis extends Component {
  constructor(props) {
    super(props);
    this.min_default = this.props.appData.min_year;
    this.pressEnter = this.pressEnter.bind(this);
    this.analysisLineChar = React.createRef();

    this.state = {
      backgroundColors: ['#ff6666', '#00cc00', '#4d4dff', '#ffff00', '#a64dff', '#ffa366', '#ff80b3', '#00ffbf', '#88cc00', '#e6004c', '#c2c2a3', '#d2a679', '#ffdb4d', '#ff80ff', '#cccccc', '#4dff88', '#ff531a', '#ff0000'],
      borderColors: ['#ff0000', '#006600', '#0000cc', '#e6e600', '#6600cc', '#ff6600', '#ff0066', '#00b386', '#669900', '#990033', '#999966', '#996633', '#e6b800', '#ff00ff', '#999999', '#00cc44', '#cc3300', '#b30000'],
      videos: [],
      year_start: remote.getGlobal('analysis').year_start,
      year_end: remote.getGlobal('analysis').year_end,
      genre: remote.getGlobal('analysis').genre,
      tag: remote.getGlobal('analysis').tag,
      analysis_type: remote.getGlobal('analysis').analysis_type,
      starsChecked: remote.getGlobal('analysis').starsChecked,
      videosChecked: remote.getGlobal('analysis').videosChecked
    }
  }


  componentDidMount() {

    document.addEventListener("keydown", this.pressEnter, false);

    this.props.videos_shortterm.find({}, function(err, videos) {
      this.setState({videos: videos}, function() {

        if (remote.getGlobal('analysis').analyzed === true) {
          this.conductAnalysis();
        }
      });
    }.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.pressEnter, false);
  }

  pressEnter(event) {
    if (event.keyCode === 13) {
      this.conductAnalysis();
    }
  }

  conductAnalysis() {

    remote.getGlobal('analysis').analyzed = true;
    let state = Object.assign({}, this.state);
    let analysis_type = state.analysis_type;
    let start = parseInt(state.year_start);
    let end = parseInt(state.year_end);
    if (analysis_type !== "") {
      if (start > 0 && end > 0) {
        let test_start = start;
        let test_end = end;
        if (test_end < test_start) {
          start = test_end;
          end = test_start;
        }

        if (state.videos.length > 1) {
          let label_all = "all";


          let search_genre = [];
          if (state.genre !== null) {
            for (var i = 0, length = state.genre.length; i < length; i++) {
              search_genre.push(state.genre[i].value);
            }
          }
          let search_tags = [];
          if (state.tag !== null) {
            for (var i = 0, length = state.tag.length; i < length; i++) {
              search_tags.push(state.tag[i].value);
            }
          }


          let unit_averages = [];
          let averages_length = search_genre.length + search_tags.length;
          if (averages_length > 0) {
            for (var i = 0, length = search_genre.length; i < length; i++) {
              unit_averages.push({ label: search_genre[i], data: [], type: "genre" });
            }
            for (var i = 0, length = search_tags.length; i < length; i++) {
              unit_averages.push({ label: search_tags[i], data: [], type: "tag" });
            }
            for (var i = 0, length = unit_averages.length; i < length; i++) {
              for (var start_year = start, end_year = end; start_year <= end_year; start_year++) {
                unit_averages[i].data.push({ year: start_year, ratings: [] });
              }
            }
          } else {
            unit_averages.push({ label: label_all, data: [] });
            for (var start_year = start, end_year = end; start_year <= end_year; start_year++) {
              unit_averages[0].data.push({ year: start_year, ratings: [] });
            }
          }



          let tag_genre_matches = 0;
          let genre_searching = false;
          for (var i = 0, length = unit_averages.length; i < length; i++) {
            for (var j = 0, jlength = state.videos.length; j < jlength; j++) {
              if (unit_averages.length > 0 && unit_averages[0].label !== label_all) {
                genre_searching = true;
                for (var k = 0, klength = unit_averages[i].data.length; k < klength; k++) {
                  if (unit_averages[i].data[k].year === parseInt(state.videos[j].video_year) && unit_averages[i].label.toLowerCase() === state.videos[j].video_genre.toLowerCase() && unit_averages[i].type === "genre") {
                    if (analysis_type === "stars") {
                      unit_averages[i].data[k].ratings.push(parseInt(state.videos[j].video_stars));
                    }
                    if (analysis_type === "videos") {
                      unit_averages[i].data[k].ratings.push(1);
                    }
                    tag_genre_matches = tag_genre_matches + 1;
                  }

                  for (var l = 0, llength = state.videos[j].video_tags.length; l < llength; l++) {
                    if (unit_averages[i].data[k].year === parseInt(state.videos[j].video_year) && unit_averages[i].label.toLowerCase() === state.videos[j].video_tags[l].toLowerCase() && unit_averages[i].type === "tag") {
                      if (analysis_type === "stars") {
                        unit_averages[i].data[k].ratings.push(parseInt(state.videos[j].video_stars));
                      }
                      if (analysis_type === "videos") {
                        unit_averages[i].data[k].ratings.push(1);
                      }
                      tag_genre_matches = tag_genre_matches + 1;
                    }
                  }
                }
              } else {
                for (var k = 0, klength = unit_averages[i].data.length; k < klength; k++) {
                  if (unit_averages[i].data[k].year === parseInt(state.videos[j].video_year)) {
                    if (analysis_type === "stars") {
                      unit_averages[i].data[k].ratings.push(parseInt(state.videos[j].video_stars));
                    }
                    if (analysis_type === "videos") {
                      unit_averages[i].data[k].ratings.push(1);
                    }
                  }
                }
              }
            }
          }


          function creatXY(unit_averages) {
            let units = [];

            for (var i = 0, length = unit_averages.length; i < length; i++) {
              units.push({ label: unit_averages[i].label, data: [] });
            }

            for (var i = 0, length = unit_averages.length; i < length; i++) {
              for (var j = 0, jlength = unit_averages[i].data.length; j < jlength; j++) {
                for (var k = 0, klength = units.length; k < klength; k++) {

                  if (unit_averages[i].label === units[k].label) {

                    if (unit_averages[i].data[j].ratings.length > 0) {
                      units[k].data.push({ x: unit_averages[i].data[j].year, y: ((unit_averages[i].data[j].ratings.reduce((a, b) => a + b, 0))), year: unit_averages[i].data[j].year });
                    }
                  }
                }
              }
            }


            return units;
          }


          let x_y_data = creatXY(unit_averages);


          var colors = Utilities.doubleShuffler(this.state.backgroundColors, this.state.borderColors);


          function generateChartData() {
            var data = [];
            for (var i = 0, length = x_y_data.length; i < length; i++) {
              data.push({
                label: x_y_data[i].label,
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

          function genChartTitle() {
            let title = analysis_type === "stars" ? "Cumulative star rankings for videos" : "Total videos";
            let comma = false;

            if (averages_length > 0) {
              comma = true;
              let search_genre_length = search_genre.length;
              let search_tags_length = search_tags.length;

              if (search_genre_length > 0) {
                let genre = "";
                if (search_genre_length === 1) {
                  genre = search_genre[0];
                } else {
                  genre += "[";
                  for (var i = 0, length = search_genre_length; i < length; i++) {
                    if (i !== (length - 1)) {
                      genre += search_genre[i] + ", ";
                    } else {
                      genre += search_genre[i];
                    }
                  }
                  genre += "]";
                }
                title += " with the genre" + (search_genre_length === 1 ? " \"" + genre + "\"" : "s " + genre);
              }

              if (search_genre_length > 0 && search_tags_length > 0) {
                title += " and";
              }

              if (search_tags_length > 0) {
                let tag = "";
                if (search_tags_length === 1) {
                  tag = search_tags[0];
                } else {
                  tag += "[";
                  for (var i = 0, length = search_tags_length; i < length; i++) {
                    if (i !== (length - 1)) {
                      tag += search_tags[i] + ", ";
                    } else {
                      tag += search_tags[i];
                    }
                  }
                  tag += "]";
                }
                title += " tagged " + (search_tags_length === 1 ? "\"" + tag + "\"" : tag);
              }
            }

            title += (comma === true ? "," : "") + " between " + start + " and " + end + ".";

            return title;
          }


        let labels = [];
        for (var start_year = start, end_year = end; start_year <= end_year; start_year++) {
          labels.push(start_year);
        }



          var ctx = this.analysisLineChar;

          if (window.myLineChart && window.myLineChart !== null) {
            window.myLineChart.destroy();
          }


          let points = 0;
          for (var i = 0, length = x_y_data.length; i < length; i++) {
            points = points + x_y_data[i].data.length;
          }


          if ((genre_searching === true && tag_genre_matches > 0) || genre_searching === false) {

            if (points > 0) {
              window.myLineChart = new Chart(ctx, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: data
                },
                options: {
                  scales: {
                    xAxes: [{
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 40
                        }
                    }],
                    yAxes: [{
                      ticks: {
                        precision: 0,
                        beginAtZero: true
                      }
                    }],
                    responsive: false,
                    maintainAspectRatio: false
                  },
                  title: {
                    display: true,
                    text: genChartTitle()
                  },
                  tooltips: {
                    callbacks: {
                      title: function(tooltipItem, data) {
                        return x_y_data[tooltipItem[0].datasetIndex].data[tooltipItem[0].index].year;
                      },
                      label: function(tooltipItem, data) {

                        return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.value;
                      }
                    }
                  }
                }
              });

              window.scrollTo(0, document.body.scrollHeight);
            } else {
              alert("No videos were found during this time period. Try expanding your search.");
            }
          } else {
            alert("No matching video genres found to analyze. Try removing the video genres that you entered or enter a different video genres.");
          }
        } else {
          alert("You must enter at least two videos to begin conducting analysis.");
        }
      } else {
        alert("You must select a start and end year.");
      }
    } else {
      alert("Select whether to analyze video data by cumulative stars rankings or total videos.");
    }
  }

  handle_year_start_Change(event) {
    this.setState({ year_start: event.target.value }, function() {
      remote.getGlobal('analysis').year_start = this.state.year_start;
    });
  }

  handle_year_end_Change(event) {
    this.setState({ year_end: event.target.value }, function() {
      remote.getGlobal('analysis').year_end = this.state.year_end;
    });
  }

  handleAnalysisTypeChange(event) {
    this.setState({
      analysis_type: event.target.value,
      starsChecked: (event.target.value === "stars" ? true : false),
      videosChecked: (event.target.value === "videos" ? true : false)
    }, function() {
      remote.getGlobal('analysis').analysis_type = this.state.analysis_type;
      remote.getGlobal('analysis').starsChecked = this.state.starsChecked;
      remote.getGlobal('analysis').videosChecked = this.state.videosChecked;
    });
  }

  resetForm() {

    this.setState({year_start: 0, year_end: 0, genre: null, tag: null, analysis_type: "", starsChecked: false, videosChecked: false});

    remote.getGlobal('analysis').year_start = 0;
    remote.getGlobal('analysis').year_end = 0;
    remote.getGlobal('analysis').genre = null;
    remote.getGlobal('analysis').tag = null;
    remote.getGlobal('analysis').analyzed = false;
    remote.getGlobal('analysis').analysis_type = "";
    remote.getGlobal('analysis').starsChecked = false;
    remote.getGlobal('analysis').videosChecked = false;

    if (window.myLineChart) {
      window.myLineChart.destroy();
    }
  }

  render() {
    const { year, genre, tag, starsChecked, videosChecked } = this.state;

    return (
      <div>
        <h3>Analysis:</h3>
        <div className="ui">
          <div>
            Cumulative star rankings: <input type="radio" value="stars" onChange={this.handleAnalysisTypeChange.bind(this)} checked={starsChecked} name="analysis_type"/> Total videos: <input type="radio" value="videos" onChange={this.handleAnalysisTypeChange.bind(this)} checked={videosChecked} name="analysis_type"/>
          </div>
          <br/>
          <div>
            Select a year range:{ ' ' }
            <SelectYear insertFunction={this.handle_year_start_Change.bind(this)} insertValue={this.state.year_start} minimumYear={this.min_default} minOrMax="maxtomin" appData={this.props.appData}></SelectYear> to{ ' ' }
            <SelectYear insertFunction={this.handle_year_end_Change.bind(this)} insertValue={this.state.year_end} minimumYear={this.min_default} minOrMax="maxtomin" appData={this.props.appData}></SelectYear>
          </div>
          <br/>
          <Select
            styles={Utilities.reactSelectStyles(this.props.cssTemplate)}
            value={genre}
            onChange={value => this.setState({ genre: value }, function() {
              remote.getGlobal('analysis').genre = value;
            })}
            options={Utilities.createTagOptions(this.props.appData.video_genre)}
            closeMenuOnSelect={false}
            placeholder="Select a genre (or genres)..."
            isMulti
          />
          <br/>
          <Select
            styles={Utilities.reactSelectStyles(this.props.cssTemplate)}
            value={tag}
            onChange={value => this.setState({ tag: value }, function() {
              remote.getGlobal('analysis').tag = value;
            })}
            options={Utilities.createTagOptions(this.props.all_tags)}
            closeMenuOnSelect={false}
            placeholder="Select a tag (or tags)..."
            isMulti
          />
          <br/>
          <button className="button" onClick={this.conductAnalysis.bind(this)}>Generate Chart</button> <button onClick={this.resetForm.bind(this)}>Reset</button>
        </div>
        <canvas ref={analysisLineChar => this.analysisLineChar = analysisLineChar} height="175" width="400"></canvas>
      </div>
    )
  }
}

export default Analysis;
