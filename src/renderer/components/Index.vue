<template>

<div class="index-page">

	<form v-on:submit.prevent="submit">
		<div class="field is-grouped">
			<div class="control">
				<router-link v-bind:to="{name: 'question-list'}" class="button">
					問題列表
				</router-link>
			</div>
			<div class="control">
				<router-link v-bind:to="{name: 'result-list'}" class="button">
					結果列表
				</router-link>
			</div>
		</div>
		<div class="submit field is-grouped">
			<div class="control">
				<button type="submit" v-bind:class="submitClass">開始作答</button>
			</div>
		</div>
	</form>

</div>

</template>


<script>

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
	},
	methods: {
		submit() {
			this.loading = true
			const data = {
				questions: this.$store.state.pool.questions,
				groupSize: 3,
			}
			this.$store.dispatch('SESSION_POPULATE', data).then(() => {
				this.loading = false
				this.$router.push({
					name: 'image',
					params: {groupIndex: 0, questionIndex: 0},
				})
			})
		},
	},
}

</script>


<style lang="scss">

.index-page {
	width: 100%;
	height: 100vh;

	display: flex;
	align-items: center;
	justify-content: center;

	form {
		padding-bottom: 10vh;	// Add padding for visual compensation.

		.submit.field {
			justify-content: center;
		}
	}
}

</style>
