const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		height: 1024,
		width: 768,
		webPreferences: {webSecurity: false}
	});

	let url = require('url').format({
		protocol: 'file',
		slashes: true,
		pathname: require('path').join(__dirname, 'index.html')
	});

	mainWindow.loadURL(url);
	mainWindow.maximize();
});

let darwin = process.platform === 'darwin';

app.on('window-all-closed', () => {
  if (!darwin) {
    app.quit();
  }
});

 global.history_viewer = {
	 video: {}
 }
