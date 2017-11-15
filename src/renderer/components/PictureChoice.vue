<template>

<div class="page-content">

	<h1 class="title">
		<span>第 {{ index + 1 }} 題（共 {{ questionCount }} 題）</span>
		<span v-bind:class="['icon', playing ? 'is-small' : '']"
				v-bind:disabled="playing" v-on:click="play()">
			<span v-bind:class="playIconClasses"></span>
		</span>
	</h1>
	<hr>
	<div class="columns is-multiline" v-if="!!begin">
		<div class="column" v-for="image in images">
			<a href="#" class="choice box" v-on:click.prevent="choose(image)">
				<img v-bind:src="question.getAssetUrl(image)">
			</a>
		</div>
	</div>
	<p class="help">{{ helpText }}</p>
</div>

</template>


<script>

import * as moment from 'moment'

export default {
	props: ['index', 'questionCount', 'question', 'next'],
	data() {
		return {
			audio: this.createAudio(this.question),
			playing: false,
			begin: null,
		}
	},
	computed: {
		playIconClasses() {
			const cls = ['fa']
			if (this.playing) {
				cls.push('fa-circle-o-notch', 'fa-spin')
			} else {
				cls.push('fa-play-circle')
			}
			return cls
		},
		images() {
			return this.question.images
		},
		helpText() {
			if (this.begin) {
				return '點擊符合題目描述的圖片'
			}
			return '點擊按鈕播放題目'
		},
	},
	watch: {
		question: function () {
			this.audio.pause()
			this.audio = this.createAudio(this.question)
		},
		audio: function () {
			this.begin = null
		},
	},
	methods: {
		createAudio(q) {
			const audio = new Audio(q.getAssetUrl(q.readthrough))
			audio.addEventListener('play', () => {
				this.playing = true
			})
			audio.addEventListener('pause', () => {
				this.playing = false
			})
			return audio
		},
		play() {
			if (this.playing) {
				return
			}
			if (!this.begin) {
				this.begin = moment()
			}
			this.audio.play()
		},
		choose(imageFilename) {
			const diff = moment().diff(this.begin)
			this.$store.dispatch('addImageAnswer', {
				question: this.question,
				choice: imageFilename,
				usedMs: diff,
			})
			this.$router.push(this.next)
		},
	},
	beforeRouteLeave(to, from, next) {
		this.audio.pause()
		next()
	},
}

</script>


<style lang="scss" scoped>

.title {
	> *:not(:last-child) {
		margin-right: 1rem;
	}
	.icon {
		font-size: 90%;
		cursor: pointer;

		&:hover {
			opacity: 0.75;
		}
		&.is-small {
			font-size: 70%;
			padding-left: 8px;
			vertical-align: 2px;
		}
		&[disabled], &[disabled]:hover {
			cursor: wait;
			opacity: 0.5;
		}
	}
}
.columns {
	margin-top: 4px;
}
.column {
	padding: 16px;
}
.choice.box {
	padding: 0;
}

</style>
