import path from 'path'

import * as moment from 'moment'


export class Question {
	constructor(opts) {
		this.name = opts.name
		this.images = opts.images
		this.readthrough = opts.readthrough
	}

	getAssetUrl(name) {
		return path.join('static/questions', this.name, name)
	}
}


export class Result {
	constructor(opts) {
		this.groups = opts.groups
		this.message = opts.message || ''
		this.timestamp = opts.timestamp || moment()
	}
}

export default {
	Result: Result,
}
