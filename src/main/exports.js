import fs from 'fs'
import path from 'path'

import {dialog} from 'electron'
import xlsx from 'xlsx'

import {copyFile, promisify} from './utils'


class Workbook {
	constructor() {
		this.SheetNames = []
		this.Sheets = {}
	}

	add(sheetName, json, header) {
		if (!json || !json.length) {
			return
		}
		if (this.SheetNames.includes(sheetName)) {
			xlsx.utils.sheet_add_json(this.Sheets[sheetName], json, {
				skipHeader: true, origin: -1,
			})
		} else {
			if (!header) {
				header = Object.keys(json[0])
			}
			this.SheetNames.push(sheetName)
			this.Sheets[sheetName] = xlsx.utils.json_to_sheet(json, {header: header})
		}
	}

	save(target) {
		// TODO: Make this async?
		xlsx.writeFileSync(this, target)
	}
}



export function exportExcel(browserWindow, rootDir, basename, resultSets) {
	const selection = dialog.showOpenDialog(browserWindow, {
		properties: ['openDirectory'],
	})
	if (!selection || selection.length < 1) {
		return Promise.reject(new Error('cancelled'))
	}

	// Get all possible keys as column headers.
	const keySet = new Set()
	const keys = []
	for (const resultSet of resultSets) {
		for (const row of Object.values(resultSet.rows)) {
			for (const key of Object.keys(row)) {
				if (!keySet.has(key)) {
					keySet.add(key)
					keys.push(key)
				}
			}
		}
	}

	// Make sure the attachment target directory exists.
	const attachmentDir = path.join(selection[0], basename)
	if (!fs.existsSync(attachmentDir)) {
		fs.mkdirSync(attachmentDir)
	}

	// Generate XLSX and copy audio files.
	const promises = []
	const workbook = new Workbook()
	for (const [i, r] of resultSets.entries()) {
		workbook.add('受試者資料', [{'代號': r.subjectName}])
		for (const [key, value] of Object.entries(r.rows)) {
			workbook.add(key, [value], keys)
		}
		const prefix = i.toString().padStart(4, '0')
		const attdir = path.join(attachmentDir, `${prefix}-${r.subjectName}`)
		if (!fs.existsSync(attdir)) {
			fs.mkdirSync(attdir)
		}
		for (const {name, parts} of r.audioPathParts) {
			const source = path.join(rootDir, ...parts)
			const suffix = path.extname(source)
			const target = path.join(attdir, `${name}${suffix}`)
			promises.push(promisify(copyFile)(source, target))
		}
	}
	workbook.save(path.join(selection[0], `${basename}.xlsx`))

	return Promise.all(promises)
}
