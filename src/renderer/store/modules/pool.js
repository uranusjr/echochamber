import _ from 'lodash'

import {Question, Result} from '@/models'


const QUESTIONS = [
	new Question({
		name: '題目一',
		images: ['2-1.jpg', '2-2.jpg', '2-3.jpg'],
		readthrough: 'EI_2.MP3',
	}),
	new Question({
		name: '題目二',
		images: ['4-1_updated.jpg', '4-2.jpg', '4-3.jpg'],
		readthrough: 'EI_4.MP3',
	}),
	new Question({
		name: '題目三',
		images: ['7-1.jpg', '7-2.jpg', '7-3.jpg'],
		readthrough: 'EI_CHI_male_004.mp3',
	}),
	new Question({
		name: '題目四',
		images: ['12-1_updated.jpg', '12-2_updaetd.jpg', '12-3_updated.jpg'],
		readthrough: 'EI_12.MP3',
	}),
	new Question({
		name: '題目五',
		images: ['15-1.jpg', '15-2.jpg', '15-3.jpg'],
		readthrough: 'EI_CHI_male_008.mp3',
	}),
	new Question({
		name: '題目六',
		images: ['6-1.jpg', '6-2jpg.jpg', '6-3.jpg'],
		readthrough: 'EI_6.MP3',
	}),
]

const RESULTS = _.map(_.range(5), () =>
	new Result({
		groups: _.chunk(_.map(QUESTIONS, data => {
			const question = new Question({
				name: data.name,
				images: _.shuffle(data.images),
				readthrough: data.readthrough,
			})
			return {
				question: Object.freeze(question),
				imageAnswer: {
					choice: question.images[0],
					usedMs: Math.random() * 1000,
				},
				audioAnswer: {blob: null},
			}
		}), 3),
		message: '測試\n第二行\n\n空行之後',
	}),
)


const state = {
	questions: _.clone(QUESTIONS),
	results: _.clone(RESULTS),
}

const mutations = {
	POOL_ADD_RESULT(state, qasession) {
		state.results.push(qasession)
	},
}

const actions = {
	POOL_ADD_RESULT({commit}, data) {
		commit('POOL_ADD_RESULT', data)
	},
}

export default {
	state: state,
	mutations: mutations,
	actions: actions,
}
