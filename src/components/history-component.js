import React, {Component} from 'react';
import Table from './table-component';
const {getGlobal} = window.require('@electron/remote');

class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [],
      total: 0,
      counter: 0,
      page: 1,
      per_page: this.props.perPage,
      start: 0
    }
  }


  async componentDidMount() {
    let loading = await this.viewAll();
    this.setState({ loading: loading });
  }

  viewAll(page) {
    return new Promise(resolve => {

      this.props.history_shortterm.find({list_id: getGlobal('listTracker').list_id}, function(err, docs) {

        docs = docs.sort(function(a, b) {

            if (b.view_date > a.view_date) {
              return 1;
            }
            if (a.view_date > b.view_date) {
              return -1;
            }

            return 0;
        });

        let amount = docs.length;
        let counter = docs.length;
        let paginate_data = {};
        if (page) {

          paginate_data = this.paginateHistory(docs, page);
          this.setState({page: page});
        } else {
          paginate_data = this.paginateHistory(docs);
        }

        this.setState({
          history: paginate_data.viewable_history,
          start: paginate_data.start,
          amount: paginate_data.viewable_history.length,
          counter: counter
        });

        resolve(false);
      }.bind(this));
    });
  }


  clearHistory() {

    var confirm_clear = confirm("Do you really want to clear your entire history?");

    if (confirm_clear === true) {
      this.props.history.find({list_id: getGlobal('listTracker').list_id}, function(err, docs) {

        for (var i = 0, hist_length = docs.length; i < hist_length; i++) {

          this.props.history.remove({ _id: docs[i]._id }, {}, function (err, numRemoved) {

            this.setState({history: [], amount: 0, counter: 0, start: 0, page: 1});
          }.bind(this));
        }
      }.bind(this));
      this.props.history_shortterm.find({list_id: getGlobal('listTracker').list_id}, function(err, docs) {

        for (var i = 0, hist_length = docs.length; i < hist_length; i++) {

          this.props.history_shortterm.remove({ _id: docs[i]._id }, {}, function (err, numRemoved) {

            this.setState({history: [], amount: 0, counter: 0, start: 0, page: 1});
          }.bind(this));
        }
      }.bind(this));
    }
  }


  deleteView(view_id) {

    this.props.history.remove({ _id: view_id }, {}, function (err, numRemoved) {
      this.props.history_shortterm.remove({ _id: view_id }, {}, function (err, numRemoved) {

        this.viewAll(this.state.page);
      }.bind(this));
    }.bind(this));
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  createPageNumbers() {
    const { counter, page, per_page, history } = this.state;
    let history_length = history.length;
    let pages = [];
    for (var i = 1, length = Math.ceil(counter / per_page); i <= length; i++) {
      pages.push(i);
    }
    let pages_length = pages.length;
    let pagination = [];

    if ((history_length >= per_page && page === 1) || (counter > per_page && page > 1)) {

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
          { pg.style === "default" ? <a onClick={this.viewAll.bind(this, pg.page)}>{ pg.status === "normal" ? pg.page : pg.status }</a>
            : <b>{ pg.page }</b> }
          {' '}
          { pg.status === "First" ? "... " : "" }
        </span>
      )
    });
  }

  paginateHistory(history, page) {


    if (isNaN(page) === true)  {
      page = this.state.page;
    }

    let per_page = this.state.per_page;

    let start = (page > 1) ? (page * per_page) - per_page : 0;

    let viewable_history = [];
    for (var i = 0, length = history.length; i < length; i++) {
      if (i < (start + per_page) && i >= start) {
        viewable_history.push(history[i]);
      }
    }

    return { viewable_history: viewable_history, start: start }
  }

  render() {
    const { amount, start, per_page, counter } = this.state;
    return (
      <div>
        <div className="ui">
          <h3>Your viewing history:</h3>
          <button onClick={this.clearHistory.bind(this)}>Clear History</button>
        </div>
        <b>{ counter.toLocaleString('en-US', {minimumFractionDigits: 0}) } views{counter > 0 ? <span> (viewing {start + 1} - {start + per_page < counter ? start + per_page : counter}):</span> : ":"}</b> { ' ' }
        <br/>
        { this.createPageNumbers() }
        <Table history={this.state.history} addToHistory={this.props.addToHistory} setToView={this.props.setToView} deleteView={this.deleteView.bind(this)} table={"history"}></Table>
        { this.createPageNumbers() }
        <br/>
        { amount > 15 ? <button onClick={this.scrollTop}>Top</button> : "" }
      </div>
    )
  }
}

export default History;
