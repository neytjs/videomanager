import React, {Component} from 'react';
import {Router, Route, Switch, Link} from 'react-router-dom';
import styled from 'styled-components';
import VideoList from './video-list-component';
import AddVideo from './add-video-component';
import EditColors from './edit-colors-component';
import History from './history-component';
import Metrics from './metrics-component';
import Settings from './settings-component';
import ColorData from './js/color_data.js';
import AppData from './js/app_data.js';
const color_storage = ColorData.color_storage();
const defaultAppData = AppData.defaultAppData();
import { createHashHistory } from 'history';
const hashHistory = createHashHistory();

const remote = window.require('electron').remote;
let app_path = remote.app.getAppPath('');

var DataStore = window.require('nedb');
var videos = new DataStore({ filename: app_path+'/videos.db', autoload: true });
var videos_shortterm = new DataStore();
var app_data = new DataStore({ filename: app_path+'/app_data.db', autoload: true });
var history = new DataStore({ filename: app_path+'/history.db', autoload: true });
var colors = new DataStore({ filename: app_path+'/colors.db', autoload: true });

class App extends Component {
  constructor() {
    super();
    this.getColors = this.getColors.bind(this);

      this.state = {
        colors: {},
        app_data: {},
        loaded: false,
        videos_loaded: false
      }
  }

  getAppData() {
    return new Promise(resolve => {
      app_data.findOne({}, function(err, dat) {
        if (dat) {
          resolve(dat);
        } else {
          app_data.insert(defaultAppData, function(err, docs) {
            resolve(docs);
          });
        }
      });
    });
  }

  getColors() {
    return new Promise(resolve => {
      colors.findOne({}, function(err, cols) {
        if (cols) {
          resolve(cols);
        } else {
          colors.insert(color_storage, function(err, docs) {
            resolve(docs);
          });
        }
      });
    });
  }

  getVideos() {
    return new Promise(resolve => {
      videos.find({}, function(err, entries) {
        videos_shortterm.insert(entries, function(err, docs) {
          let result = true;
          resolve(result);
        });
      });
    });
  }

  async componentDidMount() {
    let colors = await this.getColors();
    let app_data = await this.getAppData();
    let videos_s = await this.getVideos();
    this.setState({ colors: colors, app_data: app_data, videos_loaded: videos_s });
    this.setState({ loaded: true });
    document.body.style.backgroundColor = this.state.colors.body_background_color;
  }

  setRoutes() {
    if (this.state.loaded === false) {
      const loadingApp = () => <div>Loading...</div>
      return (
        <Switch>
          <Route exact path="/" component={loadingApp} />
        </Switch>
      )
    } else if (this.state.loaded === true) {
      const videoList = () => <VideoList videos={videos} videos_shortterm={videos_shortterm} history={history} colorData={this.state.colors} appData={this.state.app_data}></VideoList>
      const addVid = () => <AddVideo videos={videos} videos_shortterm={videos_shortterm} colorData={this.state.colors} appData={this.state.app_data}></AddVideo>
      const histList = () => <History history={history} colorData={this.state.colors}></History>
      const viewMets = () => <Metrics videos_shortterm={videos_shortterm} history={history} colorData={this.state.colors}></Metrics>
      const viewSettings = () => <Settings app_data={app_data} appData={this.state.app_data} colorData={this.state.colors}></Settings>
      const editCols = () => <EditColors colors={colors} colorData={this.state.colors}></EditColors>
      return (
        <Switch>
          <Route exact path="/" component={videoList} />
          <Route path="/add" component={addVid} />
          <Route path="/history" component={histList} />
          <Route path="/metrics" component={viewMets} />
          <Route path="/settings" component={viewSettings} />
          <Route path="/colors" component={editCols} />
        </Switch>
      )
    }
  }

  render() {
    const { colors } = this.state;
    const Wrapper = styled.div`
      button {
        border-radius: ${colors.button_borderradius};
        font-size: ${colors.button_fontsize};
        background-color: ${colors.button_backgroundcolor};
        color: ${colors.button_color};
        border: ${colors.button_border};
        margin: ${colors.button_margin};
        padding: ${colors.button_padding};
        line-height: ${colors.button_lineheight};
        width: ${colors.button_width};
        cursor: ${colors.button_cursor};
        box-shadow: ${colors.button_boxshadow};
      }

      button:hover {
        background-color: ${colors.button_hover_backgroundcolor};
        color: ${colors.button_hover_color};
        border: ${colors.button_hover_border};
      }

      button:active {
        background-color: ${colors.button_active_backgroundcolor};
        color: ${colors.button_active_color};
        border: ${colors.button_active_border};
      }

      input {
        border: ${colors.input_border};
        border-radius: ${colors.input_borderradius};
        background: ${colors.input_backgroundcolor};
        padding: ${colors.input_padding};
      }

      input:hover {
        background: ${colors.input_hover_backgroundcolor}
      }

      table {
        font-family: ${colors.table_fontfamily};
        width: ${colors.table_width};
        border-collapse: ${colors.table_bordercollapse};
      }

      td, th {
        font-size: ${colors.table_td_th_fontsize};
        border: ${colors.table_td_th_border};
        padding: ${colors.table_td_th_padding};
      }

      th {
        font-size: ${colors.table_th_fontsize};
        text-align: ${colors.table_th_textalign};
        padding-top: ${colors.table_th_paddingtop};
        padding-bottom: ${colors.table_th_paddingbottom};
        background-color: ${colors.table_th_backgroundcolor};
        color: ${colors.table_th_color};
      }

      td {
        background-color: ${colors.table_td_color};
      }

      a {
        text-decoration: ${colors.div_a_textdecoration};
        font-size: ${colors.div_a_size};
        color: ${colors.div_a_color};
      }

      a:link {
        text-decoration: ${colors.div_alink_textdecoration};
      }

      a:visited {
        text-decoration: ${colors.div_avisited_textdecoration};
        color: ${colors.div_avisited_color};
        font-weight: ${colors.div_avisited_fontweight};
      }

      a:hover {
        color: ${colors.div_ahover_color};
        test-decoration: ${colors.div_ahover_testdecoration};
        cursor: ${colors.div_ahover_cursor};
      }

      .ui {
        padding: ${colors.ui_padding};
        border: ${colors.ui_border};
        background: ${colors.ui_background};
        border-radius: ${colors.ui_borderradius};
      }

      .stars {
        color: ${colors.div_a_color};
        font-size: ${colors.table_th_fontsize};
      }

      .rate-stars {
        color: ${colors.div_a_color};
        font-size: ${colors.table_th_fontsize};
        cursor: ${colors.button_cursor};
      }
    `;
    return (
      <Router history={hashHistory}>
        <Wrapper>
          {this.setRoutes()}
        </Wrapper>
      </Router>
    )
  }
}

export default App;
