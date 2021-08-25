import { ListItem, Switch } from '@material-ui/core';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { BasicItemProps } from '../InspectorItem';

export type SwitchMenuItemProps = BasicItemProps & {
	type: 'switch';
	value: boolean;
	onChange: (nextValue: boolean) => void;
};

export function SwitchMenuItem({ item }: { item: SwitchMenuItemProps }) {
	return (
		<ListItem
			button
			onClick={() => {
				item.onChange(!item.value);
			}}
		>
			<Typography variant="inherit">{item.label}</Typography>

			<ListItemSecondaryAction>
				<Switch checked={item.value} />
			</ListItemSecondaryAction>
		</ListItem>
	);
}
