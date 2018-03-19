import fs from 'fs'
import path from 'path'
import process from 'process'

import {dialog} from 'electron'
import _ from 'lodash'

import {copyFile, promisify} from './utils'


const PROJECT_META_NAME = 'echochamberproject.json'
const RESULTS_DIRNAME = '.results'
const RESULT_METADATA_FILENAME = 'data.json'

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
	const serve = require('serve-static')(rootDir)
	const finalhandler = require('finalhandler')
	projectRootServer = require('http').createServer((request, response) => {
		serve(request, response, finalhandler(request, response))
	})
	projectRootServer.listen(8888)
	return 'http://localhost:8888'
}

function createProject(rootDir) {
	const project = {
		source: rootDir,
		root: getProjectRoot(rootDir),
		groupSize: 5,
		questions: [],
		results: [],
	}

	const meta = path.join(rootDir, PROJECT_META_NAME)
	if (fs.existsSync(meta)) {
		try {
			const data = JSON.parse(fs.readFileSync(meta))
			if (typeof data.groupSize === 'number') {
				project.groupSize = data.groupSize
			} else {
				console.error(
					`ignored group size ${data.groupSize} ` +
					`of type ${typeof data.groupSize}`,
				)
			}
		} catch (error) {
			console.error(error)
		}
	}

	for (const entryName of fs.readdirSync(rootDir)) {
		if (entryName.startsWith('.') || entryName === PROJECT_META_NAME) {
			continue
		}

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
			case '.png':
				question.images.push(contentName)
				break
			case '.m4a':
			case '.mp3':
				question.readthrough = contentName
				break
			default:
				break
			}
		}
		project.questions.push(question)
	}

	const resultsDir = path.join(rootDir, RESULTS_DIRNAME)
	if (fs.existsSync(resultsDir)) {
		for (const resultName of fs.readdirSync(resultsDir)) {
			const resultDir = path.join(resultsDir, resultName)
			if (!fs.statSync(resultDir).isDirectory()) {
				continue
			}

			const meta = path.join(resultDir, RESULT_METADATA_FILENAME)
			if (!fs.statSync(meta).isFile()) {
				continue
			}
			const result = JSON.parse(fs.readFileSync(meta))
			project.results.push(result)
		}
	}

	return project
}

export function saveProjectMeta(rootDir, data) {
	return promisify(fs.writeFile)(
		path.join(rootDir, PROJECT_META_NAME),
		JSON.stringify(data, null, 2),
	)
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

export function saveResult(meta, data) {
	const resultsDir = path.join(meta.source, RESULTS_DIRNAME)
	if (!fs.existsSync(resultsDir)) {
		fs.mkdirSync(resultsDir)
	}

	const resultDir = path.join(resultsDir, meta.name)
	if (!fs.existsSync(resultDir)) {
		fs.mkdirSync(resultDir)
	}

	const promises = []
	data.groups.forEach(group => { group.forEach(answer => {
		const stepDir = path.join(resultDir, answer.question.name)
		if (!fs.existsSync(stepDir)) {
			fs.mkdirSync(stepDir)
		}

		// Create job to copy chosen image.
		const imageTarget = path.join(stepDir, answer.image.choice)
		if (!fs.existsSync(imageTarget)) {
			promises.push(promisify(copyFile)(
				path.join(
					meta.source,
					answer.question.name,
					answer.image.choice,
				),
				imageTarget,
			))
		}

		// Create job to save readback audio.
		const audioTarget = path.join(stepDir, 'audio.wav')
		if (!fs.existsSync(audioTarget)) {
			promises.push(promisify(copyFile)(answer.audio.tempPath, audioTarget))
		}
		promises.push(promisify(fs.unlink)(answer.audio.tempPath))
	}) })

	// Create job to write result metadata.
	const persistedData = {
		name: meta.name,
		subjectName: data.subjectName,
		groups: _.map(data.groups, group => _.map(group, answer => {
			const cloned = _.clone(answer)
			cloned.audio = {name: 'audio.wav'}
			cloned.question = {name: answer.question.name}
			return cloned
		})),
	}
	promises.push(promisify(fs.writeFile)(
		path.join(resultDir, RESULT_METADATA_FILENAME),
		JSON.stringify(persistedData, null, 2),
	))

	return Promise.all(promises).then(() => persistedData)
}
