import 'animejs';
import { createMotion } from './sequences';

const { __ } = wp.i18n;
const { addFilter } = wp.hooks;

const { createHigherOrderComponent } = wp.compose;
const { Fragment, useState, createRef } = wp.element;
const { InspectorControls } = wp.editor;
const { Button, PanelBody, SelectControl } = wp.components;

const { anime } = window;

const DEFAULT_MOTION = 'fadeUp';

function noop() {
	return undefined;
}

// Enable motion control on the following blocks
const enableMotionControlOnBlocks = [ 'core/heading', 'core/paragraph' ];

// Available motion control options
const motionControlTypeOptions = [
	{
		label: __( 'None' ),
		value: 'none',
	},
	{
		label: __( 'Fade Up' ),
		value: 'fadeUp',
	},
	{
		label: __( 'Stagger Up' ),
		value: 'staggerUp',
	},
];

/**
 * Add spacing control attribute to block.
 *
 * @param {object} settings Current block settings.
 * @param {string} name Name of block.
 *
 * @returns {object} Modified block settings.
 */
const addMotionControlAttribute = ( settings, name ) => {
	if ( ! enableMotionControlOnBlocks.includes( name ) ) {
		return settings;
	}

	// Use Lodash's assign to gracefully handle if attributes are undefined
	settings.attributes = Object.assign( settings.attributes, {
		motionType: {
			type: 'string',
			default: 'none',
		},
	} );

	return settings;
};

addFilter(
	'blocks.registerBlockType',
	'extend-block-example/attribute/motion',
	addMotionControlAttribute
);

/**
 * Create HOC to add motion control to inspector controls of block.
 */
const withMotionControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const ref = createRef( null );
		const [ isPreviewing, setPreviewing ] = useState( false );

		// Do nothing if it's another block than our defined ones.
		if ( ! enableMotionControlOnBlocks.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { motionType } = props.attributes;
		const isMotionEnabled = motionType !== 'none';

		const handleOnStart = () => setPreviewing( true );
		const handleOnComplete = () => setPreviewing( false );

		const handlePreviewMotion = () => {
			previewMotion( {
				motionType,
				ref: ref.current,
				onStart: handleOnStart,
				onComplete: handleOnComplete,
			} );
		};

		const handleOnChangeMotion = ( selectedMotionType ) => {
			props.setAttributes( {
				motionType: selectedMotionType,
			} );

			previewMotion( {
				motionType: selectedMotionType,
				ref: ref.current,
				onStart: handleOnStart,
				onComplete: handleOnComplete,
			} );
		};

		return (
			<Fragment>
				<div ref={ ref }>
					<BlockEdit { ...props } />
				</div>
				<InspectorControls>
					<PanelBody
						title={ __( 'Motion' ) }
						initialOpen={ isMotionEnabled }
					>
						<SelectControl
							label={ __( 'Animation' ) }
							value={ motionType }
							options={ motionControlTypeOptions }
							onChange={ handleOnChangeMotion }
							isDisabled={ isPreviewing }
						/>
						{ isMotionEnabled ? (
							<Button
								isDefault
								onClick={ handlePreviewMotion }
								isDisabled={ isPreviewing }
							>
								Preview
							</Button>
						) : null }
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withMotionControls' );

addFilter(
	'editor.BlockEdit',
	'extend-block-example/with-motion-control',
	withMotionControls
);

/**
 * Add margin style attribute to save element of block.
 */
const addMotionSaveContentProps = ( saveElementProps, blockType, attributes ) => {
	// Do nothing if it's another block than our defined ones.
	if ( ! enableMotionControlOnBlocks.includes( blockType.name ) ) {
		return saveElementProps;
	}
	const { motionType } = attributes;
	const isMotionEnabled = motionType !== 'none';

	if ( ! isMotionEnabled ) {
		return saveElementProps;
	}

	Object.assign( saveElementProps, {
		className: 'wp-block-motion-text-element',
		'data-motion-type': motionType,
	} );

	return saveElementProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'extend-block-example/get-save-content',
	addMotionSaveContentProps
);

function previewMotion( {
	ref = null,
	motionType = DEFAULT_MOTION,
	onStart = noop,
	onComplete = noop,
} ) {
	if ( ! ref ) {
		return;
	}

	onStart();

	const root = ref.querySelector( '[role="textbox"]' );
	const cloneNode = root.cloneNode( true );
	const node = document.createElement( 'div' );
	node.classList.add( 'wp-block-motion-text-element' );

	const animationSequence = createMotion( motionType );

	cloneNode.innerHTML = '';
	cloneNode.appendChild( node );

	node.innerHTML = root.innerText;
	node.innerHTML = node.textContent.replace(
		/\S/g,
		'<span class=\'letter\'>$&</span>'
	);

	root.style.display = 'none';
	root.parentNode.prepend( cloneNode );

	const onAnimationComplete = () => {
		root.style.display = 'block';
		root.style.opacity = 0;
		root.parentNode.removeChild( cloneNode );
		anime( {
			targets: root,
			opacity: [ 0, 1 ],
			easing: 'linear',
			duration: 500,
			complete: () => {
				onComplete( false );
			},
		} );
	};

	animationSequence( { loop: false, complete: onAnimationComplete, ref } );
}
