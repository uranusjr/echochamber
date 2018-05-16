import {ipcRenderer} from 'electron'
import _ from 'lodash'

import {Answer} from '@/models'


const state = {
	subjectName: '',
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
	SESSION_POPULATE(state, {subjectName, questions, groupSize}) {
		state.subjectName = subjectName
		const answers = _.map(questions, question => {
			return new Answer({
				question: question,
				image: null,
				audio: null,
			})
		})
		state.groups = _.chunk(_.shuffle(answers), groupSize)
	},
	SESSION_SET_IMAGE_ANSWER(state, data) {
		const answer = getStep(state, data.groupIndex, data.questionIndex)
		answer.image = {
			choice: data.choice,
			msDiffs: data.msDiffs,
		}
	},
	SESSION_SET_AUDIO_ANSWER(state, data) {
		const answer = getStep(state, data.groupIndex, data.questionIndex)
		answer.audio = {tempPath: data.tempPath}
		answer.audioDurationCache = data.duration
	},
}

const actions = {
	SESSION_POPULATE({commit, rootState}, {subjectName}) {
		return new Promise((resolve, reject) => {
			commit('SESSION_POPULATE', {
				subjectName: subjectName,
				groupSize: rootState.project.groupSize,
				questions: rootState.project.questions,
			})
			resolve()
		})
	},
	SESSION_SET_IMAGE_ANSWER({commit}, data) {
		commit('SESSION_SET_IMAGE_ANSWER', data)
	},
	SESSION_SET_AUDIO_ANSWER({commit, rootState}, data) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = function () {
				if (reader.readyState === FileReader.DONE) {
					data.buffer = Buffer.from(reader.result)
					const tempPath = ipcRenderer.sendSync('save-temp-sync', {
						buffer: data.buffer,
						container: rootState.project.source,
					})
					commit('SESSION_SET_AUDIO_ANSWER', {
						groupIndex: data.groupIndex,
						questionIndex: data.questionIndex,
						duration: data.duration,
						tempPath: tempPath,
					})
					resolve(data)
				}
			}
			reader.onerror = function (error) {
				reader.abort()
				reject(error)
			}
			reader.readAsArrayBuffer(data.blob)
		})
	},
}

export default {
	state: state,
	getters: getters,
	mutations: mutations,
	actions: actions,
}
