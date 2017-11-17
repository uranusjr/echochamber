<template>

<div>

	<nav class="navbar is-dark" role="navigation" aria-label="main navigation">
		<div class="navbar-content">
			<div class="navbar-brand">
				<router-link v-bind:to="{name: 'index'}" class="navbar-item">
					回首頁
				</router-link>
			</div>
		</div>
	</nav>

	<main class="page-content">

		<h1 class="title">問題一覽</h1>

		<div class="question box" v-for="question in questions">
			<h3>
				<span>{{ question.name }}</span>
				<span>
					<audio controls="controls" controlsList="nodownload">
						<!-- TODO: Allow more formats? -->
						<source type="audio/mp3"
								v-bind:src="question.getAssetUrl(question.readthrough)">
					</audio>
				</span>
			</h3>
			<div class="columns is-multiline">
				<div class="column" v-for="imageName in question.images">
					<image-box v-bind:src="question.getAssetUrl(imageName)"></image-box>
				</div>
			</div>
		</div>

	</main>

</div>

</template>


<script>

export default {
	props: ['questions'],
}

</script>


<style lang="scss" scoped>

main {
	margin-bottom: 80px;
}
.question {

	h3 {
		font-size: 24px;
		font-weight: bold;
	}
	audio {
		float: right;
		vertical-align: -8px;
	}
	.columns {
		margin-top: 4px;
	}
	.column {
		padding: 16px;
	}
}

</style>
