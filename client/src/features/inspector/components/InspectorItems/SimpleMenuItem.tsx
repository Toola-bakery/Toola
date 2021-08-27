import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import { BasicItemProps } from '../InspectorItem';

export type SimpleMenuItemProps = BasicItemProps & {
	type: undefined | 'item';
	call: () => void;
	closeAfterCall?: boolean;
};

export function SimpleMenuItem({
	item,
	close,
	Wrapper = MenuItem,
}: {
	item: SimpleMenuItemProps;
	close?: () => void;
	Wrapper?: typeof React.Component | React.FC<any>;
}) {
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
