import { Switch } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Blocks } from '../../../types/blocks';
import { BasicItemProps, MenuItemProps } from '../BlockInspector';

export type SimpleMenuItemProps = BasicItemProps & {
	type: undefined | 'item';
	call: () => void;
};

export function SimpleMenuItem({ item }: { item: SimpleMenuItemProps }) {
	return (
		<MenuItem
			onClick={() => {
				item.call();
			}}
		>
			<Typography variant="inherit">{item.key}</Typography>
		</MenuItem>
	);
}
