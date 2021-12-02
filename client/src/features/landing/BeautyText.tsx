import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const BeautyStyles = styled.span`
	padding: 0 5px;
	background: linear-gradient(135deg, #6699ff 0%, #ff3366 100%);
	color: #b664b0;
	background-clip: text !important;
	-webkit-background-clip: text !important;
	-webkit-text-fill-color: transparent !important;
	-webkit-box-decoration-break: clone;
	box-decoration-break: clone;
	-moz-background-clip: text;
	-moz-text-fill-color: transparent;
	-ms-text-fill-color: transparent;
	-webkit-box-decoration-break: clone;
`;

export function BeautyText({
	children,
	...rest
}: PropsWithChildren<React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>>) {
	return (
		<BeautyStyles>
			<span {...rest}>{children}</span>
		</BeautyStyles>
	);
}
