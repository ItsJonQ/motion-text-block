(function() {
	const { anime, IntersectionObserver } = window;

	const getLetters = ref => ref.querySelectorAll('.letter');
	const isSplitLetter = (motionType = '') => {
		return motionType.toLowerCase().indexOf('stagger') >= 0;
	};

	const fadeUp = ({ ref, ...options }) => {
		return anime({
			targets: ref,
			opacity: [0, 1],
			translateY: ['20%', 0],
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
		staggerUp,
	};

	function createSequence(name) {
		const animation = sequences[name];
		return (options = {}) => {
			if (!animation) {
				return null;
			}

			const defaultOptions = {
				loop: false,
			};
			const mergedOptions = Object.assign({}, defaultOptions, options);
			animation(mergedOptions);
		};
	}

	const nodes = Array.from(
		document.querySelectorAll('.wp-block-motion-text-element'),
	);

	nodes.forEach(node => {
		node.style.opacity = 0;
	});

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
})();
