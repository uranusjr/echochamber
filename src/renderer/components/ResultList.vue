<template>

<div>

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
							v-bind:disabled="loading" v-on:click="exportExcel">
						匯出檔案
					</button>
				</div>
			</div>
		</form>

	</main>

	<div class="modal is-active" v-if="loading">
		<div class="modal-background"></div>
		<loading-icon class="modal-content has-text-white" v-bind:size="3">
		</loading-icon>
	</div>

	<div class="modal is-active" v-if="message">
		<div class="modal-background"></div>
		<div class="modal-content">
			<article class="message">
				<div class="message-header">
					<p>{{ message.title }}</p>
					<button class="delete" aria-label="close" v-on:click="clearMessage">
					</button>
				</div>
				<div class="message-body">
					<p>{{ message.body }}</p>
				</div>
			</article>
		</div>
	</div>

</div>

</template>


<script>

import {ipcRenderer} from 'electron'
import _ from 'lodash'
import * as moment from 'moment'

export default {
	props: ['results'],
	data() {
		return {
			loading: false,
			message: null,
		}
	},
	computed: {
		reversedResults() {
			return this.results.slice().reverse()
		},
	},
	methods: {
		exportExcel() {
			if (this.loading) {
				return
			}
			const timestamp = moment().format('YYYYMMDD-HHmmss-SSS')
			ipcRenderer.on('export-excel-failure', () => {
				this.loading = false
			})
			ipcRenderer.on('export-excel-success', () => {
				this.loading = false
				this.message = {
					title: '匯出完成',
					body: `檔名：${timestamp}`,
				}
			})
			this.loading = true
			ipcRenderer.send('export-excel', {
				source: this.$store.state.project.source,
				basename: timestamp,
				resultSets: _.map(this.results, r => {
					return {
						subjectName: r.subjectName,
						rows: r.exportRows(),
						audioPathParts: r.getAudioPathParts(),
					}
				}),
			})
		},
		clearMessage() {
			this.message = null
		},
	},
}

</script>


<style scoped>

.result-message {
	white-space: pre-wrap;
	word-wrap: break-word;
}
.progress {
	color: white;
}

</style>
