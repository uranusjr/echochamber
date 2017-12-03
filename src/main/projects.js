import fs from 'fs'
import http from 'http'
import path from 'path'
import process from 'process'

import {dialog} from 'electron'
import * as finalhandler from 'finalhandler'
import * as serveStatic from 'serve-static'

import {getWindow} from './windows'


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


export function selectProjectDirectory() {
	const selection = dialog.showOpenDialog(getWindow(), {
		properties: ['openDirectory'],
	})
	if (!selection || selection.length < 1) {
		return null
	}

	const rootDir = selection[0]
	const project = {
		groupSize: 3,
		questions: [],
	}
	for (const entryName of fs.readdirSync(rootDir)) {
		const entry = path.join(rootDir, entryName)
		if (!fs.statSync(entry).isDirectory()) {
			continue
		}
		const question = {
			root: getProjectRoot(rootDir),
			name: entryName,
			images: [],
			readthrough: null,
		}
		for (const contentName of fs.readdirSync(entry)) {
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
		project.questions.push(question)
	}

	return project
}
