import anime from 'animejs';
import { createMotion } from '../shared/sequences';
import { noop } from './utils';

const { __ } = wp.i18n;

export const DEFAULT_MOTION = 'fadeUp';

// Available motion control options
export const motionControlTypeOptions = [
	{
		label: __('None'),
		value: 'none',
	},
	{
		label: __('Fade Up'),
		value: 'fadeUp',
	},
	{
		label: __('Stagger Up'),
		value: 'staggerUp',
	},
	{
		label: __('GLITCHED'),
		value: 'glitched',
	},
];

export function createAddControlAttributes(blocks) {
	return (settings, name) => {
		if (!blocks.includes(name)) {
			return settings;
		}

		// Use Lodash's assign to gracefully handle if attributes are undefined
		settings.attributes = Object.assign(settings.attributes, {
			motionType: {
				type: 'string',
				default: 'none',
			},
			delay: {
				type: 'number',
				default: 0,
			},
		});

		return settings;
	};
}

export function previewMotion({
	ref = null,
	motionType = DEFAULT_MOTION,
	onStart = noop,
	onComplete = noop,
	selector = '[role="textbox"]',
	options = {},
}) {
	if (!ref) {
		return;
	}

	onStart();

	const root = ref.querySelector(selector);

	const cloneNode = root.cloneNode(true);
	const node = document.createElement('div');
	node.classList.add('wp-block-motion-text-element');

	const animationSequence = createMotion(motionType);

	cloneNode.innerHTML = '';
	cloneNode.appendChild(node);

	node.innerHTML = root.innerText;
	node.innerHTML = node.textContent.replace(
		/\S/g,
		"<span class='letter'>$&</span>",
	);

	root.style.display = 'none';
	root.parentNode.prepend(cloneNode);

	const onAnimationComplete = () => {
		root.style.display = 'block';
		root.style.opacity = 0;
		root.parentNode.removeChild(cloneNode);

		anime({
			targets: root,
			opacity: [0, 1],
			easing: 'linear',
			duration: 500,
		});

		onComplete();
	};

	const { delay: delayOption, ...otherOptions } = options;
	const delay = delayOption || 0;

	ref.style.opacity = 0;

	anime({
		targets: ref,
		opacity: [0, 1],
		easing: 'linear',
		duration: 400,
		delay,
	});

	setTimeout(() => {
		const ax = animationSequence({
			ref,
			...otherOptions,
		});

		ax.finished.then(onAnimationComplete);
	}, delay);
}
