import { Button, ButtonGroup, MenuItem, Switch } from '@blueprintjs/core';
import React from 'react';
import { BasicItemProps, InspectorItemProps } from '../InspectorItem';

export type TextAlignItemProps = BasicItemProps & {
	type: 'textAlign';
	value?: 'left' | 'right' | 'center';
	onChange: (nextValue: 'left' | 'right' | 'center') => void;
};

export function TextAlignMenuItem({ item, Wrapper = MenuItem, inline }: InspectorItemProps<TextAlignItemProps>) {
	return (
		<Wrapper
			inline={inline}
			shouldDismissPopover={false}
			icon={item.icon}
			text={item.label}
			labelElement={
				<ButtonGroup>
					<Button icon="align-left" active={item.value === 'left'} onClick={() => item.onChange('left')} />
					<Button icon="align-center" active={item.value === 'center'} onClick={() => item.onChange('center')} />
					<Button icon="align-right" active={item.value === 'right'} onClick={() => item.onChange('right')} />
				</ButtonGroup>
			}
		/>
	);
}
