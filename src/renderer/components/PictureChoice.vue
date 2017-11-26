<template>

<div class="page-content">

	<h1 class="title">
		<span>
			第 {{ groupIndex + 1 }}-{{ questionIndex + 1 }} 題：{{ helpText }}
		</span>
		<span v-bind:class="['icon', playing ? 'is-small' : '']"
				v-bind:disabled="playing" v-on:click="play()">
			<span v-bind:class="playIconClasses"></span>
		</span>
	</h1>
	<hr>
	<div class="columns is-multiline" v-if="beginTimes.length !== 0">
		<div class="column" v-for="imageName in question.images"
					v-on:click="choose(imageName)">
			<image-box class="choice" v-bind:src="question.getAssetUrl(imageName)">
			</image-box>
		</div>
	</div>

</div>

</template>


<script>

import _ from 'lodash'
import * as moment from 'moment'

export default {
	props: ['groupIndex', 'questionIndex', 'question', 'next'],
	data() {
		return {
			audio: this.createAudio(this.question),
			playing: false,
			beginTimes: [],
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
		helpText() {
			if (this.beginTimes.length) {
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
			this.beginTimes = []
			this.playing = false
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
			this.beginTimes.push(moment())
			this.audio.play()
		},
		choose(imageFilename) {
			const now = moment()
			this.$store.dispatch('SESSION_SET_IMAGE_ANSWER', {
				groupIndex: this.groupIndex,
				questionIndex: this.questionIndex,
				choice: imageFilename,
				msDiffs: _.map(this.beginTimes, t => now.diff(t)),
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

@import '~@/styles/variables';

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
.choice {
	cursor: pointer;

	&:hover {
		box-shadow: 0 2px 3px $grey-lighter, 0 0 0 1px $link;
	}
}

</style>
