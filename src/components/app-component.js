import React, {Component} from 'react';
const fs = window.require('fs');
import styled from 'styled-components';
import Utilities from './js/utilities.js';
import VideoList from './video-list-component';
import History from './history-component';
import Metrics from './metrics-component';
import Analysis from './analysis-component';
import Settings from './settings-component';
import Help from './help-component';
import AppData from './js/app_data.js';
const defaultAppData = AppData.defaultAppData();
const ipcRenderer = window.require('electron').ipcRenderer;

const remote = window.require('electron').remote;
let app_path = remote.app.getAppPath('');

var DataStore = window.require('nedb');
var app_data_longterm = new DataStore({ filename: app_path+'/data/app_data.db', autoload: true });
var app_data_shortterm = new DataStore();
var history = new DataStore({ filename: app_path+'/data/history.db', autoload: true });
var history_shortterm = new DataStore();

class App extends Component {
  constructor() {
    super();
    this.filepath = "";

    this.videos_longterm = new DataStore({ filename: '', autoload: true });
    this.videos_shortterm = new DataStore();
    this.keyPress = this.keyPress.bind(this);
    this.running = false;
    this.keys = [];

    this.state = {
      colors: {},
      app_data: {},
      all_tags: [],
      css_template: {},
      loaded: false,
      corrupt: false,
      corrupt_file: "",
      view_or_add: "view"
    }
  }


