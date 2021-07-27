import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { BasicItemProps } from '../BlockInspector';

export type ViewMenuItemProps = BasicItemProps & {
	type: 'view';
	next: React.FunctionComponent;
};

export function ViewMenuItem({ item }: { item: ViewMenuItemProps }) {
	return (
		<MenuItem onClick={() => {}}>
			<Typography variant="inherit">{item.label}</Typography>
		</MenuItem>
	);
}
