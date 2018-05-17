import _ from 'lodash'
import {ipcRenderer} from 'electron'
import * as moment from 'moment'

import {Answer, PersistedResult, Question} from '@/models'


function buildPersistedResult(data) {
	return new PersistedResult({
		root: state.root,
		subjectName: data.subjectName,
		timestamp: moment(data.name, 'YYYYMMDD-HHmmss-SSS'),
		groups: _.map(data.groups, group => _.map(group, d => {
			const question = state._questionMap[d.question.name] ||
					new Question(d.question)
			return new Answer(_.assign(d, {question: question}))
		}))
	})
}


const state = {
	root: null,
	source: null,
	groupSize: 0,
	questions: [],
	_questionMap: {},
	results: {},
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
		state._questionMap = {}
		for (const d of data.questions) {
			const question = new Question(_.assign({root: data.root}, d))
			state.questions.push(question)
			state._questionMap[question.name] = question
		}
		state.results = {}
		data.results.forEach(data => {
			state.results[data.name] = buildPersistedResult(data)
		})
	},
	PROJECT_SET_PROJECT_META(state, data) {
		state.groupSize = data.groupSize
	},
	PROJECT_SAVE_RESULT(state, data) {
		state.results[data.name] = buildPersistedResult(data)
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
			ipcRenderer.on('save-result-fail', (event, error) => {
				reject(error)
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
