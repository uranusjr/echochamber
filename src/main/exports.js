import path from 'path'

import {dialog} from 'electron'
import xlsx from 'xlsx'


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



export function exportExcel(browserWindow, filename, resultSets) {
	const selection = dialog.showOpenDialog(browserWindow, {
		properties: ['openDirectory'],
	})
	if (!selection || selection.length < 1) {
		return
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

	const workbook = new Workbook()
	for (const {subjectName, rows} of resultSets) {
		workbook.add('受試者資料', [{'代號': subjectName}])
		for (const [key, value] of Object.entries(rows)) {
			workbook.add(key, [value], keys)
		}
	}
	workbook.save(path.join(selection[0], filename))
}
