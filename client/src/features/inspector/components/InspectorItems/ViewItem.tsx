import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';

export type ViewMenuItemProps = BasicItemProps & {
	type: 'view';
	next: React.FunctionComponent;
};

export function ViewMenuItem({ item, Wrapper = MenuItem, inline }: InspectorItemProps<ViewMenuItemProps>) {
	return (
		<Wrapper inline={inline} shouldDismissPopover={false} icon={item.icon} text={item.label} labelElement={item.next} />
	);
}
