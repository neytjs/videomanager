// this holds the default data for video_type and video_genre, which are loaded on the applications' first start.
// after that it is loaded from the app_db, so it can be edited and saved
class AppData {
  static defaultAppData() {
    return {
      video_type: [{ url: "", label: "", width: 560, height: 315 }, { url: "https://www.youtube.com/embed/", label: "YouTube", width: 560, height: 315 }, { url: "https://player.vimeo.com/video/", label: "Vimeo", width: 640, height: 320 }],
      video_genre: ["", "Rock", "Rap", "Pop", "Electronic", "Soundtrack", "Classical", "Parody", "Other"],
      min_year: 1900
    }
  }
}

export default AppData;