  async componentDidMount() {
    document.addEventListener("keydown", this.keyPress, false);

    let app_data = await this.getAppData();

    let videos_s = await this.getVideos();
    let hist = await this.getHistory();

    this.setState({ app_data: app_data, css_template: app_data.sel_temp_data, loaded: videos_s });

    document.body.style.backgroundColor = this.state.css_template.body_background_color;
    document.body.style.color = this.state.css_template.body_color;

    ipcRenderer.on('new_db', function(event, response) {

      remote.getGlobal('listTracker').list_id = Utilities.generateString();

      this.setState({loaded: false});

      this.videos_shortterm.find({}, function(err, entries) {
        let warning = false;

        if (entries.length > 0 && this.filepath === "") {
          warning = true;
        }

        function createNewFile() {
          this.filepath = "";

          this.videos_longterm = new DataStore({ filename: this.filepath, autoload: true });

          this.videos_shortterm = new DataStore();

          app_data_longterm.update({}, {$set: {filepath: this.filepath}}, function() {
            this.setState({ view_or_add: "view" });
            remote.getGlobal('search').search_hidden = "adding";

            this.getVideos(true);
          }.bind(this));
        }

        let newFile = createNewFile.bind(this);

        if (warning === true) {

          var confirm_delete = confirm("Warning, any unsaved changes will be lost if confirmed.");

          if (confirm_delete === true) {
            newFile();
          } else {
            this.setState({loaded: true});
          }
        } else {
          newFile();
        }
      }.bind(this));
    }.bind(this));
    ipcRenderer.on('save_as_db', function(event, response) {

      this.setState({loaded: false});

      this.filepath = response;

      app_data_longterm.update({}, {$set: {filepath: this.filepath}}, function() {

        this.videos_longterm = new DataStore({ filename: this.filepath, autoload: true });

        this.saveVideos();
      }.bind(this));
    }.bind(this));

    ipcRenderer.on('load_list', function(event, response) {

      this.setState({loaded: false});

      this.videos_shortterm.find({}, function(err, videos) {
        let warning = false;

        if (videos.length > 0 && this.filepath === "") {
          warning = true;
        }

        let loadFile = () => {

          this.filepath = response;

          app_data_longterm.update({}, {$set: {filepath: this.filepath}}, function() {
            this.setState({ view_or_add: "view" });

            this.getVideos(false, true);
          }.bind(this));
        };

        if (warning === true) {

          var confirm_delete = confirm("Warning, any unsaved changes will be lost if confirmed.");

          if (confirm_delete === true) {
            loadFile();
          } else {
            this.setState({loaded: true});
          }
        } else {
          loadFile();
        }
      }.bind(this));
    }.bind(this));
    ipcRenderer.on('view', function(event, response) {
      remote.getGlobal('search').search_hidden = "none";
      remote.getGlobal('search').prev_view = "none";
      this.editTestThenSetState(response);
    }.bind(this));
    ipcRenderer.on('search', function(event, response) {
      remote.getGlobal('search').search_hidden = "searching";
      remote.getGlobal('search').prev_view = "searching";
      this.editTestThenSetState(response);
    }.bind(this));
    ipcRenderer.on('add', function(event, response) {
      remote.getGlobal('search').search_hidden = "adding";
      remote.getGlobal('search').prev_view = "adding";
      this.editTestThenSetState(response);
    }.bind(this));
    ipcRenderer.on('history', function(event, response) {
      remote.getGlobal('search').search_hidden = "none";
      this.editTestThenSetState(response);
    }.bind(this));
    ipcRenderer.on('analysis', function(event, response) {
      remote.getGlobal('search').search_hidden = "none";
      this.editTestThenSetState(response);
    }.bind(this));
    ipcRenderer.on('metrics', function(event, response) {
      remote.getGlobal('search').search_hidden = "none";
      this.editTestThenSetState(response);
    }.bind(this));
    ipcRenderer.on('settings', function(event, response) {
      remote.getGlobal('search').search_hidden = "none";
      this.editTestThenSetState(response);
    }.bind(this));
    ipcRenderer.on('help', function(event, response) {
      remote.getGlobal('search').search_hidden = "none";
      this.editTestThenSetState(response);
    }.bind(this));
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.keyPress, false);
  }

  editTestThenSetState(destination) {
    if (remote.getGlobal('editing').editing_video === true) {

      let confirm_delete = confirm("Warning, any unsaved changes will be lost if confirmed.");

      if (confirm_delete === true) {
        this.setState({ view_or_add: destination });
        this.handleInterfaceClick(destination);
      }
    } else {
      this.setState({ view_or_add: destination });
      this.handleInterfaceClick(destination);
    }
  }

  handleInterfaceClick(destination) {
    if (destination === "view" || destination === "searching" || destination === "adding") {
      window.scrollTo(0, 0);
      remote.getGlobal('interfaceClick').clicked = true;
    } else {
      remote.getGlobal('interfaceClick').clicked = false;
    }
  }



  keyPress(event) {

    if (event.ctrlKey === true && event.keyCode === 65) {
      event.preventDefault();
    }

    let ctrl = event.ctrlKey;
    let key = event.keyCode;

    this.keys.push({ctrl: ctrl, key: key});
    if (this.running === true) {

      return false;
    }

    function innerFunction() {

      this.running = true;

      setTimeout(function() {
        let final_key = "";
        let status = "";

        for (var i = 0, length = this.keys.length; i < length; i++) {

          if (this.keys[i].ctrl === true && this.keys[i].key === 83) {
            status = "searching";
          }
          if (this.keys[i].ctrl === true && this.keys[i].key === 65) {
            status = "adding";
          }
          if (this.keys[i].ctrl === true && this.keys[i].key === 72) {
            status = "history";
          }
          if (this.keys[i].ctrl === true && this.keys[i].key === 78) {
            status = "analysis";
          }
          if (this.keys[i].ctrl === true && this.keys[i].key === 77) {
            status = "metrics";
          }

          if (i === (length - 1)) {
            if (this.keys[i].key === 13) {
              final_key = "enter";
            }

            if (this.keys[i].ctrl === true && this.keys[i].key === 83) {
              final_key = "searching";
            }
            if (this.keys[i].ctrl === true && this.keys[i].key === 65) {
              final_key = "adding";
            }
            if (this.keys[i].ctrl === true && this.keys[i].key === 72) {
              status = "history";
            }
            if (this.keys[i].ctrl === true && this.keys[i].key === 78) {
              status = "analysis";
            }
            if (this.keys[i].ctrl === true && this.keys[i].key === 77) {
              status = "metrics";
            }
          }
        }

        if (final_key !== "enter" && (final_key === "searching" || final_key === "adding"|| final_key === "history"|| final_key === "analysis" || final_key === "metrics")) {
          status = final_key;
        }

        if ((status === "searching" || status === "adding" || status === "history" || status === "analysis" || status === "metrics") && final_key !== "enter") {
          let setView = () => {
            if (remote.getGlobal('search').search_hidden === status) {
              remote.getGlobal('search').search_hidden = "none";
              remote.getGlobal('search').prev_view = "none";
              this.setState({ view_or_add: "view" });
            } else {
              if (status === "analysis" || status === "metrics" || status === "history") {
                remote.getGlobal('search').search_hidden = "none";
                this.setState({ view_or_add: status });
              } else {
                remote.getGlobal('search').search_hidden = status;
                remote.getGlobal('search').prev_view = remote.getGlobal('search').search_hidden;
                this.setState({ view_or_add: "view" });
              }
            }
          }

          if (remote.getGlobal('editing').editing_video === true) {

            let confirm_delete = confirm("Warning, any unsaved changes will be lost if confirmed.");

            if (confirm_delete === true) {
              setView();
              this.handleInterfaceClick(status);
            }
          } else {
            setView();
            this.handleInterfaceClick(status);
          }
        }

        this.keys = [];
        this.running = false;
      }.bind(this), 200);
    }

    let callInner = innerFunction.bind(this);
    callInner();
  }


  getAppData() {
    return new Promise(resolve => {

      app_data_longterm.findOne({}, function(err, dat) {

        if (dat) {
          resolve(dat);
        } else {
          app_data_longterm.insert(defaultAppData, function(err, docs) {

            resolve(docs);
          });
        }
      });
    });
  }

  getHistory() {
    return new Promise(resolve => {

      history.find({}, function(err, dat) {
        history_shortterm.insert(dat, function(err, docs) {
          resolve(true);
        });
      });
    });
  }

  getUpdatedAppData() {
    app_data_longterm.findOne({}, function(err, data) {
      this.setState({ app_data: data, css_template: data.sel_temp_data }, function() {

        document.body.style.backgroundColor = this.state.css_template.body_background_color;
        document.body.style.color = this.state.css_template.body_color;
      });
    }.bind(this));
  }


  getVideos(new_file, open_file) {

    function returnPromise(app_data) {

      return new Promise(resolve => {

        this.videos_longterm.find({}, function(err, videos) {

          let list_id = videos.length > 0 ? videos[0].list_id : Utilities.generateString();

          remote.getGlobal('listTracker').list_id = list_id;

          if (open_file) {
            app_data_shortterm.findOne({}, function(err, app_data_s) {
              let list_ids = app_data_s.list_ids;
              let counter = 0;
              for (var i = 0, length = list_ids.length; i < length; i++) {
                if (list_id === list_ids[i]) {
                  counter = counter + 1;
                }
              }

              if (counter === 0) {
                list_ids.push(list_id);

                app_data_shortterm.update({}, {$set:{list_ids: list_ids}});
                app_data_longterm.update({}, {$set:{list_ids: list_ids}});
              }
            });
          }

          if (Utilities.fileCorruptionCheck(videos) === false) {
            this.videos_shortterm.insert(videos, function(err) {
              app_data_shortterm.findOne({}, function(err, app_data_s) {

                  let all_tags = Utilities.allTags(videos);

                  let result = true;

                  resolve(result);

                  this.setState({loaded: true, all_tags: all_tags, css_template: app_data_s.sel_temp_data}, function() {

                    document.body.style.backgroundColor = this.state.css_template.body_background_color;
                    document.body.style.color = this.state.css_template.body_color;
                  });
              }.bind(this));
            }.bind(this));
          } else {
            this.setState({corrupt: true, corrupt_file: this.filepath});

            this.videos_longterm = new DataStore({ filename: "", autoload: true });
          }
        }.bind(this));
      });
    }

    var theVideos = returnPromise.bind(this);


    if (new_file) {
      theVideos();
    } else {

      app_data_longterm.findOne({}, function(err, app_data) {

        if (app_data) {

          if (app_data.filepath !== "") {

            fs.access(app_data.filepath, fs.F_OK, (err) => {

              if (err) {
                this.filepath = "";
              } else {
                this.filepath = app_data.filepath;

                this.videos_longterm = new DataStore({ filename: this.filepath, autoload: true });

                this.videos_shortterm = new DataStore();

                let path = this.filepath === "" ? "unsaved" : this.filepath;

                ipcRenderer.send('ret_db', path);

                app_data_shortterm.insert(app_data, function(err, app_d_s) {

                  theVideos();
                });
              }
            });
          } else {

            this.videos_longterm = new DataStore({ filename: this.filepath, autoload: true });

            this.videos_shortterm = new DataStore();

            ipcRenderer.send('ret_db', "unsaved");

            app_data_shortterm.insert(app_data, function(err, app_d_s) {

              theVideos();
            });
          }
        } else {
          app_data_longterm.insert(defaultAppData, function(err, app_d_l) {

            app_data_shortterm.insert(app_d_l, function(err, app_d_s) {

              theVideos();
            });
          });
        }
      }.bind(this));
    }
  }

  saveVideos() {
    return new Promise(resolve => {
      app_data_shortterm.findOne({}, function(err, app_data_s) {
        let results = Utilities.matchDetector(app_data_s.list_ids);
        let matches = results.matches;
        let new_list_id = results.new_list_id;

        remote.getGlobal('listTracker').list_id = new_list_id;

        app_data_shortterm.update({}, {$set:{list_ids: matches}});
        app_data_longterm.update({}, {$set:{list_ids: matches}});

        this.videos_shortterm.update({}, {$set: {list_id: new_list_id}}, { multi: true }, function() {

          this.videos_shortterm.find({}, function(err, videos) {

            this.videos_longterm.insert(videos, function(err, docs) {
              let result = true;

              let all_tags = Utilities.allTags(videos);

              this.setState({ loaded: true, all_tags: all_tags });

              resolve(result);
            }.bind(this));
          }.bind(this));
        }.bind(this));
      }.bind(this));
    });
  }

  updateAllTags(all_tags) {
    this.setState({all_tags: all_tags});
  }

  setToView() {
    this.setState({ view_or_add: "view" });
  }


  addToHistory(id) {
    this.videos_shortterm.findOne({_id: id}, function(err, video) {

      var hist = {
        video_title: video.video_title,
        video_code: video.video_code,
        video_band: video.video_band,
        video_genre: video.video_genre,
        video_id: id,
        view_date: Date.now(),
        list_id: remote.getGlobal('listTracker').list_id
      };

      remote.getGlobal('history_viewer').video = hist;

      history.insert(hist, function(err, doc) {
      });
      history_shortterm.insert(hist, function(err, doc) {
      });
    });
  }


  setRoutes() {
    const { view_or_add } = this.state;

    if (this.state.loaded === false) {
      return (
        <div>Loading...</div>
      )
    } else if (this.state.loaded === true) {
      return (
        <div>
          {
            view_or_add === "view" ? <VideoList videos={this.videos_longterm} addToHistory={this.addToHistory.bind(this)} videos_shortterm={this.videos_shortterm} history={history} history_shortterm={history_shortterm} appData={this.state.app_data} all_tags={this.state.all_tags} updateAllTags={this.updateAllTags.bind(this)} cssTemplate={this.state.css_template} addToHistory={this.addToHistory.bind(this)}></VideoList>
            : view_or_add === "history" ? <History history={history} history_shortterm={history_shortterm} perPage={this.state.app_data.per_page} setToView={this.setToView.bind(this)} addToHistory={this.addToHistory.bind(this)}></History>
            : view_or_add === "analysis" ? <Analysis videos_shortterm={this.videos_shortterm} appData={this.state.app_data} cssTemplate={this.state.css_template} all_tags={this.state.all_tags}></Analysis>
            : view_or_add === "metrics" ? <Metrics videos_shortterm={this.videos_shortterm} history={history_shortterm}></Metrics>
            : view_or_add === "settings" ? <Settings app_data={app_data_longterm} app_data_shortterm={app_data_shortterm} appData={this.state.app_data} getUpdatedAppData={this.getUpdatedAppData.bind(this)}></Settings>
            : view_or_add === "help" ? <Help></Help>
            : ""
          }
        </div>
      )
    }
  }

  render() {
    const { css_template, corrupt, corrupt_file, loaded } = this.state;
    const Wrapper = styled.div`
      button {
        border-radius: 5px;
        font-size: 15px;
        background-color: ${css_template.button_background_color};
        color: ${css_template.button_color};
        border: ${css_template.button_border};
        margin: 5px 5px;
        padding: 0 15px;
        line-height: 1.45;
        width: auto;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
      }

      button:hover {
        background-color: ${css_template.button_hover_background_color};
        color: ${css_template.button_hover_color};
        border: ${css_template.button_hover_border};
      }

      button:active {
        background-color: ${css_template.button_active_background_color};
        color: ${css_template.button_active_color};
        border: ${css_template.button_active_border};
      }

      input {
        border: ${css_template.button_border};
        border-radius: 3px;
        background: ${css_template.body_background_color};
        padding: 3px;
      }

      input:hover {
        background: ${css_template.entry_background}
      }

      select {
      	border: ${css_template.button_border};
      	border-radius: 3px;
      	background-color: ${css_template.body_background_color};
      	padding: 3px;
      }

      select:hover {
      	border: ${css_template.button_border};
      	background-color: ${css_template.entry_background};
      	cursor: pointer;
      }

      table {
        font-family: Arial, Helvetica, sans-serif;
        width: 100%;
        border-collapse: collapse;
      }

      td, th {
        font-size: 1.2em;
        border: ${css_template.theader_border};
        padding: 3px 7px 2px 7px;
        color: ${css_template.body_color};
      }

      th {
        font-size: 1.4em;
        text-align: left;
        padding-top: 5px;
        padding-bottom: 4px;
        background-color: ${css_template.theader_background};
      }

      td {
        background-color: ${css_template.entry_background};
      }

      hr {
        border: ${css_template.hr_color};
      }

      a {
        text-decoration: underline;
        font-size: 18;
        color: ${css_template.a_color};
      }

      a:link {
        text-decoration: yes;
      }

      a:visited {
        text-decoration: underline;
        color: ${css_template.a_visited_color};
        font-weight: normal;
      }

      a:hover {
        color: ${css_template.a_hover_color};
        text-decoration: underline;
        cursor: pointer;
      }

      .ui {
        padding: 3px;
        border: ${css_template.theader_border};
        background: ${css_template.theader_background};
        border-radius: 5px;
        margin-bottom: 5px;
      }

      .help {
        padding: 3px;
        border: ${css_template.theader_border};
        background: ${css_template.entry_background};
        width: 80%;
        border-radius: 5px;
        margin-bottom: 5px;
      }

      .stars {
        color: ${css_template.a_color};
        font-size: 1.4em;
      }

      .rate-stars {
        color: ${css_template.a_color};
        font-size: 1.4em;
        cursor: pointer;
      }

      .float_right {
        float: right;
      }
    `;
    return (
      <Wrapper>
        <div>
          { corrupt === true && corrupt_file === this.filepath ? <div><b>ERROR:</b> File corrupt or invalid file type. Can not load data. Try loading another file or creating a new file.</div> :
            <div>
              { loaded === false ? <div>Loading...</div> :
                <div>
                  <div>
                    { this.filepath === "" ? <p><b>WARNING:</b> This is an unsaved project. Remember to save your work or it will be lost.</p> : "" }
                  </div>
                  {this.setRoutes()}
                </div>
              }
            </div>
          }
        </div>
      </Wrapper>
    )
  }
}

export default App;
