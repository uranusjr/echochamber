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


export class Answer {
	constructor(opts) {
		this.question = opts.question
		this.image = opts.image 	// {choice: String, msDiffs: Array(Number)}.
		this.audio = opts.audio 	// {blob: Blob, buffer: Buffer} / {name: String}.
	}
}


class Result {
	constructor(opts) {
		this.groups = opts.groups
		this.message = opts.message || ''
		this.timestamp = moment.isMoment(opts.timestamp) ?
				opts.timestamp : moment(opts.timestamp, 'YYYYMMDD-HHmmss-SSS')
	}

	get name() {
		return this.timestamp.format('YYYYMMDD-HHmmss-SSS')
	}
}

export class SessionResult extends Result {
	getImageChoice(answer) {
		return answer.question.getAssetUrl(answer.image.choice)
	}

	getAudio(answer) {
		return window.URL.createObjectURL(answer.audio.blob)
	}
}

export class PersistedResult extends Result {
	constructor(opts) {
		super(opts)
		this.root = opts.root
	}

	getImageChoice(answer) {
		return `${this.root}/.results/${this.name}/${answer.image.choice}`
	}

	getAudio(answer) {
		return `${this.root}/.results/${this.name}/${answer.audio.name}`
	}
}
