import 'animejs';

const { anime } = window;

const getLetters = ref => ref.querySelectorAll( '.letter' );

const fadeUp = ( { ref, ...options } ) => {
	return anime( {
		targets: ref,
		opacity: [ 0, 1 ],
		translateY: [ '100%', 0 ],
		duration: 1250,
		...options,
	} );
};

const fadeIn = ( { ref, ...options } ) => {
	return anime( {
		targets: ref,
		opacity: [ 0, 1 ],
		easing: 'linear',
		duration: 1250,
		...options,
	} );
};

const fadeInStagger = ( { ref, ...options } ) => {
	return anime.timeline( options )
		.add( {
			targets: getLetters( ref ),
			opacity: [ 0, 1 ],
			easing: 'easeInOutQuad',
			duration: 1250,
			delay: ( el, i ) => 50 * ( i + 1 ),
		} );
};

const staggerUp = ( { ref, ...options } ) => {
	return anime.timeline( options ).add( {
		targets: getLetters( ref ),
		opacity: [ 0, 1 ],
		translateY: [ '100%', 0 ],
		translateZ: 0,
		duration: 750,
		delay: ( el, i ) => 50 * i,
	} );
};

const sequences = {
	fadeIn,
	fadeUp,
	fadeInStagger,
	staggerUp,
};

export function createSequence( name ) {
	const animation = sequences[ name ];
	return ( options = {} ) => {
		if ( ! animation ) {
			return null;
		}

		const defaultOptions = {
			loop: false,
		};
		const mergedOptions = Object.assign( {}, defaultOptions, options );
		animation( mergedOptions );
	};
}

export const createMotion = createSequence;
