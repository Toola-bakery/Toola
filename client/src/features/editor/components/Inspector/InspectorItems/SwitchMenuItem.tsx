import { ListItem, Switch } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Blocks } from '../../../types/blocks';
import { BasicItemProps } from '../BlockInspector';
import { SimpleMenuItemProps } from './SimpleMenuItem';

export type SwitchMenuItemProps = BasicItemProps & {
	type: 'switch';
	value: boolean;
	call: () => void;
};

export function SwitchMenuItem({ item }: { item: SwitchMenuItemProps }) {
	return (
		<ListItem
			button
			onClick={() => {
				item.call();
			}}
		>
			<Typography variant="inherit">{item.label}</Typography>

			<ListItemSecondaryAction>
				<Switch checked={item.value} />
			</ListItemSecondaryAction>
		</ListItem>
	);
}
