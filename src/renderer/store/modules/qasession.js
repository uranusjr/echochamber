import _ from 'lodash'


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
	SESSION_POPULATE(state, {questions, groupSize}) {
		const questionList = _.map(questions, question => {
			return {
				question: question,
				imageAnswer: null,
				audioAnswer: null,
			}
		})
		state.groups = _.chunk(_.shuffle(questionList), groupSize)
	},
	SESSION_SET_IMAGE_ANSWER(state, data) {
		const info = getStep(state, data.groupIndex, data.questionIndex)
		info.imageAnswer = {choice: data.choice, msDiffs: data.msDiffs}
	},
	SESSION_SET_AUDIO_ANSWER(state, data) {
		const info = getStep(state, data.groupIndex, data.questionIndex)
		info.audioAnswer = {blob: data.blob}
	},
}

const actions = {
	SESSION_POPULATE({commit, rootState}) {
		return new Promise((resolve, reject) => {
			commit('SESSION_POPULATE', {
				groupSize: rootState.project.groupSize,
				questions: rootState.project.questions,
			})
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
