import { NumericInput } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useReferenceEvaluator } from '../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { parseIntSafe } from '../../helpers/parsers';
import { useAppendBlockMenu } from '../../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../../editor/hooks/useBlock';
import { useBlockContext } from '../../../editor/hooks/useBlockContext';
import { useBlockProperty, useBlockState } from '../../../editor/hooks/useBlockProperty';
import { useDeclareBlockMethods } from '../../../editor/hooks/useDeclareBlockMethods';
import { InputLabel } from '../../components/InputLabel';

export function NumericInputBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { evaluate } = useReferenceEvaluator();
	const [initialValue, setInitialValue] = useBlockProperty<string>('initialValue', '');
	const [placeholder, setPlaceholder] = useBlockProperty<string>('placeholder', '');
	const [value, setValue] = useBlockState<number | ''>('value', () => parseIntSafe(evaluate(initialValue)));

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Initial Value',
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

	useDeclareBlockMethods({ setValue: (newValue: string | number) => setValue(parseIntSafe(newValue)) }, [setValue]);

	const { showInspector } = useBlockContext();

	if (hide || !show) return null;
	// TODO "helperText" Helper text with details...
	return (
		<div onContextMenu={showInspector}>
			<InputLabel>
				<NumericInput
					fill
					placeholder={placeholder}
					value={value}
					autoComplete="off"
					onValueChange={(valueAsNumber, valueAsString) => {
						if (!Number.isNaN(valueAsNumber) && !valueAsString.includes('.')) setValue(valueAsNumber);
					}}
				/>
			</InputLabel>
		</div>
	);
}
