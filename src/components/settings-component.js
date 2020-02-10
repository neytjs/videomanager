import React, {Component} from 'react';
import cloneDeep from 'lodash.clonedeep';

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
      edit_genre_temp: [],
      edit_type_temp: [],
      video_type: this.props.appData.video_type,
      video_genre: this.props.appData.video_genre,
      min_year: this.props.appData.min_year,
      per_page: this.props.appData.per_page,
      per_page_viewall: this.props.appData.per_page_viewall,
      selected_template: this.props.appData.selected_template,
      sel_temp_data: this.props.appData.sel_temp_data,
      templates: this.props.appData.templates
    }
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

        this.props.getUpdatedAppData();

        this.setState({min_year: new_min_year});

        alert("Update saved.");
      }.bind(this));
    } else {
      alert("Enter a valid year (e.g. 1999) that is at least 1860 (the year of the world's earliest known audio recording) but before the current year.")
    }
  }

  editType(id) {

    this.setState({editing_type: id, edit_type_temp: cloneDeep(this.state.video_type)});
  }

  editGenre(id) {

    this.setState({editing_genre: id, edit_genre_temp: cloneDeep(this.state.video_genre)});
  }

  deleteTypeGenre(id, type_genre) {
    let result = confirm("Warning, this will permanently delete this type not allowing it to be used as a type for further video additions. Are you sure that you want to delete it?")
    if (result === true) {

      let state = Object.assign({}, this.state);

      state[type_genre].splice(id, 1);

      this.props.app_data.update({}, {
        $set: state
      }, function(err, doc) {

        this.props.getUpdatedAppData();

        this.setState(state);
      }.bind(this));
    }
  }

  addType() {
    let type_name = this.state.type_name;
    let type_url = this.state.type_url;
    let type_width = this.state.type_width;
    let type_height = this.state.type_height;

    if (type_name !== "" && type_url !== "" && isNaN(parseInt(type_width)) === false && isNaN(parseInt(type_height)) === false) {

      type_name = type_name.trim();
      type_url = type_url.trim();
      type_width = parseInt(type_width);
      type_height = parseInt(type_height);

      let counter = 0;
      for (var i = 0, length = this.state.video_type.length; i < length; i++) {
        if (type_name.toLowerCase() === this.state.video_type[i].label.toLowerCase()) {
          counter = counter + 1;
        }
      }

      if (counter === 0) {

        this.state.video_type.push({label: type_name, url: type_url, width: type_width, height: type_height});

        this.props.app_data.update({}, {
          $set: {
            video_type: this.state.video_type
          }
        }, function(err, doc) {

          this.props.getUpdatedAppData();

          this.setState({type_name: "", type_url: "", type_width: "", type_height: ""});
        }.bind(this));
      } else {
        alert("You already have " + type_name + " as a video type.");
      }
    } else {
      alert("You must complete all four fields. Height and width must be numbers.");
    }
  }

  addGenre() {
    let genre = this.state.genre;

    if (genre !== "") {

      genre = genre.trim();

      let counter = 0;
      for (var i = 0, length = this.state.video_genre.length; i < length; i++) {
        if (genre.toLowerCase() === this.state.video_genre[i].toLowerCase()) {
          counter = counter + 1;
        }
      }

      if (counter === 0) {

        this.state.video_genre.push(genre);

        this.props.app_data.update({}, {
          $set: {
            video_genre: this.state.video_genre
          }
        }, function(err, doc) {

          this.props.getUpdatedAppData();

          this.setState({genre: ""});
        }.bind(this));
      } else {
        alert("You already have " + genre + " as a genre.");
      }
    } else {
      alert("You must enter a genre.");
    }
  }

  saveTypeEdit(id) {
    let video_type = this.state.video_type;
    if (video_type[id].label !== "" && video_type[id].url !== "" && isNaN(parseInt(video_type[id].width)) === false && isNaN(parseInt(video_type[id].height)) === false) {

      video_type[id].url = video_type[id].url.trim();
      video_type[id].label = video_type[id].label.trim();
      video_type[id].width = parseInt(video_type[id].width);
      video_type[id].height = parseInt(video_type[id].height);

      this.setState({video_type: video_type});

      this.props.app_data.update({}, {
        $set: {
          video_type: this.state.video_type
        }
      }, function(err, doc) {

        this.props.getUpdatedAppData();

        this.setState({editing_type: -1});
      }.bind(this));
    } else {
      alert("You must complete all four fields. Height and width must be numbers.");
    }
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

      this.props.getUpdatedAppData();

      this.setState({editing_genre: -1});
    }.bind(this));
  }

  saveTemplate() {
    this.props.app_data.update({}, {$set: {selected_template: this.state.selected_template, sel_temp_data: this.state.sel_temp_data}}, function() {

      this.props.getUpdatedAppData();
    }.bind(this));
  }

  cancelEditType() {

    this.setState({video_type: this.state.edit_type_temp, editing_type: -1});
  }

  cancelEditGenre() {

    this.setState({video_genre: this.state.edit_genre_temp, editing_genre: -1});
  }

  updatePerPageVideos() {
    let new_per_page_viewall = parseInt(this.state.per_page_viewall);
    if (new_per_page_viewall >= 10) {

      this.props.app_data.update({}, {$set: {per_page_viewall: new_per_page_viewall}}, function(err, doc) {

        this.props.getUpdatedAppData();

        this.setState({per_page_viewall: new_per_page_viewall});

        alert("Update saved.");
      }.bind(this));
    } else {
      alert("You must display at least 10 videos per page.");
    }
  }

  updatePerPage() {
    let new_per_page = parseInt(this.state.per_page);
    if (new_per_page >= 10) {

      this.props.app_data.update({}, {
        $set: {
          per_page: new_per_page
        }
      }, function(err, doc) {

        this.props.getUpdatedAppData();

        this.setState({per_page: new_per_page});

        alert("Update saved.");
      }.bind(this));
    } else {
      alert("You must display at least 10 history views per page.")
    }
  }

  displayVideoTypes() {
    return this.state.video_type.map((type, i) => {
      if (type.label !== "") {
        return (
          <div key={"type" + i}>
            { this.state.editing_type == i ?
            <div>
              <b>Edit Video Type:</b> <input defaultValue={type.label} onBlur={this.handle_edit_type_name_Change.bind(this)}/> <br/>
              <b>Edit URL:</b> <input defaultValue={type.url} onBlur={this.handle_edit_url_Change.bind(this)}/> <br/>
              <b>Edit Viewer Width:</b> <input defaultValue={type.width} onBlur={this.handle_edit_width_Change.bind(this)} size="3"/> <br/>
              <b>Edit Viewer Height:</b> <input defaultValue={type.height} onBlur={this.handle_edit_height_Change.bind(this)} size="3"/> <br/>
              <button onClick={this.saveTypeEdit.bind(this, i)}>Save</button> <button onClick={this.cancelEditType.bind(this)}>Cancel</button> <button onClick={this.deleteTypeGenre.bind(this, i, "video_type")}>Delete</button>
            </div>
            :
            <div>
              <b>Video Type:</b> {type.label} <br/>
              <b>URL:</b> {type.url} <br/>
              <b>Viewer Width:</b> {type.width} <br/>
              <b>Viewer Height:</b> {type.height} <br/>
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
        <div key={"genre" + i}>
          { this.state.editing_genre == i ?
          <div>
            <b>Edit Genre:</b> <input defaultValue={genre} onBlur={this.handle_edit_genre_Change.bind(this)}/> <br/>
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

  handle_selected_template_Change(event) {
    let sel_temp_data = {};
    for (var i = 0, length = this.state.templates.length; i < length; i++) {
      if (this.state.templates[i].template_name === event.target.value) {
        sel_temp_data = this.state.templates[i].css_props;
      }
    }
    this.setState({selected_template: event.target.value, sel_temp_data: sel_temp_data});
  }

  handle_per_page_Change(event) {
    this.setState({per_page: event.target.value});
  }

  handle_per_page_viewall_Change(event) {
    this.setState({per_page_viewall: event.target.value});
  }


  genSelectTempOpts() {
    let templates = [];
    for (var i = 0, length = this.state.templates.length; i < length; i++) {
      templates.push(this.state.templates[i].template_name);
    }

    return templates.map((template, i) => {
      return (
        <option key={template + i} value={template}>{template}</option>
      )
    });
  }

  scrollTop() {
    window.scrollTo(0, 0);
  }

  render() {
    const { min_year, type_name, type_url, type_width, type_height, genre, selected_template, per_page, per_page_viewall } = this.state;
    return (
      <div>
        <div>
          <h3>Settings:</h3>
        </div>
        <div className="ui">
          <h3>Set minimum year:</h3>
          <input defaultValue={min_year} onBlur={this.handle_min_year_Change.bind(this)} size="2"/> <button onClick={this.updateMinYear.bind(this)}>Update</button>
        </div>
        <div className="ui">
          <h3>Current Video Types:</h3>
          <div>{this.displayVideoTypes()}</div>
          <div>
            <h3>Add New Video Type:</h3>
            <b>Type name:</b> <input defaultValue={type_name} onBlur={this.handle_type_name_Change.bind(this)}/>
            <br/>
            <b>Type url:</b> <input defaultValue={type_url} onBlur={this.handle_type_url_Change.bind(this)}/>
            <br/>
            <b>Viewer Width:</b> <input defaultValue={type_width} onBlur={this.handle_type_width_Change.bind(this)} size="3"/>
            <br/>
            <b>Viewer Height:</b> <input defaultValue={type_height} onBlur={this.handle_type_height_Change.bind(this)} size="3"/>
            <br/>
            <button onClick={this.addType.bind(this)}>Add Type</button>
          </div>
        </div>
        <div className="ui">
          <h3>Current Video Genres:</h3>
          <div>{this.displayVideoGenres()}</div>
          <br/>
          <div>
            <h3>Add New Video Genre:</h3>
            <b>New genre:</b> <input defaultValue={genre} onBlur={this.handle_genre_Change.bind(this)}/>
            <button onClick={this.addGenre.bind(this)}>Add Genre</button>
          </div>
        </div>
        <div className="ui">
          <h3>Select color theme:</h3>
          <select onChange={this.handle_selected_template_Change.bind(this)} value={selected_template}>
            {this.genSelectTempOpts()}
          </select> <button onClick={this.saveTemplate.bind(this)}>Change Template</button>
        </div>
        <div className="ui">
          <h3>Set the amount of videos per page:</h3>
          <input defaultValue={per_page_viewall} onBlur={this.handle_per_page_viewall_Change.bind(this)} size="2"/> <button onClick={this.updatePerPageVideos.bind(this)}>Update</button>
        </div>
        <div className="ui">
          <h3>Set the amount of history views per page:</h3>
          <input defaultValue={per_page} onBlur={this.handle_per_page_Change.bind(this)} size="2"/> <button onClick={this.updatePerPage.bind(this)}>Update</button>
        </div>
        <button onClick={this.scrollTop}>Top</button>
      </div>
    )
  }
}

export default Settings;
