import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import { BasicItemProps } from '../InspectorItem';
import { CodeInput } from '../CodeInput';
import { MenuItemWithInput } from '../MenuItemWithInput';

export type InputMenuItemProps = BasicItemProps & {
	type: 'input';
	value: string;
	codeType?: 'string' | 'object';
	onChange: (v: string) => void;
};

export function InputMenuItem({
	item,
	Wrapper = MenuItem,
}: {
	item: InputMenuItemProps;
	Wrapper?: typeof React.Component | React.FC<any>;
}) {
	return (
		<Wrapper
			shouldDismissPopover={false}
			icon={item.icon}
			text={<CodeInput label={item.label} value={item.value} type={item.codeType} onChange={item.onChange} />}
		/>
	);
}
