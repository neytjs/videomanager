/*
main.js is our main process, the entry point to the Electron app. It controls the life of the application, from start to close.
https://electronjs.org/docs/glossary#main-process
*/

const electron = require('electron');
const app = electron.app;
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		height: 1024,
		width: 768,
		webPreferences: {webSecurity: false},
		icon: require('path').join(__dirname, 'vm.png')
	});


	let url = require('url').format({
		protocol: 'file',
		slashes: true,
		pathname: require('path').join(__dirname, 'index.html')
	});


	mainWindow.loadURL(url);
	mainWindow.maximize();
	mainWindow.setMenu(null);
//	mainWindow.webContents.openDevTools();
});

let darwin = process.platform === 'darwin';


app.on('window-all-closed', () => {

  if (!darwin) {
    app.quit();
  }
});


	global.history_viewer = {
		video: {},
		viewing_lyrics: false
	}

	global.search = {
	 	view_all: true,
		search_hidden: true,
		sorted: "",
	 	search_arguments: {}
	}
