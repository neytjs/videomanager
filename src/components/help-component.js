import React, {Component} from 'react';

class Help extends Component {
  render() {
    return (
      <div className="help">
        <h3>FAQ</h3>
        <p>
          <b>What is the purpose of VideoManager?</b>
          <br/>
          VideoManager was created to help organize music videos from various sites, like YouTube and Vimeo. Sometimes sites delete a video or videos, causing the user to forget that they liked a certain song. Storing this data offline prevents that from happening. Additional features have been added, like lyrics searches and metrics analysis, that some video sites lack. Using VideoManager to store and display the video listings is also a lot less cumbersome and a lot better organized than having 1000+ video links in a browser favorites list.
        </p>
        <p>
          <b>When I click to play a YouTube video it says, “Video unavailable.” How can I watch this video?</b>
          <br/>
          First, press the ‘Refresh’ button below the video. Next, try clicking the video name at the top of the YouTube iframe. This opens the YouTube video in another window, allowing you to watch it.
        </p>
        <p>
          <b>How do I add a video?</b>
          <br/>
          Click ‘Options’ and then 'Add Videos'.
        </p>
        <p>
          <b>How do I edit a video?</b>
          <br/>
          Click the 'Edit' button on a given video, then make the desired changes and press the 'Save' button.
        </p>
        <p>
          <b>Do I always have to save my video list after making changes?</b>
          <br/>
          No. You only have to click 'Save As...' when saving your video list for the first time, which is required for long-term data storage. After that, all additions and updates are automatically saved.
        </p>
        <p>
          <b>How do I add new video types?</b>
          <br/>
          Click ‘Options’, then ‘Settings’, and then enter the appropriate information under ‘Add New Video Type’ and press ‘Add Type’. This provides support for videos from sites besides YouTube and Vimeo.
        </p>
        <p>
          <b>How do I add/edit video genres?</b>
          <br/>
          Click ‘Options’, then ‘Settings’, and then you can either add new genres or edit existing genres under ‘Add New Video Genre‘ and ‘Current Video Genres‘.
        </p>
        <p>
          <b>The default VideoManager color theme is ugly, how can I change it?</b>
          <br/>
          Click ‘Options’, then ‘Settings’, and then go to ‘Select color theme.’ You can now select a VideoManager color theme more to your liking.
        </p>
        <p>
          <b>How do I adjust the minimum year for videos?</b>
          <br/>
          If you want to increase or decrease the minimum ‘release’ year for videos, go to ‘Settings’ and then enter a new year under ‘Set minimum year.’ For example, if you never add videos/songs released before the year 2000, you could set the minimum year as 2000.
        </p>
        <p>
          <b>What is the purpose of the ‘Analysis’ feature?</b>
          <br/>
          The Analysis feature allows you to display on a line chart the cumulative star ratings for videos over a specific time frame. You can also limit the search to a specific genre or genres. This feature is intended to help you visualize your video/song data, allowing you to pinpoint certain time periods when more or less interesting videos were released.
        </p>
        <p>
          <b>Where can I view my video stats?</b>
          <br/>
          Click ‘Metrics’ to view various statistics regarding your videos and viewing habits.
        </p>
      </div>
    )
  }
}

export default Help;
