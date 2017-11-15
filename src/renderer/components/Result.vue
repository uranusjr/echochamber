<template>

<div class="page-content">
	<h1 class="title">結果</h1>

	<table class="table">
		<thead>
			<tr>
				<th>題目</th>
				<th>選擇</th>
				<th>用時</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="answer in result">
				<th>{{ answer.question.name }}</th>
				<td>
					<div class="box">
						<img v-bind:src="answer.question.getAssetUrl(answer.choice)">
					</div>
				</td>
				<td>{{ answer.usedMs / 1000.0 }} 秒</td>
			</tr>
		</tbody>
	</table>
</div>

</template>


<script>

export default {
	props: ['result'],
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
</style>
