<template>

<main class="page-content">

	<h1 class="title">結果</h1>

	<nav v-if="administration" class="breadcrumb" aria-label="breadcrumbs">
		<ul>
			<li><router-link v-bind:to="{name: 'index'}">首頁</router-link></li>
			<li><router-link v-bind:to="{name: 'result-list'}">作答記錄</router-link></li>
			<li class="is-active">
				<a href="#" aria-current="page">
					{{ result.timestamp.format('YYYY-MM-DD HH:mm:ss') }}
				</a>
			</li>
		</ul>
	</nav>

	<form v-on:submit.prevent="saveResult">

		<table v-if="administration" class="table is-fullwidth">
			<thead>
				<tr>
					<th class="is-nowrap">題目</th>
					<th class="is-nowrap">選擇</th>
					<th class="is-nowrap">聽力資訊</th>
					<th class="is-nowrap">復述</th>
				</tr>
			</thead>
			<tbody>
				<template v-for="group in result.groups">
				<tr v-for="answer in group">
					<th class="is-nowrap">{{ answer.question.name }}</th>
					<td>
						<image-box v-bind:src="result.getImageChoice(answer)"></image-box>
					</td>
					<td class="is-nowrap" v-html="getChoiceStatsDisplay(answer)"></td>
					<td>
						<audio controls="controls">
							<source v-bind:src="result.getAudio(answer)">
						</audio>
					</td>
				</tr>
				</template>
			</tbody>
		</table>

		<p v-if="!administration" class="field">
			感謝作答。請按「儲存」結束答題程序。
		</p>

		<div class="field is-grouped">
			<div class="control">
				<button type="submit" v-bind:class="submitClass">儲存</button>
			</div>
		</div>

	</form>

</main>

</template>


<script>

export default {
	props: ['administration', 'result'],
	data() {
		return {
			saving: false,
		}
	},
	computed: {
		submitClass() {
			return {
				'button': true,
				'is-large': true,
				'is-primary': true,
				'is-loading': this.saving,
			}
		},
	},
	methods: {
		getChoiceStatsDisplay(answer) {
			const stats = answer.image.msDiffs
			const secs = stats[0] / 1000.0
			return (
				`<p>播放 <strong>${stats.length}</strong> 次</p>` +
				`<p>用時 <strong>${secs.toFixed(3)}</strong> 秒</p>`
			)
		},
		saveResult() {
			this.saving = true
			this.$store.dispatch('PROJECT_SAVE_RESULT', this.result).then(() => {
				this.saving = false
				this.$router.push({name: 'index'})
			}).catch(e => {
				console.error(e)
				this.saving = false
			})
		},
	},
}

</script>


<style lang="scss" scoped>
.table {
	margin: auto;

	th, td {
		padding: 0.75rem 2rem;
		vertical-align: middle;

		&:not(.field) {
			text-align: center;
		}

		.box {
			max-width: 33vw;
		}
	}
}
</style>
