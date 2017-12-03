import * as moment from 'moment'


export class Question {
	constructor(opts) {
		this.root = opts.root
		this.name = opts.name
		this.images = opts.images
		this.readthrough = opts.readthrough
	}

	getAssetUrl(name) {
		return `${this.root}/${this.name}/${name}`
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
