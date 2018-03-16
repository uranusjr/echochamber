<template>

<div class="has-text-centered">
	<span v-bind:class="{'icon': 1, 'is-large': _large}">
		<span v-bind:class="fac"></span>
	</span>
</div>

</template>


<script>

export default {
	props: {
		size: {
			type: Number,
			default: 2,
			validator: v => [1, 2, 3].includes(v),
		},
		large: {
			type: Boolean,
			default: null,
		},
	},
	computed: {
		fac: function () {
			return ['fa', 'fa-circle-o-notch', 'fa-spin', `fa-${this.size}x`]
		},
		_large: function () {
			return this.large === null ? (this.size !== 1) : this.large
		},
	},
}

</script>
