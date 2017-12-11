<template>

<main class="page-content">

	<h1 class="title">作答記錄</h1>

	<nav class="breadcrumb" aria-label="breadcrumbs">
		<ul>
			<li><router-link v-bind:to="{name: 'index'}">首頁</router-link></li>
			<li class="is-active"><a href="#" aria-current="page">作答記錄</a></li>
		</ul>
	</nav>

	<table class="table is-fullwidth is-striped">
		<thead>
			<th class="is-nowrap is-narrow">作答時間</th>
			<th>筆記</th>
			<th></th>
		</thead>
		<tbody>
			<tr v-for="(result, i) in reversedResults">
				<td class="is-nowrap">
					{{ result.timestamp.format('YYYY-MM-DD HH:mm:ss') }}
				</td>
				<td class="result-message">{{ result.message }}</td>
				<td class="is-nowrap is-narrow">
					<router-link class="button"
							v-bind:to="{name: 'result-detail', params: {name: result.name}}">
						詳細
					</router-link>
				</td>
			</tr>
		</tbody>
	</table>

</main>

</template>


<script>

export default {
	props: ['results'],
	computed: {
		reversedResults() {
			return this.results.slice().reverse()
		},
	}
}

</script>


<style scoped>

.result-message {
	white-space: pre-wrap;
	word-wrap: break-word;
}

</style>
