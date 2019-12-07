import { createAddControlAttributes } from '../motion';
import { supportedBlocks } from './utils';

const { addFilter } = wp.hooks;

const addMotionControlAttribute = createAddControlAttributes(supportedBlocks);

addFilter(
	'blocks.registerBlockType',
	'extend-block-example/attribute/motion-text',
	addMotionControlAttribute,
);
