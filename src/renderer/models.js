import path from 'path'


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
