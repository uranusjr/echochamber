import _ from 'lodash'

import {Question} from '@/models'


const questionPool = [
	{
		name: '題目一',
		images: ['2-1.jpg', '2-2.jpg', '2-3.jpg'],
		readthrough: 'EI_2.MP3',
	},
	{
		name: '題目二',
		images: ['4-1_updated.jpg', '4-2.jpg', '4-3.jpg'],
		readthrough: 'EI_4.MP3',
	},
	{
		name: '題目三',
		images: ['7-1.jpg', '7-2.jpg', '7-3.jpg'],
		readthrough: 'EI_CHI_male_004.mp3',
	},
	{
		name: '題目四',
		images: ['12-1_updated.jpg', '12-2_updaetd.jpg', '12-3_updated.jpg'],
		readthrough: 'EI_12.MP3',
	},
	{
		name: '題目五',
		images: ['15-1.jpg', '15-2.jpg', '15-3.jpg'],
		readthrough: 'EI_CHI_male_008.mp3',
	},
	{
		name: '題目六',
		images: ['6-1.jpg', '6-2jpg.jpg', '6-3.jpg'],
		readthrough: 'EI_6.MP3',
	},
]

const state = {
	questions: _.shuffle(_.map(questionPool, question => new Question({
		name: question.name,
		images: _.shuffle(question.images),
		readthrough: question.readthrough,
	}))),
	imageAnswers: [],
}

const getters = {
	questions: state => state.questions,
	imageAnswers: state => state.imageAnswers,
}

const mutations = {
	addImageAnswer(state, {question, choice, usedMs}) {
		state.imageAnswers.push({
			question: question,
			choice: choice,
			usedMs: usedMs,
		})
	},
}

const actions = {
	addImageAnswer({commit}, data) {
		commit('addImageAnswer', data)
	}
}

export default {
	state,
	getters,
	mutations,
	actions,
}
