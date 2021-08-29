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

export function useQueryConstructor(properties: QueryProperties, initialValue: any = {}) {
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
			properties.reduce<{ [key: string]: any }>((state, item) => {
				const { id, type } = item;
				if (typeof values[id] === 'undefined') return state;

				if (type === 'object') {
					state[id] = evaluate(`\${ ${values[id]} }`);
				} else {
					state[id] = evaluate(values[id]);
				}
				if (type === 'number') {
					state[id] = parseInt(state[id], 10);
				}

				return state;
			}, {}),
		[evaluate, properties, values],
	);

	return { value: values, result, menu, setOnUpdate, component: <QueryInspector menu={menu} /> };
}
