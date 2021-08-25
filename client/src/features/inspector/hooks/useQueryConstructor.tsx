import { useMemo } from 'react';
import { useImmer } from 'use-immer';
import { useReferenceEvaluator } from '../../executor/hooks/useReferences';
import { MenuItemProps } from '../components/InspectorItem';
import { QueryInspector } from '../components/QueryInspector';

type QueryProperties = QueryProperty[];
type QueryProperty = {
	id: string;
	label: string;
	type: 'string' | 'code' | 'number' | 'object' | 'switch';
};

export function useQueryConstructor(properties: QueryProperties, initialValue: any = {}) {
	const [value, valueResult] = useImmer<{ [key: string]: any }>(initialValue);

	const { evaluate } = useReferenceEvaluator({});

	const menu = properties.map<MenuItemProps>((queryProperty) => {
		const { label, id, type } = queryProperty;
		if (type === 'string' || type === 'code' || type === 'object' || type === 'number')
			return {
				type: 'input',
				label,
				value: value[id],
				codeType: type === 'object' ? 'object' : 'string',
				onChange(v) {
					valueResult((draft) => {
						draft[id] = v;
					});
				},
			};
		return {
			type: 'switch',
			label,
			value: value[id],
			onChange(v) {
				valueResult((draft) => {
					draft[id] = v;
				});
			},
		};
	});

	const result = useMemo(
		() =>
			properties.reduce<{ [key: string]: any }>((state, item) => {
				const { id, type } = item;
				if (typeof value[id] === 'undefined') return state;

				if (type === 'object') {
					state[id] = evaluate(`\${ ${value[id]} }`);
				} else {
					state[id] = evaluate(value[id]);
				}
				if (type === 'number') {
					state[id] = parseInt(state[id], 10);
				}

				return state;
			}, {}),
		[evaluate, properties, value],
	);

	return { value, result, menu, component: <QueryInspector menu={menu} /> };
}
