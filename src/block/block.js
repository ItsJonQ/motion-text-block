/**
 * BLOCK: motion-text-block
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import edit from './edit';
import save from './save';

//  Import CSS.
import './editor.scss';
import './style.scss';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks; // Import registerBlockType() from wp.blocks

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'cgb/block-motion-text-block', {
	title: __( 'Motion: Text Block' ),
	icon: 'shield',
	category: 'common',
	keywords: [
		__( 'motion' ),
		__( 'text' ),
		__( 'animation' ),
	],
	attributes: {
		tagName: {
			type: 'string',
			default: 'p',
		},
		sequence: {
			type: 'string',
			default: 'fadeIn',
		},
		content: {
			type: 'string',
			source: 'html',
			selector: 'h1,h2,h3,h4,h5,h6,p',
			default: '',
		},
	},
	edit,
	save,
} );
