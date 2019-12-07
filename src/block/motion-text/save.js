import { supportedBlocks } from './utils';

const { addFilter } = wp.hooks;

const addMotionSaveContentProps = (saveElementProps, blockType, attributes) => {
	// Do nothing if it's another block than our defined ones.
	if (!supportedBlocks.includes(blockType.name)) {
		return saveElementProps;
	}
	const { motionType, delay } = attributes;
	const isMotionEnabled = motionType !== 'none';

	if (!isMotionEnabled) {
		return saveElementProps;
	}

	Object.assign(saveElementProps, {
		className: 'wp-block-motion-text-element',
		'data-motion-type': motionType,
		'data-motion-delay': delay,
	});

	return saveElementProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'extend-block-example/get-save-content-text',
	addMotionSaveContentProps,
);
