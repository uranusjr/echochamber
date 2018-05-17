<template>

<div class="page-content">

	<h1 class="title">
		第 {{ groupIndex + 1 }}-{{ questionIndex + 1 }} 題：{{ helpText }}
	</h1>
	<hr>
	<div class="tile is-ancestor">
		<div class="tile is-parent">
			<div class="tile is-child">
				<image-box v-bind:src="question.getAssetUrl(imageName)"></image-box>
			</div>
		</div>
		<div class="tile is-vertical is-parent">
			<div class="tile is-child control-tile"
					v-if="recorder && !recording && !saving">
				<span class="fa fa-stack fa-5x"
						v-on:click="startRecord()">
					<span class="fa fa-circle-thin fa-stack-2x"></span>
					<span v-bind:class="recorderIconClass"></span>
				</span>
			</div>
			<div class="tile is-child">
				<wave-display v-if="recording" v-bind:values="waveBars">
				</wave-display>
			</div>
			<div class="tile is-child control-tile" v-if="recording || saving">
				<button type="button" v-bind:disabled="loading"
						v-bind:class="submitButtonClass" v-on:click="saveAudioBlob">
					送出
				</button>
			</div>
		</div>
	</div>

</div>

</template>


<script>

import * as moment from 'moment'
import Recorder from 'recorder-js'

export default {
	props: ['groupIndex', 'questionIndex', 'question', 'imageName', 'next'],
	data() {
		this.$store.dispatch('AUDIO_CONTEXT_ENSURE').then(() => {
			const recorder = new Recorder(this.$store.state.audio.context, {
				onAnalysed: ({data}) => { this.waveBars = data },
			})
			navigator.mediaDevices.getUserMedia({audio: true}).then(mstream => {
				recorder.init(mstream)
			}).catch(err => {
				// TODO: Do something better...
				window.alert(err.name + ': ' + err.message)
			})
			this.recorder = recorder
		})
		return {
			loading: false,
			saving: false,
			recorder: null,
			recording: false,
			waveBars: [],
			beginTime: moment(),
		}
	},
	watch: {
		recording(val) {
			if (val && !this.loading) {
				// Some quiet time for the button to avoid instant submit.
				this.loading = true
				setTimeout(() => { this.loading = false }, 1000)
			}
		},
	},
	computed: {
		recorderIconClass() {
			return {
				'fa': true,
				'fa-stack-1x': true,
				'fa-stop': this.recording,
				'fa-microphone': !this.recording,
			}
		},
		submitButtonClass() {
			return {
				'button': true,
				'is-large': true,
				'is-loading': this.saving,
				'is-primary': true,
			}
		},
		helpText() {
			if (this.recording) {
				return '念出符合圖片的描述'
			}
			return '按下麥克風按鈕開始錄音'
		}
	},
	methods: {
		startRecord() {
			if (!this.recording) {
				this.beginTime = moment()
				this.recorder.start().then(() => {
					this.recording = true
				})
			}
		},
		saveAudioBlob() {
			this.saving = true
			this.recorder.stop().then(data => {
				this.recording = false
				return this.$store.dispatch('SESSION_SET_AUDIO_ANSWER', {
					groupIndex: this.groupIndex,
					questionIndex: this.questionIndex,
					blob: data.blob,
					duration: moment().diff(this.beginTime) / 1000.0,
				})
			}).then(() => {
				this.saving = false
				this.$router.push(this.next)
			}).catch(err => {
				console.error(err)
				this.saving = false
			})
		},
	},
}

</script>


<style lang="scss" scoped>

.fa-microphone {
	font-size: 125%;
}
.control-tile > .fa {
	border: none;
	cursor: pointer;

	&:focus {
		outline: none;
	}
	&:hover {
		opacity: 0.75;
	}
}
.control-tile {
	display: flex;
	align-items: center;
	justify-content: center;
}

</style>
