import { useMemo } from 'react';
import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { useReferenceEvaluator } from '../../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../../hooks/blockInspector/useAppendBlockMenu';
import { useBlockProperty, useBlockState } from '../../../hooks/useBlockProperty';

export function useValuePlaceholderInitialController() {
	const { evaluate } = useReferenceEvaluator();
	const [initialValue, setInitialValue] = useBlockProperty<string>('initialValue', '');
	const [value, setValue] = useBlockState('value', '');

	useOnMountedEffect(() => {
		if (initialValue) setValue(evaluate(initialValue));
	});

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Initial Value',
				type: 'input',
				onChange: setInitialValue,
				value: initialValue,
			},
		],
		[initialValue, setInitialValue],
	);
	useAppendBlockMenu(menu, 1);

	return { value, setValue };
}
