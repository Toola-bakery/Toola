import { Icon, IconName } from '@blueprintjs/core';
import * as React from 'react';
import { CSSProperties, PropsWithChildren, ReactNode } from 'react';
import styled from 'styled-components';

const DrawerMenuItemWrapper = styled.div`
	display: flex;
	align-items: center;
	padding-left: 14px;
	padding-right: 14px;

	&:hover,
	&.active {
		background-color: rgba(0, 0, 0, 0.1);
	}
	&:active {
		background-color: rgba(0, 0, 0, 0.15);
	}
`;

const MenuItemText = styled.div`
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

export function DrawerMenuItem({
	children,
	icon,
	iconStyle,
	height = 30,
	onClick,
	active,
}: PropsWithChildren<{
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	height?: number;
	active?: boolean;
	iconStyle?: CSSProperties;
	icon?: ReactNode | IconName;
}>) {
	return (
		<DrawerMenuItemWrapper onClick={onClick} className={active ? 'active' : ''} style={{ height, maxHeight: height }}>
			<div style={{ marginRight: 8, minWidth: 18, width: 18, textAlign: 'center' }}>
				{typeof icon === 'string' ? <Icon style={iconStyle} icon={icon as IconName} /> : null}
				{typeof icon === 'object' ? icon : null}
			</div>
			<MenuItemText>{children}</MenuItemText>
		</DrawerMenuItemWrapper>
	);
}
