import { useMemo } from 'react';
import { useReferenceEvaluator } from '../../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockProperty, useBlockState } from '../../../../editor/hooks/useBlockProperty';

export function useValuePlaceholderInitialController() {
	const { evaluate } = useReferenceEvaluator();
	const [initialValue, setInitialValue] = useBlockProperty<string>('initialValue', '');
	const [placeholder, setPlaceholder] = useBlockProperty<string>('placeholder', '');
	const [value, setValue] = useBlockState('value', () => evaluate(initialValue));

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Initial value',
				type: 'input',
				onChange: setInitialValue,
				value: initialValue,
			},
			{
				label: 'Placeholder',
				type: 'input',
				onChange: setPlaceholder,
				value: placeholder,
			},
		],
		[initialValue, placeholder, setInitialValue, setPlaceholder],
	);
	useAppendBlockMenu(menu, 1);

	return { value, setValue, placeholder };
}
