import { ListItem } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { BasicItemProps, BlockInspectorProps, MenuItemProps } from '../BlockInspector';

export type NestedMenuItemProps = BasicItemProps & {
	type: 'nested';
	next: MenuItemProps[];
};

export function NestedMenuItem({
	item,
	setPath,
}: {
	item: NestedMenuItemProps;
	setPath: BlockInspectorProps['setPath'];
}) {
	return (
		<ListItem
			button
			onClick={() => {
				setPath((path) => [...path, item.label]);
			}}
		>
			<Typography variant="inherit">{item.label}</Typography>
		</ListItem>
	);
}
