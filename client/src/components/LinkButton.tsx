import React from 'react';
import styled from 'styled-components';

const StyledLinkButton = styled.button`
	color: #215db0;
	pointer-events: all;
	text-decoration: underline;
	background: transparent;
	font-family: inherit;
	font-size: inherit;
	font-weight: inherit;
	line-height: inherit;
	margin: 0;
	padding: 0;
	border: none;
	cursor: pointer;
`;

export function LinkButton({
	text,
	onClick,
	children,
}: {
	text?: React.ReactNode;
	children?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
	return (
		<StyledLinkButton type="button" onClick={onClick}>
			{text}
			{children}
		</StyledLinkButton>
	);
}
