import { ListItem } from '@material-ui/core';
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
		<ListItem>
			<CodeInput label={item.label} value={item.value} onChange={item.onChange} />
		</ListItem>
	);
}
