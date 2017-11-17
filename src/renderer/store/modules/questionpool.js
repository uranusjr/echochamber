import {Question} from '@/models'


const state = {
	questions: [
		new Question({
			name: '題目一',
			images: ['2-1.jpg', '2-2.jpg', '2-3.jpg'],
			readthrough: 'EI_2.MP3',
		}),
		new Question({
			name: '題目二',
			images: ['4-1_updated.jpg', '4-2.jpg', '4-3.jpg'],
			readthrough: 'EI_4.MP3',
		}),
		new Question({
			name: '題目三',
			images: ['7-1.jpg', '7-2.jpg', '7-3.jpg'],
			readthrough: 'EI_CHI_male_004.mp3',
		}),
		new Question({
			name: '題目四',
			images: ['12-1_updated.jpg', '12-2_updaetd.jpg', '12-3_updated.jpg'],
			readthrough: 'EI_12.MP3',
		}),
		new Question({
			name: '題目五',
			images: ['15-1.jpg', '15-2.jpg', '15-3.jpg'],
			readthrough: 'EI_CHI_male_008.mp3',
		}),
		new Question({
			name: '題目六',
			images: ['6-1.jpg', '6-2jpg.jpg', '6-3.jpg'],
			readthrough: 'EI_6.MP3',
		}),
	],
}


export default {
	state: state,
}
