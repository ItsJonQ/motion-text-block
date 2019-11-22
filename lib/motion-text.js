( function() {
	const { anime, IntersectionObserver } = window;

	const nodes = document.querySelectorAll(
		'.wp-block-motion-text-element .letters'
	);

	Array.from( nodes ).forEach( ( node ) => {
		node.innerHTML = node.textContent.replace(
			/\S/g,
			'<span class=\'letter\'>$&</span>'
		);
		node.style.opacity = 0;
	} );

	if ( 'IntersectionObserver' in window ) {
		// IntersectionObserver Supported
		const config = {
			root: null,
			rootMargin: '0px 0px -100px 0px',
			threshold: 0.5,
		};

		const observer = new IntersectionObserver( onChange, config );
		nodes.forEach( ( node ) => observer.observe( node ) );

		function onChange( changes, innerObserver ) {
			changes.forEach( ( change ) => {
				if ( change.intersectionRatio > 0 ) {
					loadAnimation( change.target );
					innerObserver.unobserve( change.target );
				}
			} );
		}
	}

	function loadAnimation( node ) {
		anime( {
			targets: node,
			opacity: [ 0, 1 ],
			duration: 200,
			easing: 'linear',
		} );
		anime.timeline().add( {
			targets: node.querySelectorAll( '.letter' ),
			translateY: [ '100%', 0 ],
			opacity: [ 0, 1 ],
			translateZ: 0,
			duration: 750,
			delay: ( el, i ) => 50 * i,
		} );
	}
}() );
