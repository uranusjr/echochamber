<template>

<div class="page-content">

	<h1 class="title">
		第 {{ groupIndex + 1 }}-{{ questionIndex + 1 }} 題：念出符合圖片的描述
	</h1>
	<hr>
	<div class="tile is-ancestor">
		<div class="tile is-parent">
			<div class="tile is-child">
				<div class="box">
					<img v-bind:src="question.getAssetUrl(imageName)">
				</div>
			</div>
		</div>
		<div class="tile is-vertical is-parent">
			<div class="tile is-child control-tile">
				<span class="fa fa-stack fa-5x" v-on:click="toggleRecord()">
					<span class="fa fa-circle-thin fa-stack-2x"></span>
					<span v-bind:class="recorderIconClasses"></span>
				</span>
			</div>
			<div class="tile is-child">
				<wave-display v-if="recording" v-bind:values="waveBars">
				</wave-display>
				<div class="control-tile">
					<button v-if="audioBlob && !recording"
							type="button" class="button is-large is-primary"
							v-on:click="saveAudioBlob">
						送出
					</button>
				</div>
			</div>
		</div>
	</div>

</div>

</template>


<script>

import Recorder from 'recorder-js'

import WaveDisplay from './WaveDisplay'

export default {
	components: {
		WaveDisplay: WaveDisplay,
	},
	props: ['groupIndex', 'questionIndex', 'question', 'imageName', 'next'],
	data() {
		const audioContext = new window.AudioContext()
		const recorder = new Recorder(audioContext, {
			onAnalysed: ({data}) => { this.waveBars = data },
		})
		navigator.mediaDevices.getUserMedia({audio: true}).then(mstream => {
			recorder.init(mstream)
		}).catch(err => {
			// TODO: Do something better...
			window.alert(err.name + ': ' + err.message)
		})

		return {
			audioContext: audioContext,
			recorder: recorder,
			recording: false,
			waveBars: [],
			audioBlob: null,
		}
	},
	computed: {
		recorderIconClasses() {
			const cls = ['fa', 'fa-stack-1x']
			if (this.recording) {
				cls.push('fa-stop')
			} else {
				cls.push('fa-microphone')
			}
			return cls
		},
	},
	methods: {
		toggleRecord() {
			if (!this.recording) {
				this.recorder.start().then(() => {
					this.recording = true
				})
			} else {
				this.recorder.stop().then(data => {
					this.audioBlob = data.blob
					this.recording = false
				})
			}
		},
		saveAudioBlob() {
			this.$store.dispatch('SESSION_SET_AUDIO_ANSWER', {
				groupIndex: this.groupIndex,
				questionIndex: this.questionIndex,
				blob: this.audioBlob,
			})
			this.$router.push(this.next)
		},
	},
}

</script>


<style lang="scss" scoped>

.box {
	padding: 0;
}
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
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

</style>
