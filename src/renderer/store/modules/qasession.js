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
	groups: [],
}

function getGroup(state, groupIndex) {
	return state.groups[groupIndex]
}

function getStep(state, groupIndex, questionIndex) {
	const group = getGroup(state, groupIndex)
	return group ? group[questionIndex] : undefined
}

const getters = {
	getSessionGroup(state) {
		return _.partial(getGroup, state)
	},
	getSessionStep(state) {
		return _.partial(getStep, state)
	},
}

const mutations = {
	SESSION_POPULATE(state, {groupSize}) {
		const questions = _.map(questionPool, data => {
			const question = new Question({
				name: data.name,
				images: _.shuffle(data.images),
				readthrough: data.readthrough,
			})
			return {
				question: question,
				imageAnswer: null,
				audioAnswer: null,
			}
		})
		state.groups = _.chunk(_.shuffle(questions), groupSize)
	},
	SESSION_SET_IMAGE_ANSWER(state, data) {
		const info = getStep(state, data.groupIndex, data.questionIndex)
		info.imageAnswer = {choice: data.choice, usedMs: data.usedMs}
	},
	SESSION_SET_AUDIO_ANSWER(state, data) {
		const info = getStep(state, data.groupIndex, data.questionIndex)
		info.audioAnswer = {blob: data.blob}
	},
}

const actions = {
	SESSION_POPULATE({commit}, data) {
		return new Promise((resolve, reject) => {
			commit('SESSION_POPULATE', data)
			resolve()
		})
	},
	SESSION_SET_IMAGE_ANSWER({commit}, data) {
		commit('SESSION_SET_IMAGE_ANSWER', data)
	},
	SESSION_SET_AUDIO_ANSWER({commit}, data) {
		commit('SESSION_SET_AUDIO_ANSWER', data)
	},
}

export default {
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions,
}
