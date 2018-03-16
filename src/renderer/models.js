import _ from 'lodash'


export class Question {
	constructor(opts) {
		this.root = opts.root
		this.name = opts.name
		this.images = opts.images || []
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

	/** Determine if the image selection is correct.
	 *
	 *	1. Find and trim the common prefix of the images.
	 *	2. Compare the suffix. The shortest suffix is correct.
	 *	3. If there are multiple shortest choices, use the lexical minimum.
	 */
	get isImageCorrect() {
		if (this.question.images.length < 2) {
			return true
		}

		const last = this.question.images[this.question.images.length - 1]
		const common = i => {
			const x = last.charAt(i)
			return _.every(this.question.images, e => e.charAt(i) === x)
		}

		let i = 0
		while (i < last.length && common(i)) {
			i++
		}
		const correctImage = _.minBy(this.question.images, e => {
			const suffix = e.substring(i)
			return [suffix.length, suffix]
		})

		return (this.image.choice === correctImage)
	}
}


class Result {
	constructor(opts) {
		this.subjectName = opts.subjectName || ''
		this.groups = opts.groups
		this.timestamp = opts.timestamp
	}

	get name() {
		return this.timestamp.format('YYYYMMDD-HHmmss-SSS')
	}

	get sortedAnswers() {
		const joined = Array.prototype.concat.apply([], this.groups)
		return _.sortBy(joined, answer => answer.question.name)
	}

	exportRows() {
		const imageChoiceRow = {}
		const rightChoiceRow = {}
		const choiceTimeRow = {}
		const playCountRow = {}

		for (const answer of this.sortedAnswers) {
			const key = answer.question.name
			imageChoiceRow[key] = answer.image.choice
			rightChoiceRow[key] = answer.isImageCorrect
			choiceTimeRow[key] = answer.image.msDiffs[0] / 1000.0
			playCountRow[key] = answer.image.msDiffs.length
		}

		return {
			'圖片選擇': imageChoiceRow,
			'圖片正確': rightChoiceRow,
			'選擇用秒': choiceTimeRow,
			'播放次數': playCountRow,
		}
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
		return [
			this.root, '.results',
			this.name, answer.question.name, answer.image.choice,
		].join('/')
	}

	getAudio(answer) {
		return [
			this.root, '.results',
			this.name, answer.question.name, answer.audio.name,
		].join('/')
	}
}
