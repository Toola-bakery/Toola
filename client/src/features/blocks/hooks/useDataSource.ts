import { useMemo } from 'react';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockProperty } from '../../editor/hooks/useBlockProperty';
import { useReferenceEvaluator } from '../../executor/hooks/useReferences';
import { MenuItemProps } from '../../inspector/components/InspectorItem';

export function useDataSource() {
	const [value, setValue] = useBlockProperty('value', '');
	const { evaluate, isLoading } = useReferenceEvaluator();

	const valueCalculated = useMemo(() => evaluate(value), [evaluate, value]);
	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Data Source',
				type: 'input',
				onChange: setValue,
				value,
			},
		],
		[setValue, value],
	);

	useAppendBlockMenu(menu, 1);

	return { isLoading, value, valueCalculated };
}
