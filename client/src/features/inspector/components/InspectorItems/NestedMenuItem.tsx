import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import { MenuItemProps, BasicItemProps, InspectorItemProps } from '../InspectorItem';

export type NestedMenuItemProps = BasicItemProps & {
	type: 'nested';
	next: MenuItemProps[];
};

export function NestedMenuItem({ item, setPath, Wrapper = MenuItem }: InspectorItemProps<NestedMenuItemProps>) {
	return (
		<Wrapper
			shouldDismissPopover={false}
			icon={item.icon}
			onClick={() => {
				setPath?.((path) => [...path, item.label]);
			}}
			text={item.label}
		/>
	);
}
