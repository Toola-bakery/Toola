import { useCallback, useMemo } from 'react';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockProperty } from '../../editor/hooks/useBlockProperty';
import { useReferenceEvaluator } from '../../executor/hooks/useReferences';
import { MenuItemProps } from '../../inspector/components/InspectorItem';

export function useInitialValue(index = 1) {
	const { evaluate } = useReferenceEvaluator();
	const [initialValue, setInitialValue] = useBlockProperty<string>('initialValue', '');

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Initial value',
				type: 'input',
				onChange: setInitialValue,
				value: initialValue,
			},
		],
		[initialValue, setInitialValue],
	);
	useAppendBlockMenu(menu, index);

	const calculateInitialValue = useCallback(() => evaluate(initialValue), [evaluate, initialValue]);

	return { calculateInitialValue, initialValue };
}
