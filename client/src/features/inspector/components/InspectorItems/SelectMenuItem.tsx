import { MenuItem } from '@blueprintjs/core';
import React from 'react';
import { SimpleSelect } from '../../../ui/components/SimpleSelect';
import { BasicItemProps } from '../InspectorItem';

export type SelectMenuItemProps = BasicItemProps & {
	type: 'select';
	options: { name: string; value: string }[] | string[];
	value: string;
	onChange: (v: string) => void;
};

export function SelectMenuItem({
	item,
	Wrapper = MenuItem,
	inline,
}: {
	item: SelectMenuItemProps;
	Wrapper?: typeof React.Component | React.FC<any>;
	inline?: boolean;
}) {
	return (
		<Wrapper
			shouldDismissPopover={false}
			icon={item.icon}
			text={
				<SimpleSelect
					inline={inline}
					options={item.options.map((option) =>
						typeof option === 'string'
							? option
							: {
									label: option.name,
									value: option.value,
							  },
					)}
					label={item.label}
					fill
					value={item.value}
					onChange={(v) => item.onChange(v.target.value)}
				/>
			}
		/>
	);
}
