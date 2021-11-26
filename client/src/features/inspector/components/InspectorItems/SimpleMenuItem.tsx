import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';

export type SimpleMenuItemProps = BasicItemProps & {
	type: 'item';
	call: () => void;
	closeAfterCall?: boolean;
};

export function SimpleMenuItem({ item, close, Wrapper = MenuItem }: InspectorItemProps<SimpleMenuItemProps>) {
	return (
		<Wrapper
			shouldDismissPopover={false}
			icon={item.icon}
			onClick={() => {
				item.call();
				if (item.closeAfterCall && close) close();
			}}
			text={item.label}
		/>
	);
}
