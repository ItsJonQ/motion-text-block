import anime from 'animejs';

const getLetters = ref => ref.querySelectorAll('.letter');

const fadeUp = ({ ref, ...options }) => {
	return anime({
		targets: ref,
		opacity: [0, 1],
		translateY: ['100%', 0],
		duration: 1250,
		...options,
	});
};

const fadeIn = ({ ref, ...options }) => {
	return anime({
		targets: ref,
		opacity: [0, 1],
		easing: 'linear',
		duration: 1250,
		...options,
	});
};

const fadeInStagger = ({ ref, ...options }) => {
	return anime.timeline(options).add({
		targets: getLetters(ref),
		opacity: [0, 1],
		easing: 'easeInOutQuad',
		duration: 1250,
		delay: (el, i) => 50 * (i + 1),
	});
};

const glitched = ({ ref, ...options }) => {
	const glitches = '`¡™£¢∞§¶•ªº–≠åß∂ƒ©˙∆˚¬…æ≈ç√∫˜µ≤≥÷/?░▒▓<>/'.split('');
	const originalRef = ref.cloneNode(true);
	const duration = 1250;
	const originalLettersRef = Array.from(getLetters(originalRef));
	const originalLetters = originalLettersRef.map(n => n.innerText);

	const getChar = () => {
		const min = 0;
		const max = glitches.length - 1;
		const index = Math.floor(Math.random() * (max - min + 1)) + min;
		const isGlitched = Math.random() >= 0.5;
		const source = isGlitched ? glitches : originalLetters;

		return source[index];
	};

	return anime({
		targets: getLetters(ref),
		update: function(anim) {
			anim.animatables.forEach((ax, index) => {
				ax.target.innerText = getChar();
			});
		},
		complete: function(anim) {
			anim.animatables.forEach((ax, index) => {
				ax.target.innerText = originalLettersRef[index].innerText;
			});
		},
		loop: 1,
		opacity: [1, 1],
		duration,
		easing: 'linear',
		...options,
	});
};

const staggerUp = ({ ref, ...options }) => {
	return anime.timeline(options).add({
		targets: getLetters(ref),
		opacity: [0, 1],
		translateY: ['100%', 0],
		translateZ: 0,
		duration: 750,
		delay: (el, i) => 50 * i,
	});
};

const sequences = {
	fadeIn,
	fadeUp,
	fadeInStagger,
	glitched,
	staggerUp,
};

export function createSequence(name) {
	const animation = sequences[name];
	return (options = {}) => {
		if (!animation) {
			return null;
		}

		const defaultOptions = {
			loop: false,
		};
		const mergedOptions = Object.assign({}, defaultOptions, options);

		return animation(mergedOptions);
	};
}

export const createMotion = createSequence;
