/**
 * External dependencies
 */
import styled from 'styled-components';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import { Outline, Primary } from '../button';

const Head = styled.header`
	background-color: ${ ( { theme } ) => theme.colors.bg.v3 };
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Title = styled.h1`
	color: ${ ( { theme } ) => theme.colors.fg.v1 };
	margin: 0;
	font-size: 19px;
	line-height: 20px;
`;

const ButtonList = styled.nav`
	background-color: ${ ( { theme } ) => theme.colors.bg.v3 };
	display: flex;
	justify-content: flex-end;
	padding: 1em;
	height: 100%;

	button {
		margin-left: 1em;
	}
`;

function Header() {
	return (
		<Head>
			<Title>
				{ __( 'New story (click to edit title)' ) }
			</Title>
		</Head>
	);
}
function Buttons() {
	return (
		<ButtonList>
			<Outline>
				{ __( 'Preview' ) }
			</Outline>
			<Primary>
				{ __( 'Publish' ) }
			</Primary>
		</ButtonList>
	);
}

export default Header;

export { Buttons };