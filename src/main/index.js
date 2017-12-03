import path from 'path'
import {app, ipcMain} from 'electron'

import {selectProjectDirectory} from './projects'
import {createWindow, getWindow} from './windows'

/**
 * Set `__static` path to static files in production
 */
if (process.env.NODE_ENV !== 'development') {
	global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (getWindow() === null) {
		createWindow()
	}
})

ipcMain.on('select-project-directory', event => {
	const project = selectProjectDirectory(event)
	event.returnValue = project
})


/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */

