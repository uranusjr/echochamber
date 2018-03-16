import path from 'path'

import {dialog} from 'electron'
import xlsx from 'xlsx'


class Workbook {
	constructor() {
		this.SheetNames = []
		this.Sheets = {}
	}

	add(sheetName, json) {
		if (this.SheetNames.includes(sheetName)) {
			xlsx.utils.sheet_add_json(this.Sheets[sheetName], json, {
				skipHeader:true, origin: -1,
			})
		} else {
			this.SheetNames.push(sheetName)
			this.Sheets[sheetName] = xlsx.utils.json_to_sheet(json)
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
	// TODO: We need to collect aggregated column names to use for all data.
	const workbook = new Workbook()
	for (const {subjectName, rows} of resultSets) {
		workbook.add('受試者資料', [{'代號': subjectName}])
		for (const [key, value] of Object.entries(rows)) {
			workbook.add(key, [value])
		}
	}
	workbook.save(path.join(selection[0], filename))
}
