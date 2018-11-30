import React, {Component} from 'react';
import Ui from './ui-component';
import Table from './table-component';
const remote = window.require('electron').remote;

class History extends Component {
  constructor() {
    super();
    this.viewAll = this.viewAll.bind(this);
    this.clearHistory = this.clearHistory.bind(this);
    this.addToHistory = this.addToHistory.bind(this);

    this.state = {
      history: [],
      counter: 0
    }
  }

    componentDidMount() {
      this.viewAll();
    }

    viewAll() {
      this.props.history.find({}, function(err, docs) {
        this.setState({history: docs.sort(function(a, b) {
            if (b.view_date > a.view_date) {
              return 1;
            }
            if (a.view_date > b.view_date) {
              return -1;
            }
            return 0;
        })});
        this.setState({counter: this.state.history.length});
      }.bind(this));
    }

    // method for clearing history
      clearHistory() {
        var confirm_clear = confirm("Do you really want to clear your history?");
        if (confirm_clear === true) {
          for (var i = 0, hist_length = this.state.history.length; i < hist_length; i++) {
            this.props.history.remove({ _id: this.state.history[i]._id }, {}, function (err, numRemoved) {
            });
          }
          this.setState({history: [], counter: 0});
        }
      }

// adds a new entry to their history for every video they click on
  addToHistory(code, title, band, genre, year, lyrics, type, tags, stars, id) {
      var history = {
        video_code: code,
        video_title: title,
        video_band: band,
        video_genre: genre,
        video_year: year,
        video_lyrics: lyrics,
        video_type: type,
        view_date: Date.now(),
        video_tags: tags,
        video_stars: stars,
        video_id: id
      };
      this.props.history.insert(history, function(err, doc) {
      });
  }

  render() {
    const { counter } = this.state;
    return (
      <div>
        <Ui currentLoc={"history"}></Ui>
        <hr />
        <h3>Your viewing history:</h3>
        <button onClick={this.clearHistory}>Clear History</button>
        <br />
        <b>{counter} views:</b>
        <Table history={this.state.history} colorData={this.props.colorData} addToHistory={this.addToHistory.bind(this)} table={"history"}></Table>
      </div>
    )
  }
}

export default History;
