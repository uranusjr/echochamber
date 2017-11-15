import Vue from 'vue'
import Router from 'vue-router'

import PictureChoice from '@/components/PictureChoice'


Vue.use(Router)

export default new Router({
	routes: [
		{
			path: '/',
			name: 'picture-choice',
			component: PictureChoice,
			props: {
				question: {
					name: '題目一',
					images: ['2-1.jpg', '2-2.jpg', '2-3.jpg'],
					readthrough: 'EI_2.MP3',
				},
			},
		},
		{
			path: '*',
			redirect: '/'
		},
	],
})
