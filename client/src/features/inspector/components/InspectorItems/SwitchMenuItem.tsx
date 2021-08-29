import { MenuItem, Switch } from '@blueprintjs/core';
import React from 'react';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';
import { MenuItemWithInput } from '../MenuItemWithInput';

export type SwitchMenuItemProps = BasicItemProps & {
	type: 'switch';
	value: boolean;
	onChange: (nextValue: boolean) => void;
};

export function SwitchMenuItem({ item, Wrapper = MenuItem, inline }: InspectorItemProps<SwitchMenuItemProps>) {
	return (
		<Wrapper
			inline={inline}
			shouldDismissPopover={false}
			icon={item.icon}
			onClick={() => {
				item.onChange(!item.value);
			}}
			text={item.label}
			labelElement={
				<Switch
					checked={item.value}
					onChange={() => {
						item.onChange(!item.value);
					}}
				/>
			}
		/>
	);
}
