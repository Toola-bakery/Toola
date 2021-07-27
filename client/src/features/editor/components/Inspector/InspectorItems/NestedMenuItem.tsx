import { Switch } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Blocks } from '../../../types/blocks';
import { BasicItemProps, MenuItemProps } from '../BlockInspector';

export type NestedMenuItemProps = BasicItemProps & {
	type: 'nested';
	next: MenuItemProps[];
};

export function NestedMenuItem({ item }: { item: NestedMenuItemProps }) {
	return (
		<MenuItem
			onClick={() => {
				// item.call?.();
			}}
		>
			<Typography variant="inherit">{item.key}</Typography>
		</MenuItem>
	);
}
