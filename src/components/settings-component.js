import React, {Component} from 'react';
import Ui from './ui-component';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editing_type: -1,
      editing_genre: -1,
      type_name: "",
      type_url: "",
      type_width: "",
      type_height: "",
      genre: "",
      video_type: [],
      video_genre: [],
      min_year: ""
    }
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.props.app_data.find({}, function(err, data) {
      this.setState({video_type: data[0].video_type, video_genre: data[0].video_genre, min_year: data[0].min_year});
    }.bind(this));
  }

  updateMinYear() {
    let new_min_year = parseInt(this.state.min_year);
    let current_year = new Date().getFullYear();
    if (new_min_year >= 1860 && new_min_year < current_year) {
      this.props.app_data.update({}, {
        $set: {
          min_year: new_min_year
        }
      }, function(err, doc) {
        this.setState({min_year: new_min_year});
        window.location.reload();
      }.bind(this));
    } else {
      alert("Enter a valid year (e.g. 1999) that is after 1860 (the year of the world's earliest known audio recording) but before the current year.")
    }
  }

  editType(id) {
    this.loadData();
    this.setState({editing_type: id});
  }

  editGenre(id, genre) {
    this.loadData();
    this.setState({editing_genre: id});
  }

  deleteTypeGenre(id, type_genre) {
    let result = confirm("Warning, this will permanently delete this type not allowing it to be used as a type for further video additions. Are you sure that you want to delete it?")
    if (result === true) {
      let state = Object.assign({}, this.state);
      state[type_genre].splice(id, 1);
      this.props.app_data.update({}, {
        $set: state
      }, function(err, doc) {
        this.setState(state);
        window.location.reload();
      }.bind(this));
    }
  }

  addType() {
    let type_name = this.state.type_name;
    let type_url = this.state.type_url;
    let type_width = this.state.type_width;
    let type_height = this.state.type_height;
    if (type_name !== "" && type_url !== "" && type_width !== "" && type_height !== "") {
      type_name = type_name.trim();
      type_url = type_url.trim();
      type_width = parseInt(type_width);
      type_height = parseInt(type_height);
      this.state.video_type.push({label: type_name, url: type_url, width: type_width, height: type_height});
      this.props.app_data.update({}, {
        $set: {
          video_type: this.state.video_type
        }
      }, function(err, doc) {
        this.setState({type_name: "", type_url: "", type_width: "", type_height: ""});
        window.location.reload();
      }.bind(this));
    } else {
      alert("You must complete all four fields.");
    }
  }

  addGenre() {
    let genre = this.state.genre;
    if (genre !== "") {
      genre = genre.trim();
      this.state.video_genre.push(genre);
      this.props.app_data.update({}, {
        $set: {
          video_genre: this.state.video_genre
        }
      }, function(err, doc) {
        this.setState({genre: ""});
        window.location.reload();
      }.bind(this));
    } else {
      alert("You must enter a genre.");
    }
  }

  saveTypeEdit(id) {
    let video_type = this.state.video_type;
    video_type[id].url = video_type[id].label.trim();
    video_type[id].label = video_type[id].label.trim();
    video_type[id].width = parseInt(video_type[id].width);
    video_type[id].height = parseInt(video_type[id].height);
    this.setState({video_type: video_type});
    this.props.app_data.update({}, {
      $set: {
        video_type: this.state.video_type
      }
    }, function(err, doc) {
      this.setState({editing_type: -1});
      window.location.reload();
    }.bind(this));
  }

  saveGenreEdit(id) {
    let video_genre = this.state.video_genre;
    video_genre[id] = video_genre[id].trim();
    this.setState({video_genre: video_genre});
    this.props.app_data.update({}, {
      $set: {
        video_genre: this.state.video_genre
      }
    }, function(err, doc) {
      this.setState({editing_genre: -1});
      window.location.reload();
    }.bind(this));
  }

  cancelEditType() {
    this.loadData();
    this.setState({editing_type: -1});
  }

  cancelEditGenre() {
    this.loadData();
    this.setState({editing_genre: -1});
  }

  displayVideoTypes() {
    return this.state.video_type.map((type, i) => {
      if (type.label !== "") {
        return (
          <div key={type.label + i}>
            { this.state.editing_type == i ?
            <div>
              Edit Video Type: <input value={this.state.video_type[i].label} onChange={this.handle_edit_type_name_Change.bind(this)}/> <br/>
              Edit URL: <input value={this.state.video_type[i].url} onChange={this.handle_edit_url_Change.bind(this)}/> <br/>
              Edit Viewer Width: <input value={this.state.video_type[i].width} onChange={this.handle_edit_width_Change.bind(this)}/> <br/>
              Edit Viewer Height: <input value={this.state.video_type[i].height} onChange={this.handle_edit_height_Change.bind(this)}/> <br/>
              <button onClick={this.saveTypeEdit.bind(this, i)}>Save</button> <button onClick={this.cancelEditType.bind(this)}>Cancel</button> <button onClick={this.deleteTypeGenre.bind(this, i, "video_type")}>Delete</button>
            </div>
            :
            <div>
              Video Type: {type.label} <br/>
              URL: {type.url} <br/>
              Viewer Width: {type.width} <br/>
              Viewer Height: {type.height} <br/>
              <button onClick={this.editType.bind(this, i)}>Edit</button>
            </div>
            }
          </div>
        )
      }
    });
  }

  displayVideoGenres() {
    return this.state.video_genre.map((genre, i) => {
      if (genre !== "") {
        return (
        <div key={genre + i}>
          { this.state.editing_genre == i ?
          <div>
            Edit Genre: <input value={this.state.video_genre[i]} onChange={this.handle_edit_genre_Change.bind(this)}/> <br/>
            <button onClick={this.saveGenreEdit.bind(this, i)}>Save</button> <button onClick={this.cancelEditGenre.bind(this)}>Cancel</button> <button onClick={this.deleteTypeGenre.bind(this, i, "video_genre")}>Delete</button>
          </div>
          :
          <div>
            {genre} <button onClick={this.editGenre.bind(this, i)}>Edit</button>
          </div>
          }
        </div>
        )
      }
    });
  }

  handle_min_year_Change(event) {
    this.setState({min_year: event.target.value});
  }

  handle_edit_genre_Change(event) {
    let state = Object.assign({}, this.state);
    state.video_genre[state.editing_genre] = event.target.value;
    this.setState(state);
  }

  handle_edit_type_name_Change(event) {
    let state = Object.assign({}, this.state);
    state.video_type[state.editing_type].label = event.target.value;
    this.setState(state);
  }

  handle_edit_url_Change(event) {
    let state = Object.assign({}, this.state);
    state.video_type[state.editing_type].url = event.target.value;
    this.setState(state);
  }

  handle_edit_width_Change(event) {
    let state = Object.assign({}, this.state);
    state.video_type[state.editing_type].width = event.target.value;
    this.setState(state);
  }

  handle_edit_height_Change(event) {
    let state = Object.assign({}, this.state);
    state.video_type[state.editing_type].height = event.target.value;
    this.setState(state);
  }

  handle_type_name_Change(event) {
    this.setState({type_name: event.target.value});
  }

  handle_type_url_Change(event) {
    this.setState({type_url: event.target.value});
  }

  handle_type_width_Change(event) {
    this.setState({type_width: event.target.value});
  }

  handle_type_height_Change(event) {
    this.setState({type_height: event.target.value});
  }

  handle_genre_Change(event) {
    this.setState({genre: event.target.value});
  }

  render() {
    return (
      <div>
        <Ui currentLoc={"settings"} colorData={this.props.colorData}></Ui>
        <h3>Settings</h3>
        <hr/>
        <b>Set minimum year:</b>
        <br/>
        <input value={this.state.min_year} onChange={this.handle_min_year_Change.bind(this)}/> <button onClick={this.updateMinYear.bind(this)}>Update</button>
        <hr/>
        <b>Current Video Types:</b>
        <div>{this.displayVideoTypes()}</div>
        <br/>
        <div>
          <b>Add New Video Type:</b>
          <br/>
          Type name: <input value={this.state.type_name} onChange={this.handle_type_name_Change.bind(this)}/>
          <br/>
          Type url: <input value={this.state.type_url} onChange={this.handle_type_url_Change.bind(this)}/>
          <br/>
          Viewer Width: <input value={this.state.type_width} onChange={this.handle_type_width_Change.bind(this)}/>
          <br/>
          Viewer Height: <input value={this.state.type_height} onChange={this.handle_type_height_Change.bind(this)}/>
          <br/>
          <button onClick={this.addType.bind(this)}>Add Type</button>
        </div>
        <hr/>
        <b>Current Video Genres:</b>
        <div>{this.displayVideoGenres()}</div>
        <br/>
        <div>
          <b>Add New Video Genre:</b>
          <br/>
          New genre: <input value={this.state.genre} onChange={this.handle_genre_Change.bind(this)}/>
          <button onClick={this.addGenre.bind(this)}>Add Genre</button>
        </div>
      </div>
    )
  }
}

export default Settings;
