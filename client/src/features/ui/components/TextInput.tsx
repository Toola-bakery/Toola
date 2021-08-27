import { FormGroup, InputGroup } from '@blueprintjs/core';
import React, { InputHTMLAttributes } from 'react';

export type TextInputProps = {
	fill?: boolean;
	label?: string;
	inline?: boolean;
	value?: string;
	inputRef?: Exclude<React.Ref<HTMLInputElement>, null>;
};

export function TextInput({
	fill,
	label,
	inline,
	value,
	inputRef,
	...rest
}: TextInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, keyof TextInputProps | 'defaultValue'>) {
	return (
		<FormGroup label={label} inline={inline}>
			<InputGroup {...rest} inputRef={inputRef} fill={fill} placeholder={label} value={value} />
		</FormGroup>
	);
}
