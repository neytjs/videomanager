/*
The table subcomponent organizes the display of data returned for both the video-list and
history components.
*/

import React, {Component} from 'react';
const remote = window.require('electron').remote;
import { createHashHistory } from 'history';
import Stars from './stars-component.js';
const hashHistory = createHashHistory();

class Table extends Component {
  constructor(props) {
    super(props);
    this.viewVideoFromHistory = this.viewVideoFromHistory.bind(this);
  }

  viewVideoFromHistory(video) {

    remote.getGlobal('history_viewer').video = video;

    hashHistory.push('/');
  }

    mapVideos() {

      if (this.props.table === "main") {
        return this.props.videos.map((video, i) => {
          return (
            <tr key={video.video_code + Math.floor(Math.random() * (10000))}>
              <td><a onClick={() => { this.props.displayVideo(video, video._id, i); this.props.addToHistory(video.video_code, video.video_title, video.video_band, video.video_genre, video.video_year, video.video_lyrics, video.video_lyrics_html, video.video_type, video.video_tags, video.video_stars, video._id)} }>{video.video_title}</a></td>
              <td>{video.video_band}</td>
              <td>{video.video_year}</td>
              <td><Stars starsAmount={video.video_stars}></Stars></td>
              <td><button onClick={() => this.props.hideVideo(i, video.video_code)}>Hide</button></td>
            </tr>
          )
        });
      } else if (this.props.table === "history") {
        return this.props.history.map((video, i) => {
          let date = new Date(video.view_date);
          return (
            <tr key={video.view_date + Math.floor(Math.random() * (10000))}>
              <td><a onClick={() => { this.viewVideoFromHistory(video); this.props.addToHistory(video.video_code, video.video_title, video.video_band, video.video_genre, video.video_year, video.video_lyrics, video.video_lyrics_html, video.video_type, video.video_tags, video.video_stars, video.video_id) } }>{video.video_title}</a></td>
              <td>{video.video_band}</td>
              <td>{date.toString()}</td>
            </tr>
          )
        });
      }
    }

    tableHead() {

      if (this.props.table === "main") {
        return (
          <thead>
            <tr>
              <th>
                By Song Name: <button onClick={() => this.props.orderBySong("ASC")}>↑</button> <button onClick={() => this.props.orderBySong("DESC")}>↓</button>
              </th>
              <th>
                By Band: <button onClick={() => this.props.orderByBand("ASC")}>↑</button> <button onClick={() => this.props.orderByBand("DESC")}>↓</button>
              </th>
              <th>
                By Year: <button onClick={() => this.props.orderByYear("ASC")}>↑</button> <button onClick={() => this.props.orderByYear("DESC")}>↓</button>
              </th>
              <th>
                By Stars: <button onClick={() => this.props.orderByStars("ASC")}>↑</button> <button onClick={() => this.props.orderByStars("DESC")}>↓</button>
              </th>
              <th>
                {' '}
              </th>
            </tr>
          </thead>
        )
      }
    }

  render() {
    return (
      <table>
        {this.tableHead()}
        <tbody>
          {this.mapVideos()}
        </tbody>
      </table>
    )
  }
}

export default Table;
