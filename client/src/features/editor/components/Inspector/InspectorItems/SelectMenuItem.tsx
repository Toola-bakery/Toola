import { FormControl, InputLabel, ListItem, Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import { BasicItemProps } from '../BlockInspector';

export type SelectMenuItemProps = BasicItemProps & {
	type: 'select';
	options: { name: string; value: string }[] | string[];
	value: string;
	onChange: (v: string) => void;
};

export function SelectMenuItem({ item }: { item: SelectMenuItemProps }) {
	return (
		<ListItem>
			<FormControl variant="outlined" sx={{ width: '100%' }}>
				<InputLabel>{item.label}</InputLabel>
				<Select value={item.value} onChange={(v) => item.onChange(v.target.value)}>
					{item.options.map((option) => (
						<MenuItem value={typeof option === 'string' ? option : option.value}>
							{typeof option === 'string' ? option : option.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</ListItem>
	);
}
