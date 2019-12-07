import { motionControlTypeOptions, previewMotion } from '../motion';
import { supportedBlocks } from './utils';

const { __ } = wp.i18n;
const { addFilter } = wp.hooks;

const { createHigherOrderComponent } = wp.compose;
const { Fragment, useState, createRef } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { Button, PanelBody, SelectControl } = wp.components;

/**
 * Create HOC to add motion control to inspector controls of block.
 */
const withMotionControls = createHigherOrderComponent(BlockEdit => {
	return props => {
		const ref = createRef(null);
		const [isPreviewing, setPreviewing] = useState(false);

		// Do nothing if it's another block than our defined ones.
		if (!supportedBlocks.includes(props.name)) {
			return <BlockEdit {...props} />;
		}

		const { motionType } = props.attributes;
		const isMotionEnabled = motionType !== 'none';

		const handleOnStart = () => setPreviewing(true);
		const handleOnComplete = () => setPreviewing(false);

		const handlePreviewMotion = () => {
			previewMotion({
				motionType,
				ref: ref.current,
				onStart: handleOnStart,
				onComplete: handleOnComplete,
				selector: '[data-type="core/column"]',
			});
		};

		const handleOnChangeMotion = selectedMotionType => {
			props.setAttributes({
				motionType: selectedMotionType,
			});

			previewMotion({
				motionType: selectedMotionType,
				ref: ref.current,
				onStart: handleOnStart,
				onComplete: handleOnComplete,
			});
		};

		return (
			<Fragment>
				<div ref={ref}>
					<BlockEdit {...props} />
				</div>
				<InspectorControls>
					<PanelBody
						title={__('Motion')}
						initialOpen={isMotionEnabled}
					>
						<SelectControl
							label={__('Animation')}
							value={motionType}
							options={motionControlTypeOptions}
							onChange={handleOnChangeMotion}
							disabled={isPreviewing}
						/>
						{isMotionEnabled ? (
							<Button
								isDefault
								onClick={handlePreviewMotion}
								disabled={isPreviewing}
							>
								{isPreviewing ? 'Previewing...' : 'Preview'}
							</Button>
						) : null}
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	};
}, 'withMotionControls');

addFilter(
	'editor.BlockEdit',
	'extend-block-example/with-motion-control-group',
	withMotionControls,
);
