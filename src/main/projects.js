import fs from 'fs'
import http from 'http'
import path from 'path'
import process from 'process'

import {dialog} from 'electron'
import * as finalhandler from 'finalhandler'
import * as serveStatic from 'serve-static'


let projectRootServer = null

function getProjectRoot(rootDir) {
	// Simply use the file protocol in production mode.
	if (process.env.NODE_ENV === 'production') {
		return `file://${rootDir}`
	}

	// In dev mode, spin up an HTTP server to serve the project files.
	if (projectRootServer) {
		projectRootServer.close()
	}
	const serve = serveStatic(rootDir)
	projectRootServer = http.createServer((request, response) => {
		serve(request, response, finalhandler(request, response))
	})
	projectRootServer.listen(8888)
	return 'http://localhost:8888'
}

function createProject(rootDir) {
	const project = {
		source: rootDir,
		root: getProjectRoot(rootDir),
		groupSize: 3,
		questions: [],
	}

	for (const entryName of fs.readdirSync(rootDir)) {
		const entry = path.join(rootDir, entryName)
		if (!fs.statSync(entry).isDirectory()) {
			continue
		}
		const question = {
			name: entryName,
			images: [],
			readthrough: null,
		}
		for (const contentName of fs.readdirSync(entry)) {
			// TODO: Support more formats? Or is there a better way, maybe via MIME?
			switch (path.extname(contentName).toLowerCase()) {
			case '.jpg':
			case '.jpeg':
				question.images.push(contentName)
				break
			case '.mp3':
				question.readthrough = contentName
				break
			default:
				break
			}
		}
		project.questions.push(Object.freeze(question))
	}

	return project
}

export function selectProjectDirectory(browserWindow) {
	const selection = dialog.showOpenDialog(browserWindow, {
		properties: ['openDirectory'],
	})
	if (!selection || selection.length < 1) {
		return null
	}

	const rootDir = selection[0]

	let project
	try {
		project = createProject(rootDir)
		if (project.questions.length < 1) {
			throw new Error('找不到問題')
		}
	} catch (e) {
		dialog.showMessageBox(browserWindow, {
			type: 'error',
			title: '專案載入失敗',
			message: e.toString(),
			detail: `專案路徑：${rootDir}`,
		})
	}

	return project
}
