/*
The ui subcomponent provides the user with a menu bar to navigate the application.
*/


import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import SearchVideos from './search-video-component';
const remote = window.require('electron').remote;
const app = remote.app;

class Ui extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search_hidden: props.search_hidden
    }
  }


  componentWillReceiveProps(nextProps) {

    if (nextProps.search_hidden !== this.state.search_hidden) {
      this.setState({ search_hidden: nextProps.search_hidden});
    }
  }


  quitApp() {
    app.quit();
  }

  displayUi() {
    if (this.props.currentLoc === "main") {
      return (
        <div>
          <a onClick={this.props.showHideSearch}>Search</a> <b><u>View Videos</u></b> <Link to="/add">Add Video</Link> <Link to="/history">View History</Link> <Link to="/metrics">Metrics</Link> <Link to="/settings">Settings</Link> <Link to="/colors">Edit Colors</Link> <a onClick={() => this.quitApp()}>Quit</a>
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
            <SearchVideos searchVideos={this.props.searchVideos} showHideSearch={this.props.showHideSearch} appData={this.props.appData}></SearchVideos>
          </div>
          : ""
        }
      </div>
    )
  }
}

export default Ui;
