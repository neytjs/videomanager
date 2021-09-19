import React, {Component} from 'react';
import Stars from './stars-component.js';
const {getGlobal} = window.require('@electron/remote');

class Table extends Component {
  constructor(props) {
    super(props);
  }

  viewVideoFromHistory() {
    getGlobal('history_viewer').history_clicked = true;
    this.props.setToView();
  }

  mapVideos() {
    if (this.props.table === "main") {
      return this.props.videos.map((video, i) => {
        return (
          <tr key={video.video_code + Math.floor(Math.random() * (10000))}>
            <td><a onClick={() => { this.props.displayVideo(video, video._id, i, true); this.props.addToHistory(video._id)} }>{video.video_title}</a></td>
            <td>{video.video_band}</td>
            <td>{video.video_year}</td>
            <td><Stars starsAmount={video.video_stars}></Stars></td>
          </tr>
        )
      });
    } else if (this.props.table === "history") {
      return this.props.history.map((video, i) => {
        let date = new Date(video.view_date);
        return (
          <tr key={video.view_date + video.video_band + video.video_title + Math.floor(Math.random() * (10000))}>
            <td><a onClick={() => { this.viewVideoFromHistory(); this.props.addToHistory(video.video_id) } }>{video.video_title}</a></td>
            <td>{video.video_band}</td>
            <td>{date.toLocaleDateString("en-US", {year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric"})}</td>
            <td><button onClick={() => this.props.deleteView(video._id)}>Delete</button></td>
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
              By Song Name: <button onClick={() => this.props.videosSorter([], "ASC", "bsn_a", true)}>↑</button> <button onClick={() => this.props.videosSorter([], "DESC", "bsn_d", true)}>↓</button>
            </th>
            <th>
              By Band: <button onClick={() => this.props.videosSorter([], "ASC", "", true)}>↑</button> <button onClick={() => this.props.videosSorter([], "DESC", "bb_d", true)}>↓</button>
            </th>
            <th>
              By Year: <button onClick={() => this.props.videosSorter([], "ASC", "by_a", true)}>↑</button> <button onClick={() => this.props.videosSorter([], "DESC", "by_d", true)}>↓</button>
            </th>
            <th>
              By Stars: <button onClick={() => this.props.videosSorter([], "ASC", "bs_a", true)}>↑</button> <button onClick={() => this.props.videosSorter([], "DESC", "bs_d", true)}>↓</button>
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
