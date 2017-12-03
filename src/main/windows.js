import {BrowserWindow} from 'electron'


let mainWindow

const winURL = process.env.NODE_ENV === 'development'
	? 'http://localhost:9080'
	: `file://${__dirname}/index.html`


export function createWindow() {
	mainWindow = new BrowserWindow({
		height: 563,
		useContentSize: true,
		width: 1000
	})

	mainWindow.loadURL(winURL)
	mainWindow.on('closed', () => {
		mainWindow = null
	})
}


export function getWindow() {
	return mainWindow
}
