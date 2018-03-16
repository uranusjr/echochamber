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
			<th>受試代號</th>
			<th></th>
		</thead>
		<tbody>
			<tr v-for="(result, i) in reversedResults">
				<td class="is-nowrap">
					{{ result.timestamp.format('YYYY-MM-DD HH:mm:ss') }}
				</td>
				<td class="result-message">{{ result.subjectName }}</td>
				<td class="is-nowrap is-narrow">
					<router-link class="button"
							v-bind:to="{name: 'result-detail', params: {name: result.name}}">
						詳細
					</router-link>
				</td>
			</tr>
		</tbody>
	</table>

	<form v-if="reversedResults.length > 0">
		<div class="field is-grouped">
			<div class="control">
				<button type="button" class="button is-primary"
						v-on:click="exportExcel">
					匯出 Excel 檔案
				</button>
			</div>
		</div>
	</form>

</main>

</template>


<script>

import {ipcRenderer} from 'electron'
import _ from 'lodash'
import * as moment from 'moment'

export default {
	props: ['results'],
	computed: {
		reversedResults() {
			return this.results.slice().reverse()
		},
	},
	methods: {
		exportExcel() {
			const timestamp = moment().format('YYYYMMDD-HHmmss-SSS')
			ipcRenderer.on('export-excel-success', () => {
				// TODO...
			})
			ipcRenderer.send('export-excel', {
				filename: `${timestamp}.xlsx`,
				resultRowSets: _.map(this.results, r => r.exportRows()),
			})
		},
	},
}

</script>


<style scoped>

.result-message {
	white-space: pre-wrap;
	word-wrap: break-word;
}

</style>
