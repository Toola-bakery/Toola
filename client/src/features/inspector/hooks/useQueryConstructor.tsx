import { useMemo } from 'react';
import { useImmer } from 'use-immer';
import { useReferenceEvaluator } from '../../executor/hooks/useReferences';
import { MenuItemProps } from '../components/InspectorItem';
import { QueryInspector } from '../components/QueryInspector';

export type QueryProperties = QueryProperty[];
export type QueryProperty = {
	id: string;
	label: string;
	type: 'queryAction' | 'database' | 'string' | 'code' | 'number' | 'object' | 'switch';
	databaseId?: string;
};

export function useQueryConstructor<T = any>(properties: QueryProperties, initialValue: any = {}) {
	const [values, valueResult] = useImmer<{ [key: string]: any }>(initialValue);

	const { evaluate, setOnUpdate } = useReferenceEvaluator();

	const menu = properties.map<MenuItemProps>((queryProperty) => {
		const { label, id, type, databaseId } = queryProperty;
		const onChange = (v: unknown) =>
			valueResult((draft) => {
				draft[id] = v;
			});

		const value = values[id];

		if (type === 'string' || type === 'code' || type === 'object' || type === 'number')
			return {
				type: 'input',
				label,
				value,
				multiline: type === 'object',
				codeType: type === 'object' ? 'object' : 'string',
				onChange,
			};
		if (type === 'database')
			return {
				type: 'database',
				label,
				value,
				onChange,
			};
		if (type === 'queryAction')
			return {
				type: 'queryAction',
				label,
				databaseId,
				value,
				onChange,
			};
		return {
			type: 'switch',
			label,
			value,
			onChange,
		};
	});

	const result = useMemo(
		() =>
			Object.keys(values).reduce<{ [key: string]: any }>((state, valueKey) => {
				const value = values[valueKey];
				if (typeof values[valueKey] === 'undefined') return state;

				state[valueKey] = typeof value === 'string' ? evaluate(value) : value;

				// if (type === 'number') {
				// 	state[id] = parseInt(state[id], 10);
				// }

				return state;
			}, {}),
		[evaluate, values],
	);

	return { value: values as T, result, menu, setOnUpdate, component: <QueryInspector menu={menu} /> };
}
