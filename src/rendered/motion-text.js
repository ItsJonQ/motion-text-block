import anime from 'animejs';
import { createSequence } from '../shared/sequences';

const { IntersectionObserver } = window;

function getDomNodes() {
	return Array.from(
		document.querySelectorAll('.wp-block-motion-text-element'),
	);
}

function setInitialStyles(node) {
	node.style.opacity = 0;
}

function isSplitLetter(motionType = '') {
	const type = motionType.toLowerCase();
	return type.indexOf('stagger') >= 0 || type.indexOf('glitch') >= 0;
}

function createObserverForNodes(nodes) {
	if ('IntersectionObserver' in window) {
		// IntersectionObserver Supported
		const config = {
			root: null,
			rootMargin: '0px 0px -100px 0px',
			threshold: 0.5,
		};

		const observer = new IntersectionObserver(onChange, config);
		nodes.forEach(node => observer.observe(node));

		function onChange(changes, innerObserver) {
			changes.forEach(change => {
				if (change.intersectionRatio > 0) {
					loadAnimation(change.target);
					innerObserver.unobserve(change.target);
				}
			});
		}

		return observer;
	}

	return null;
}

function loadAnimation(node) {
	const motionType = node.getAttribute('data-motion-type');
	const delay = parseInt(node.getAttribute('data-motion-delay'), 10) || 0;
	const shouldSplit = isSplitLetter(motionType);

	if (shouldSplit) {
		node.innerHTML = node.textContent.replace(
			/\S/g,
			"<span class='letter'>$&</span>",
		);
		anime({
			targets: node,
			opacity: [0, 1],
			duration: 200,
			easing: 'linear',
			delay,
		});
	}

	const animationSequence = createSequence(motionType);

	if (animationSequence) {
		setTimeout(() => {
			animationSequence({ ref: node });
		}, delay);
	}
}

function initializeMotionText() {
	const nodes = getDomNodes();
	nodes.forEach(setInitialStyles);

	createObserverForNodes(nodes);
}

initializeMotionText();
