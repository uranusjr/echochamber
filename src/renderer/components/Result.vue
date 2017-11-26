<template>

<main class="page-content">

	<h1 class="title">結果</h1>

	<nav v-if="canNavigate" class="breadcrumb" aria-label="breadcrumbs">
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

	<form v-on:submit.prevent="endSession">

		<table class="table is-fullwidth">
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
				<tr v-for="step in group">
					<th class="is-nowrap">{{ step.question.name }}</th>
					<td>
						<image-box v-bind:src="step.question.getAssetUrl(step.imageAnswer.choice)">
						</image-box>
					</td>
					<td class="is-nowrap">
						<p>播放 <strong>{{ step.imageAnswer.msDiffs.length }}</strong> 次</p>
						<p>用時 <strong>{{ step.imageAnswer.msDiffs[0] / 1000.0 }}</strong> 秒</p>
					</td>
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

		<div class="field">
			<label class="label">筆記</label>
			<div class="control">
				<textarea class="textarea" v-model="result.message"></textarea>
			</div>
			<p class="help">作答記錄的額外資訊，方便未來辨識本記錄。</p>
		</div>

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
	props: ['canNavigate', 'result'],
	data() {
		return {
			saving: false,
		}
	},
	computed: {
		submitClass() {
			return {
				'button': true,
				'is-primary': true,
				'is-loading': this.saving,
			}
		}
	},
	methods: {
		getBlobURL(blob) {
			return blob ? window.URL.createObjectURL(blob) : ''
		},
		endSession() {
			this.saving = true
			this.$store.dispatch('POOL_ADD_RESULT', this.result).then(() => {
				this.saving = false
				this.$router.push({name: 'index'})
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
		text-align: center;
		vertical-align: middle;

		.box {
			max-width: 33vw;
		}
	}
}
</style>
