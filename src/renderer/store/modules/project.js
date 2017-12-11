import _ from 'lodash'
import {ipcRenderer} from 'electron'
import * as moment from 'moment'

import {Answer, PersistedResult, Question} from '@/models'


function buildPersistedResult(data) {
	return new PersistedResult({
		root: state.root,
		message: data.message,
		timestamp: moment(data.name, 'YYYYMMDD-HHmmss-SSS'),
		groups: _.map(data.groups, group => _.map(group, d => {
			const question = state._questionMap.has(d.name) ?
					state._questionMap.get(d.name) :
					new Question({name: d.name, images: []})
			return new Answer(_.assign(d, {question: question}))
		}))
	})
}


const state = {
	root: null,
	source: null,
	groupSize: 0,
	questions: [],
	_questionMap: new Map(),
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
		state.questions = []
		state._questionMap.clear()
		for (const d of data.questions) {
			const question = new Question(_.assign({root: data.root}, d))
			state.questions.push(question)
			state._questionMap.set(question.name, question)
		}
		state.results = _.map(data.results, buildPersistedResult)
	},
	PROJECT_SET_PROJECT_META(state, data) {
		state.groupSize = data.groupSize
	},
	PROJECT_SAVE_RESULT(state, data) {
		state.results.push(buildPersistedResult(data))
	},
}

const actions = {
	PROJECT_LOAD_FROM_FILESYSTEM({commit}, data) {
		commit('PROJECT_LOAD_FROM_FILESYSTEM', data)
	},
	PROJECT_SET_PROJECT_META({commit, state}, data) {
		return new Promise((resolve, reject) => {
			ipcRenderer.on('save-project-meta-success', event => {
				commit('PROJECT_SET_PROJECT_META', data)
				resolve()
			})
			ipcRenderer.send('save-project-meta', {
				source: state.source,
				data: data,
			})
		})
	},
	PROJECT_SAVE_RESULT({commit, state}, result) {
		return new Promise((resolve, reject) => {
			ipcRenderer.on('save-result-success', (event, persistedData) => {
				commit('PROJECT_SAVE_RESULT', persistedData)
				resolve()
			})
			const meta = {source: state.source, name: result.name}
			ipcRenderer.send('save-result', {meta: meta, data: result})
		})
	},
}

export default {
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions,
}
