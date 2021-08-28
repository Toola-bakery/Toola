import { FormGroup, InputGroup, TextArea } from '@blueprintjs/core';
import React, { InputHTMLAttributes, TextareaHTMLAttributes } from 'react';

export type TextInputProps<T extends boolean> = {
	fill?: boolean;
	label?: string;
	inline?: boolean;
	multiline?: T;
	value?: string;
	inputRef?: Exclude<React.Ref<T extends true ? HTMLTextAreaElement : HTMLInputElement>, null>;
};

export function TextInput<T extends boolean>({
	fill,
	label,
	inline,
	value,
	inputRef,
	multiline,
	...rest
}: TextInputProps<T> &
	Omit<
		TextareaHTMLAttributes<HTMLTextAreaElement> & InputHTMLAttributes<HTMLInputElement>,
		keyof TextInputProps<T> | 'defaultValue'
	>) {
	return (
		<FormGroup label={label} inline={inline}>
			{multiline === true ? (
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				<TextArea {...rest} inputRef={inputRef} fill={fill} placeholder={label} value={value} />
			) : (
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				<InputGroup {...rest} inputRef={inputRef} fill={fill} placeholder={label} value={value} />
			)}
		</FormGroup>
	);
}
