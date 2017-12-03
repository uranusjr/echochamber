import _ from 'lodash'

import {Question} from '@/models'


const state = {
	groupSize: 3,
	questions: [],
	results: [],
}

const getters = {
	projectLoaded(state) {
		return state.questions.length > 0
	},
}

const mutations = {
	PROJECT_LOAD_FROM_FILESYSTEM(state, data) {
		state.groupSize = data.groupSize
		state.questions = _.map(data.questions, d => {
			return new Question(_.assign({root: data.root}, d))
		})
		state.results = []
	},
	PROJECT_ADD_RESULT(state, qasession) {
		state.results.push(qasession)
	},
}

const actions = {
	PROJECT_LOAD_FROM_FILESYSTEM({commit}, data) {
		commit('PROJECT_LOAD_FROM_FILESYSTEM', data)
	},
	PROJECT_ADD_RESULT({commit}, data) {
		commit('PROJECT_ADD_RESULT', data)
	},
}

export default {
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions,
}
