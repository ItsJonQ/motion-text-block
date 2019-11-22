const { RichText } = wp.editor;

function MotionTextSave( { attributes } ) {
	const { content, tagName } = attributes;

	return (
		<div>
			<div className="wp-block-motion-text-element m16">
				<span className="wp-block-motion-text-element__wrapper">
					<RichText.Content
						className="wp-block-motion-text-element__letters letters"
						tagName={ tagName }
						value={ content }
					/>
				</span>
			</div>
		</div>
	);
}

export default MotionTextSave;
