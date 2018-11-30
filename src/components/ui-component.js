import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import SearchVideos from './search-video-component';
const remote = window.require('electron').remote;
const app = remote.app;

class Ui extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search_hidden: false
    }
  }

  showHideSearch() {
    if (this.state.search_hidden === true) {
      this.setState({ search_hidden: false });
    } else {
      this.setState({ search_hidden: true });
    }
  }

  leavingMainVideoList() {
    remote.getGlobal('history_viewer').video = {};
  }

  quitApp() {
    app.quit();
  }

  displayUi() {
    if (this.props.currentLoc === "main") {
      return (
        <div>
          <a onClick={this.showHideSearch.bind(this)}>Search</a> <b><u>View Videos</u></b> <Link to="/add" onClick={this.leavingMainVideoList}>Add Video</Link> <Link to="/history" onClick={this.leavingMainVideoList}>View History</Link> <Link to="/metrics">Metrics</Link> <Link to="/settings">Settings</Link> <Link to="/colors" onClick={this.leavingMainVideoList}>Edit Colors</Link> <a onClick={() => this.quitApp()}>Quit</a>
        </div>
      )
    } else if (this.props.currentLoc === "history") {
      return (
        <div>
          <Link to="/">View Videos</Link> <Link to="/add">Add Video</Link> <b><u>View History</u></b> <Link to="/metrics">Metrics</Link> <Link to="/settings">Settings</Link> <Link to="/colors">Edit Colors</Link> <a onClick={() => this.quitApp()}>Quit</a>
        </div>
      )
    }  else if (this.props.currentLoc === "metrics") {
      return (
        <div>
          <Link to="/">View Videos</Link> <Link to="/add">Add Video</Link> <Link to="/history">View History</Link> <b><u>Metrics</u></b> <Link to="/settings">Settings</Link> <Link to="/colors">Edit Colors</Link> <a onClick={() => this.quitApp()}>Quit</a>
        </div>
      )
    } else if (this.props.currentLoc === "add") {
      return (
        <div>
          <Link to="/">View Videos</Link> <b><u>Add Video</u></b>  <Link to="/history">View History</Link> <Link to="/metrics">Metrics</Link> <Link to="/settings">Settings</Link> <Link to="/colors">Edit Colors</Link> <a onClick={() => this.quitApp()}>Quit</a>
        </div>
      )
    } else if (this.props.currentLoc === "settings") {
      return (
        <div>
          <Link to="/">View Videos</Link> <Link to="/add">Add Video</Link>  <Link to="/history">View History</Link> <Link to="/metrics">Metrics</Link> <b><u>Settings</u></b> <Link to="/colors">Edit Colors</Link> <a onClick={() => this.quitApp()}>Quit</a>
        </div>
      )
    } else if (this.props.currentLoc === "colors") {
      return (
        <div>
          <Link to="/">View Videos</Link> <Link to="/add">Add Video</Link>  <Link to="/history">View History</Link> <Link to="/metrics">Metrics</Link> <Link to="/settings">Settings</Link> <b><u>Edit Colors</u></b> <a onClick={() => this.quitApp()}>Quit</a>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="ui">
          {this.displayUi()}
        </div>
        {
          this.state.search_hidden === true ?
          <div className="ui">
            <SearchVideos searchVideos={this.props.searchVideos} showHideSearch={this.showHideSearch.bind(this)} appData={this.props.appData}></SearchVideos>
          </div>
          : ""
        }
      </div>
    )
  }
}

export default Ui;
