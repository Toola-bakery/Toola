import MenuItem from '@material-ui/core/MenuItem';
import React from 'react';
import { BasicItemProps } from '../BlockInspector';
import { CodeInput } from '../CodeInput';

export type InputMenuItemProps = BasicItemProps & {
	type: 'input';
	value: string;
	onChange: (v: string) => void;
};

export function InputMenuItem({ item }: { item: InputMenuItemProps }) {
	return (
		<MenuItem>
			<CodeInput label={item.key} value={item.value} onChange={item.onChange} />
		</MenuItem>
	);
}
