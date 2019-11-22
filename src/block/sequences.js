import 'animejs';

const { anime } = window;

const fadeIn = ( options ) => {
	return anime( {
		targets: '.letter',
		opacity: [ 0, 1 ],
		easing: 'linear',
		duration: 1250,
		...options,
	} );
};

const fadeInStagger = ( options ) => {
	return anime.timeline( options )
		.add( {
			targets: '.letter',
			opacity: [ 0, 1 ],
			easing: 'easeInOutQuad',
			duration: 1250,
			delay: ( el, i ) => 50 * ( i + 1 ),
		} );
};

const staggerUp = ( options ) => {
	return anime.timeline( options ).add( {
		targets: '.letter',
		opacity: [ 0, 1 ],
		translateY: [ '100%', 0 ],
		translateZ: 0,
		duration: 750,
		delay: ( el, i ) => 50 * i,
	} );
};

const sequences = {
	fadeIn,
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
