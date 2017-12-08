<template>

<main class="page-content">

	<h1 class="title">問題一覽</h1>

	<nav class="breadcrumb" aria-label="breadcrumbs">
		<ul>
			<li><router-link v-bind:to="{name: 'index'}">首頁</router-link></li>
			<li class="is-active"><a href="#" aria-current="page">問題一覽</a></li>
		</ul>
	</nav>

	<div class="question box" v-for="question in questions">
		<h3>
			<span>{{ question.name }}</span>
			<span>
				<audio controls="controls" controlsList="nodownload">
					<source v-bind:src="question.getAssetUrl(question.readthrough)">
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
