<template>

<div class="root">
	<div v-for="value in values" class="bar"
			v-bind:style="getColumnStyle(value)">
	</div>
</div>

</template>


<script>

export default {
	props: ['values'],
	methods: {
		getColumnStyle(value) {
			const height = value * value / 65536
			return `height: ${height * 100}%;`
		},
	},
}

</script>


<style lang="scss" scoped>

.root {
	height: 100%;
	display: flex;
	align-items: center;
}
.bar {
	flex: 1;
	background-color: #aaa;
}

</style>
