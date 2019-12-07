import { supportedBlocks } from './utils';

const { addFilter } = wp.hooks;

const addMotionSaveContentProps = (saveElementProps, blockType, attributes) => {
	// Do nothing if it's another block than our defined ones.
	if (!supportedBlocks.includes(blockType.name)) {
		return saveElementProps;
	}
	const { motionType } = attributes;
	const isMotionEnabled = motionType !== 'none';

	if (!isMotionEnabled) {
		return saveElementProps;
	}

	Object.assign(saveElementProps, {
		className: 'wp-block-motion-text-element',
		'data-motion-type': motionType,
	});

	return saveElementProps;
};

addFilter(
	'blocks.getSaveContent.extraProps',
	'extend-block-example/get-save-content-group',
	addMotionSaveContentProps,
);
