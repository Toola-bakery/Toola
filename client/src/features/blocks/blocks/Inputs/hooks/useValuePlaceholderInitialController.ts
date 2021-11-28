import { useMemo } from 'react';
import { useReferenceEvaluator } from '../../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlockProperty, useBlockState } from '../../../../editor/hooks/useBlockProperty';
import { useInitialValue } from '../../../hooks/useInitialValue';

export function useValuePlaceholderInitialController() {
	const { calculateInitialValue } = useInitialValue(1);
	const [placeholder, setPlaceholder] = useBlockProperty<string>('placeholder', '');
	const [value, setValue] = useBlockState('value', calculateInitialValue);

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Placeholder',
				type: 'input',
				onChange: setPlaceholder,
				value: placeholder,
			},
		],
		[placeholder, setPlaceholder],
	);
	useAppendBlockMenu(menu, 1.1);

	return { value, setValue, placeholder };
}
