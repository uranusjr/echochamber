import Vue from 'vue'
import Router from 'vue-router'

import AudioCreate from '@/components/AudioCreate'
import Index from '@/components/Index'
import PictureChoice from '@/components/PictureChoice'
import QuestionList from '@/components/QuestionList'
import Result from '@/components/Result'
import ResultList from '@/components/ResultList'

import models from '@/models'
import store from '@/store'


Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/questions/',
			name: 'question-list',
			component: QuestionList,
			props: route => {
				return {
					questions: store.state.pool.questions,
				}
			},
		},
		{
			path: '/results/',
			name: 'result-list',
			component: ResultList,
			props: route => {
				return {
					results: store.state.pool.results,
				}
			},
		},
		{
			path: '/results/:index',
			name: 'result-detail',
			component: Result,
			props: route => {
				return {
					result: store.state.pool.results[route.params.index],
					canNavigate: true,
				}
			},
		},

		{
			path: '/session/:groupIndex/image/:questionIndex',
			name: 'image',
			component: PictureChoice,
			props: route => {
				const groupIndex = parseInt(route.params.groupIndex)
				const questionIndex = parseInt(route.params.questionIndex)
				const step = store.getters.getSessionStep(groupIndex, questionIndex)

				let next = null
				if (store.getters.getSessionStep(groupIndex, questionIndex + 1)) {
					next = {
						name: 'image',
						params: {groupIndex: groupIndex, questionIndex: questionIndex + 1},
					}
				} else {
					next = {
						name: 'audio',
						params: {groupIndex: groupIndex, questionIndex: 0},
					}
				}

				return {
					groupIndex: groupIndex,
					questionIndex: questionIndex,
					question: step.question,
					next: next,
				}
			},
		},
		{
			path: '/session/:groupIndex/audio/:questionIndex',
			name: 'audio',
			component: AudioCreate,
			props: route => {
				const groupIndex = parseInt(route.params.groupIndex)
				const questionIndex = parseInt(route.params.questionIndex)
				const step = store.getters.getSessionStep(groupIndex, questionIndex)

				let next = {name: 'session-result'}
				if (store.getters.getSessionStep(groupIndex, questionIndex + 1)) {
					next = {
						name: 'audio',
						params: {groupIndex: groupIndex, questionIndex: questionIndex + 1},
					}
				} else if (store.getters.getSessionGroup(groupIndex + 1)) {
					next = {
						name: 'image',
						params: {groupIndex: groupIndex + 1, questionIndex: 0},
					}
				}

				return {
					groupIndex: groupIndex,
					questionIndex: questionIndex,
					question: step.question,
					imageName: step.imageAnswer.choice,
					next: next,
				}
			},
		},
		{
			path: '/session/result',
			name: 'session-result',
			component: Result,
			props: route => {
				return {
					result: new models.Result({
						groups: store.state.qasession.groups,
					}),
				}
			},
		},

		{
			path: '/',
			name: 'index',
			component: Index,
		},
		{
			path: '*',
			redirect: '/'
		},
	],
})
