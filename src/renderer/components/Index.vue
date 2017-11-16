<template>

<div class="index-page">

	<form v-on:submit.prevent="submit">
		<button type="submit" v-bind:class="submitButtonClass">開始</button>
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
		submitButtonClass() {
			return {
				'button': true,
				'is-primary': true,
				'is-large': true,
				'is-loading': this.loading,
			}
		}
	},
	methods: {
		submit() {
			this.loading = true
			this.$store.dispatch('SESSION_POPULATE', {groupSize: 3}).then(() => {
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
	}
}

</style>
