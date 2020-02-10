const { app, Menu, MenuItem, ipcMain, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		height: 1024,
		width: 768,

		webPreferences: {
			nodeIntegration: true,
			devTools: false
		},
		icon: require('path').join(__dirname, 'vm.png')
	});

	let url = require('url').format({
		protocol: 'file',
		slashes: true,
		pathname: require('path').join(__dirname, 'index.html')
	});

	function resetGlobals() {
		global.history_viewer = {
			video: {},
			viewing_lyrics: false,
			history_clicked: false
		}
		global.search = {
		 	view_all: true,
			search_hidden: "none",
			prev_view: "none",
			sorted: "",
			ascdesc: "ASC",
			history: false,
			updated: false,
			page: 1,
		 	search_arguments: {
				title: { field: "", searched: "" },
				band: { field: "", searched: "" },
				genre: { field: null, searched: null },
				lyrics: { field: "", searched: "" },
				mintomax: { field: "", searched: "" },
				maxtomin: { field: "", searched: "" },
				tag: { field: null, searched: null },
				stars: { field: null, searched: null },
				ifyears: true
			},
			tag_search: false,
			band_search: false
		}
		global.add = {
			message: "",
			title: "",
			code: "",
			band: "",
			year: "",
			genre: "",
			lyrics: "",
			type: "",
			tag: "",
			tags: [],
			just_inserted_code: ""
		}
		global.editing = {
			editing_video: false
		}
		global.analysis = {
			year_start: 0,
			year_end: 0,
			genre: null,
			analyzed: false,
			analysis_type: "",
			starsChecked: false,
			videosChecked: false
		}
		global.enterTracker = {
			component_tracker: "",
			tag_insert_tracker: false
		}
		global.interfaceClick = {
			clicked: false
		}
		global.listTracker = {
			list_id: ""
		}
	}
	let videomanager = " – VideoManager";
	const template = [
		{
			label: 'File',
			submenu: [
				{
					label: 'New File',
					click: function() {

						mainWindow.webContents.send('new_db', "");

						mainWindow.setTitle("unsaved" + videomanager);

						resetGlobals();
					}
				},
				{
					label: 'Open File...',
					click: function() {
						dialog.showOpenDialog({
							properties: ['openFile'],
							filters: [
								{ name: 'DBs', extensions: ['db'] }
							]
						}).then((file) => {

							if (file.filePaths.length > 0) {
								mainWindow.webContents.send('load_list', file.filePaths[0]);

								mainWindow.setTitle(file[0] + videomanager);

								resetGlobals();
							}
						});
					}
				},
				{
					label: 'Save As...',
					click: function() {
						var savePath = dialog.showSaveDialogSync({});
						if (savePath) {

							if (savePath.slice(savePath.length - 3) !== ".db") {
								savePath = savePath + ".db";
							}
							fs.writeFile(savePath, '', function(err) {

								mainWindow.webContents.send('save_as_db', savePath);

								mainWindow.setTitle(savePath + videomanager);
							});
						}
					}
				},
				{
						type: 'separator'
				},
				{
					role: 'quit'
				}
			]
		},
		{
			label: 'Options',
			submenu: [
				{
					label: 'View Videos',
					click: function() {
						mainWindow.webContents.send('view', 'view');
					}
				},
				{
					label: 'Search Videos (Ctrl+S)',
					click: function() {
						mainWindow.webContents.send('search', 'view');
					}
				},
				{
					label: 'Add Videos (Ctrl+A)',
					click: function() {
						mainWindow.webContents.send('add', 'view');
					}
				},
        {
            type: 'separator'
        },
				{
					label: 'View History (Ctrl+H)',
					click: function() {
						mainWindow.webContents.send('history', 'history');
					}
				},
				{
					label: 'Analysis (Ctrl+N)',
					click: function() {
						mainWindow.webContents.send('analysis', 'analysis');
					}
				},
				{
					label: 'Metrics (Ctrl+M)',
					click: function() {
						mainWindow.webContents.send('metrics', 'metrics');
					}
				},
				{
					label: 'Settings',
					click: function() {
						mainWindow.webContents.send('settings', 'settings');
					}
				}
			],
		},
		{
			label: 'Help',
			submenu: [
				{
					label: 'FAQ',
					click: function() {
						mainWindow.webContents.send('help', 'help');
					}
				}
			]
		}
	]

	ipcMain.on('ret_db', function(event, response) {
		mainWindow.setTitle(response + videomanager);
	});

	const menu = Menu.buildFromTemplate(template);
	Menu.setApplicationMenu(menu);


	mainWindow.setTitle("unsaved" + videomanager);
	mainWindow.loadURL(url);
	mainWindow.maximize();
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
		viewing_lyrics: false,
		history_clicked: false
	}

	global.search = {
	 	view_all: true,
		search_hidden: "none",
		prev_view: "none",
		sorted: "",
		ascdesc: "ASC",
		history: false,
		updated: false,
		page: 1,
	 	search_arguments: {
			title: { field: "", searched: "" },
			band: { field: "", searched: "" },
			genre: { field: null, searched: null },
			lyrics: { field: "", searched: "" },
			mintomax: { field: "", searched: "" },
			maxtomin: { field: "", searched: "" },
			tag: { field: null, searched: null },
			stars: { field: null, searched: null },
			ifyears: true
		},
		tag_search: false,
		band_search: false
	}

	global.add = {
		message: "",
		title: "",
		code: "",
		band: "",
		year: "",
		genre: "",
		lyrics: "",
		type: "",
		tag: "",
		tags: [],
		just_inserted_code: ""
	}

	global.editing = {
		editing_video: false
	}

	global.analysis = {
		year_start: 0,
		year_end: 0,
		genre: null,
		tag: null,
		analyzed: false,
		analysis_type: "",
		starsChecked: false,
		videosChecked: false
	}

	global.enterTracker = {
		component_tracker: "",
		tag_insert_tracker: false
	}

	global.interfaceClick = {
		clicked: false
	}

	global.listTracker = {
		list_id: ""
	}
