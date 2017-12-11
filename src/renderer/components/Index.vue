<template>

<div class="index-page">

	<form v-if="!hasProject">
		<div class="field is-grouped">
			<div class="control">
				<button type="button" class="button is-large is-primary"
						v-on:click="chooseProjectDirectory">
					選擇專案目錄
				</button>
			</div>
		</div>
	</form>

	<form v-else v-on:submit.prevent="beginSession">
		<div class="field is-grouped">
			<div class="control is-expanded">
				<router-link v-bind:to="{name: 'question-list'}" class="button">
					問題列表
				</router-link>
			</div>
			<div class="control is-expanded">
				<router-link v-bind:to="{name: 'result-list'}" class="button">
					結果列表
				</router-link>
			</div>
		</div>

		<hr>

		<div class="field is-horizontal">
			<div class="field-label">
				<label class="label" for="id_group_size">分組題數</label>
			</div>
			<div class="field-body">
				<div class="field">
					<div class="control is-expanded">
						<input class="input" type="number" id="id_group_size"
								v-model="groupSize">
					</div>
				</div>
			</div>
		</div>

		<div class="field is-grouped">
			<div class="control is-expanded">
				<button type="submit" v-bind:class="submitClass">開始作答</button>
			</div>
		</div>
	</form>

</div>

</template>


<script>

import {ipcRenderer} from 'electron'

export default {
	data() {
		return {
			loading: false,
		}
	},
	computed: {
		submitClass() {
			return {
				'button': true,
				'is-primary': true,
				'is-large': true,
				'is-loading': this.loading,
			}
		},
		hasProject() {
			return this.$store.getters.projectLoaded
		},
		groupSize: {
			get() {
				return this.$store.state.project.groupSize
			},
			set(val) {
				this.loading = true
				const meta = {groupSize: Number(val)}
				this.$store.dispatch('PROJECT_SET_PROJECT_META', meta).then(() => {
					this.loading = false
				})
			},
		},
	},
	watch: {
		hasProject(newVal) {
			if (!newVal) {
				this.chooseProjectDirectory()
			}
		},
	},
	methods: {
		chooseProjectDirectory() {
			const projectData = ipcRenderer.sendSync('select-project-directory')
			if (projectData) {
				this.$store.dispatch('PROJECT_LOAD_FROM_FILESYSTEM', projectData)
			}
		},
		beginSession() {
			this.loading = true
			this.$store.dispatch('SESSION_POPULATE').then(() => {
				this.loading = false
				this.$router.push({
					name: 'image',
					params: {groupIndex: 0, questionIndex: 0},
				})
			})
		},
	},
	created() {
		if (!this.hasProject) {
			this.chooseProjectDirectory()
		}
	},
}

</script>


<style lang="scss" scoped>

.index-page {
	width: 100%;
	height: 100vh;

	display: flex;
	align-items: center;
	justify-content: center;

	form {
		padding-bottom: 10vh;	// Add padding for visual compensation.

		> .field {
			margin-top: 2rem;
			margin-bottom: 2rem;
			justify-content: center;

			.is-expanded > .button {
				width: 100%;
			}
		}

		.field-label {
			flex-grow: 0;
			white-space: nowrap;

			label {
				line-height: 225%;
			}
		}
	}
}

</style>
