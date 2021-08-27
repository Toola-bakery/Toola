import { MenuItem, Switch } from '@blueprintjs/core';
import React from 'react';
import { BasicItemProps } from '../InspectorItem';
import { MenuItemWithInput } from '../MenuItemWithInput';

export type SwitchMenuItemProps = BasicItemProps & {
	type: 'switch';
	value: boolean;
	onChange: (nextValue: boolean) => void;
};

export function SwitchMenuItem({
	item,
	Wrapper = MenuItem,
}: {
	item: SwitchMenuItemProps;
	Wrapper?: typeof React.Component | React.FC<any>;
}) {
	return (
		<Wrapper
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
