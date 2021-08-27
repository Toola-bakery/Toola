import { FormGroup, HTMLSelect, OptionProps } from '@blueprintjs/core';
import React, { SelectHTMLAttributes } from 'react';

export type SimpleSelectProps = {
	fill?: boolean;
	label?: string;
	inline?: boolean;
	value?: string;
	options: (string | OptionProps)[];
	inputRef?: Exclude<React.Ref<HTMLSelectElement>, null>;
};

export function SimpleSelect({
	fill,
	label,
	inline,
	value,
	inputRef,
	options,
	...rest
}: SimpleSelectProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, keyof SimpleSelectProps | 'multiple'>) {
	return (
		<FormGroup label={label} inline={inline}>
			<HTMLSelect {...rest} value={value} fill={fill} ref={inputRef} options={options} />
		</FormGroup>
	);
}
