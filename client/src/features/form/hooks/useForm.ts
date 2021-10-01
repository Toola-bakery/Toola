import { ChangeEvent, useCallback, useMemo } from 'react';
import { useImmer } from 'use-immer';
import { MenuItemProps } from '../../inspector/components/InspectorItem';

type InputDescription = { type: MenuItemProps['type']; label?: string };
type FormDescription = { [key: string]: InputDescription };
type ValueType = boolean | string | number | undefined;
type Values<T> = { [key in keyof T]?: ValueType };

export function useForm<T extends FormDescription>(form: T) {
	const [values, immer] = useImmer<Values<T>>(
		Object.fromEntries(Object.keys(form).map((key) => [key, ''])) as Values<T>,
	);

	type FormParams = {
		[key in keyof T]: {
			onChange: (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
			setValue: (value: ValueType) => void;
			value: ValueType;
		};
	};
	const onChange = useCallback(
		(key: keyof T, value?: ValueType) => {
			immer((draft) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				draft[key] = value;
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[immer],
	);
	const formParams = useMemo(() => {
		return Object.keys(form).reduce((state: FormParams, key: keyof T) => {
			state[key] = {
				onChange: (event) => onChange(key, event.target.value),
				setValue: (value) => onChange(key, value),
				value: values[key],
			};
			return state;
		}, {} as FormParams);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form, onChange, values]);

	const menu = Object.keys(form).map((key: keyof T): MenuItemProps => {
		return {
			type: form[key].type,
			label: form[key].label || '',
			onChange: (val: ValueType) => onChange(key, val),
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			value: values[key],
		};
	});

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const set = useCallback((newValue: Values<T>) => immer(() => newValue), [immer]);

	return { values, menu, set, ...formParams };
}
