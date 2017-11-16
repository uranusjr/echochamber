<template>

<div class="page-content">
	<h1 class="title">結果</h1>

	<table class="table">
		<thead>
			<tr>
				<th class="is-nowrap">題目</th>
				<th class="is-nowrap">選擇</th>
				<th class="is-nowrap">用時</th>
				<th class="is-nowrap">復述</th>
			</tr>
		</thead>
		<tbody>
			<template v-for="group in groups">
			<tr v-for="step in group">
				<th class="is-nowrap">{{ step.question.name }}</th>
				<td>
					<div class="box">
						<img v-bind:src="step.question.getAssetUrl(step.imageAnswer.choice)">
					</div>
				</td>
				<td class="is-nowrap">{{ step.imageAnswer.usedMs / 1000.0 }} 秒</td>
				<td>
					<audio controls="controls">
						<source type="audio/wav"
								v-bind:src="getBlobURL(step.audioAnswer.blob)">
					</audio>
				</td>
			</tr>
			</template>
		</tbody>
	</table>
</div>

</template>


<script>

export default {
	props: ['groups'],
	methods: {
		getBlobURL(blob) {
			return window.URL.createObjectURL(blob)
		},
	},
}

</script>


<style lang="scss" scoped>
.table {
	margin: auto;

	th, td {
		padding: 0.75rem 2rem;
		text-align: center;
		vertical-align: middle;

		.box {
			max-width: 33vw;
			padding: 0;
		}
	}
}
.is-nowrap {
	white-space: nowrap;
}
</style>
