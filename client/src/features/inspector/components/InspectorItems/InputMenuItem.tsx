import { ListItem } from '@material-ui/core';
import React from 'react';
import { BasicItemProps } from '../InspectorItem';
import { CodeInput } from '../CodeInput';

export type InputMenuItemProps = BasicItemProps & {
	type: 'input';
	value: string;
	codeType?: 'string' | 'object';
	onChange: (v: string) => void;
};

export function InputMenuItem({ item }: { item: InputMenuItemProps }) {
	return (
		<ListItem>
			<CodeInput label={item.label} value={item.value} type={item.codeType} onChange={item.onChange} />
		</ListItem>
	);
}
