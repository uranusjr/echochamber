const state = {
	context: null,
}

const mutations = {
	AUDIO_CONTEXT_CREATE(state) {
		state.context = new window.AudioContext()
	},
}

const actions = {
	AUDIO_CONTEXT_ENSURE({commit, state}) {
		return new Promise((resolve, reject) => {
			if (!state.context) {
				commit('AUDIO_CONTEXT_CREATE')
			}
			resolve(state.context)
		})
	},
}

export default {
	state: state,
	mutations: mutations,
	actions: actions,
}
