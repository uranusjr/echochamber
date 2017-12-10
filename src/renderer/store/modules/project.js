import _ from 'lodash'
import {ipcRenderer} from 'electron'

import {PersistedResult, Question} from '@/models'


const state = {
	root: null,
	source: null,
	groupSize: 0,
	questions: [],
	results: [],
}

const getters = {
	projectLoaded(state) {
		return !!state.source
	},
}

const mutations = {
	PROJECT_LOAD_FROM_FILESYSTEM(state, data) {
		state.root = data.root
		state.source = data.source
		state.groupSize = data.groupSize
		state.questions = _.map(data.questions, d => {
			return new Question(_.assign({root: data.root}, d))
		})
		state.results = []
	},
	PROJECT_SAVE_RESULT(state, data) {
		const questionMap = new Map()
		for (const question of state.questions) {
			questionMap.set(question.name, question)
		}
		state.results.push(new PersistedResult(data))
	},
}

const actions = {
	PROJECT_LOAD_FROM_FILESYSTEM({commit}, data) {
		commit('PROJECT_LOAD_FROM_FILESYSTEM', data)
	},
	PROJECT_SAVE_RESULT({commit, rootState}, result) {
		return new Promise((resolve, reject) => {
			ipcRenderer.on('save-result-success', (event, persistedData) => {
				commit('PROJECT_SAVE_RESULT', persistedData)
				resolve()
			})
			ipcRenderer.send('save-result', {
				meta: {
					source: rootState.project.source,
					name: result.name,
				},
				data: result,
			})
		})
	},
}

export default {
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions,
}
