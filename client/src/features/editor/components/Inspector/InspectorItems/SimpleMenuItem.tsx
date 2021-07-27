import { ListItem, Switch } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Blocks } from '../../../types/blocks';
import { BasicItemProps, MenuItemProps } from '../BlockInspector';

export type SimpleMenuItemProps = BasicItemProps & {
	type: undefined | 'item';
	call: () => void;
	closeAfterCall?: boolean;
};

export function SimpleMenuItem({ item, close }: { item: SimpleMenuItemProps; close: () => void }) {
	return (
		<ListItem
			button
			onClick={() => {
				item.call();
				if (item.closeAfterCall) close();
			}}
		>
			<Typography variant="inherit">{item.label}</Typography>
		</ListItem>
	);
}
