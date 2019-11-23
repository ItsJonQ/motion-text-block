import { motionControlTypeOptions, previewMotion } from '../motion';
import { supportedBlocks } from './utils';

const { __ } = wp.i18n;
const { addFilter } = wp.hooks;

const { createHigherOrderComponent } = wp.compose;
const { Fragment, useState, createRef } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { Button, PanelBody, RangeControl, SelectControl } = wp.components;

/**
 * Create HOC to add motion control to inspector controls of block.
 */
const withMotionControls = createHigherOrderComponent( ( BlockEdit ) => {
	return ( props ) => {
		const ref = createRef( null );
		const [ isPreviewing, setPreviewing ] = useState( false );

		// Do nothing if it's another block than our defined ones.
		if ( ! supportedBlocks.includes( props.name ) ) {
			return <BlockEdit { ...props } />;
		}

		const { setAttributes } = props;
		const { motionType, delay } = props.attributes;
		const isMotionEnabled = motionType !== 'none';

		const handleOnStart = () => setPreviewing( true );
		const handleOnComplete = () => setPreviewing( false );

		const previewMotionType = ( activeMotionType = motionType ) => {
			previewMotion( {
				motionType: activeMotionType,
				ref: ref.current,
				onStart: handleOnStart,
				onComplete: handleOnComplete,
				options: {
					delay,
				},
			} );
		};

		const handlePreviewMotion = () => {
			previewMotionType( motionType );
		};

		const handleOnChangeMotion = ( selectedMotionType ) => {
			setAttributes( {
				motionType: selectedMotionType,
			} );

			previewMotionType( selectedMotionType );
		};

		const handleOnChangeDelay = ( newDelay ) => {
			setAttributes( { delay: newDelay } );
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
							disabled={ isPreviewing }
						/>
						{ isMotionEnabled ? (
							<Fragment>
								<div style={ { marginTop: -16, marginBottom: 20 } }>
									<Button
										isDefault
										onClick={ handlePreviewMotion }
										disabled={ isPreviewing }
									>
										{ isPreviewing ? 'Previewing...' : 'Preview' }
									</Button>
								</div>
								<RangeControl
									label="Animation Delay"
									value={ delay }
									onChange={ handleOnChangeDelay }
									min={ 0 }
									max={ 6000 }
									step={ 100 }
								/>
							</Fragment>
						) : null }

					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withMotionControls' );

addFilter(
	'editor.BlockEdit',
	'extend-block-example/with-motion-control-text',
	withMotionControls
);
