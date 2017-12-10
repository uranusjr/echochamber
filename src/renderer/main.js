import './styles/site.scss'

import Vue from 'vue'

import App from './App'
import router from './routes'
import store from './store'

import ImageBox from '@/components/_ImageBox'
import WaveDisplay from '@/components/_WaveDisplay'


Vue.config.productionTip = false

Vue.component('image-box', ImageBox)
Vue.component('wave-display', WaveDisplay)


/* eslint-disable no-new */
new Vue({
	components: {App},
	router,
	store,
	template: '<App/>'
}).$mount('#app')
