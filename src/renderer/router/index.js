import Vue from 'vue'
import Router from 'vue-router'

import PictureChoice from '@/components/PictureChoice'
import Result from '@/components/Result'

import store from '@/store'


Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/image-choice/:index',
			name: 'picture-choice',
			component: PictureChoice,
			props: route => {
				const questions = store.getters.questions
				const index = parseInt(route.params.index)
				let next = {path: '/'}
				if (index < questions.length - 1) {
					next = {name: 'picture-choice', params: {index: index + 1}}
				} else if (index === questions.length - 1) {
					next = {name: 'result'}
				}
				return {
					index: index,
					questionCount: questions.length,
					question: questions[index],
					next: next,
				}
			},
		},
		{
			path: '/result',
			name: 'result',
			component: Result,
			props: {result: store.getters.imageAnswers},
		},
		{
			path: '/',
			redirect: '/image-choice/0',
		},
		{
			path: '*',
			redirect: '/'
		},
	],
})
