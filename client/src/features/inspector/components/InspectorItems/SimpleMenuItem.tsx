import { ListItem } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { BasicItemProps } from '../InspectorItem';

export type SimpleMenuItemProps = BasicItemProps & {
	type: undefined | 'item';
	call: () => void;
	closeAfterCall?: boolean;
};

export function SimpleMenuItem({ item, close }: { item: SimpleMenuItemProps; close?: () => void }) {
	return (
		<ListItem
			button
			onClick={() => {
				item.call();
				if (item.closeAfterCall && close) close();
			}}
		>
			<Typography variant="inherit">{item.label}</Typography>
		</ListItem>
	);
}
