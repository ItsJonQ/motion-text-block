import { createSequence } from './sequences';

const { anime } = window;
const { InspectorControls, RichText } = wp.editor;
const { Button, PanelBody, SelectControl } = wp.components;
const { createRef, useState } = wp.element;

function MotionTextEdit( { attributes, setAttributes } ) {
	const [ isDisabled, setDisabled ] = useState( false );
	const ref = createRef();
	const { content, sequence, tagName } = attributes;

	const onChange = ( nextContent ) => setAttributes( { content: nextContent } );

	const preview = ( sequenceName = sequence ) => {
		setDisabled( true );
		const root = ref.current.querySelector( '[role="textbox"]' );
		const cloneNode = root.cloneNode( true );
		const node = document.createElement( 'div' );
		node.classList.add( 'wp-block-motion-text-element__wrapper' );

		const animationSequence = createSequence( sequenceName );

		cloneNode.innerHTML = '';
		cloneNode.appendChild( node );

		node.innerHTML = root.innerText;
		node.innerHTML = node.textContent.replace(
			/\S/g,
			'<span class=\'letter\'>$&</span>'
		);

		root.style.display = 'none';
		root.parentNode.prepend( cloneNode );

		const onComplete = () => {
			root.style.display = 'block';
			root.style.opacity = 0;
			root.parentNode.removeChild( cloneNode );
			anime( {
				targets: root,
				opacity: [ 0, 1 ],
				easing: 'linear',
				duration: 500,
				complete: () => {
					setDisabled( false );
				},
			} );
		};

		animationSequence( { loop: false, complete: onComplete } );
	};

	return (
		<div className="wp-block-motion-text-group" ref={ ref }>
			<RichText
				className="wp-block-motion-text-element"
				tagName={ tagName || 'p' }
				value={ content }
				onChange={ onChange }
			/>
			<InspectorControls>
				<PanelBody title="Motion: Text">
					<SelectControl
						label={ 'Selector' }
						value={ tagName }
						onChange={ ( nextTagName ) => {
							setAttributes( { tagName: nextTagName } );
						} }
						options={ [
							{
								value: null,
								label: 'Choose a selector',
								disabled: true,
							},
							{ value: 'h1', label: 'Heading 1' },
							{ value: 'h2', label: 'Heading 2' },
							{ value: 'h3', label: 'Heading 3' },
							{ value: 'h4', label: 'Heading 4' },
							{ value: 'h5', label: 'Heading 5' },
							{ value: 'h6', label: 'Heading 6' },
							{ value: 'p', label: 'Paragraph' },
						] }
					/>
					<SelectControl
						label={ 'Animation' }
						value={ sequence }
						disabled={ isDisabled }
						onChange={ ( nextSequence ) => {
							setAttributes( { sequence: nextSequence } );
							preview( nextSequence );
						} }
						options={ [
							{
								value: null,
								label: 'Choose an animation',
								disabled: true,
							},
							{ value: 'fadeIn', label: 'Fade In' },
							{ value: 'fadeInStagger', label: 'Fade In Stagger' },
							{ value: 'staggerUp', label: 'Stagger Up' },
						] }
					/>
					<Button onClick={ () => preview() } isDefault disabled={ isDisabled }>
						{ isDisabled ? 'Previewing...' : 'Preview' }
					</Button>
				</PanelBody>
			</InspectorControls>
		</div>
	);
}

export default MotionTextEdit;
