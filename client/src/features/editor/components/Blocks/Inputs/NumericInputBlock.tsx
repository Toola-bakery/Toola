import { NumericInput } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { useReferenceEvaluator } from '../../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';
import { parseIntSafe } from '../../../helpers/parsers';
import { useAppendBlockMenu } from '../../../hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../../hooks/useBlock';
import { useBlockContext } from '../../../hooks/useBlockContext';
import { useBlockProperty, useBlockState } from '../../../hooks/useBlockProperty';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { InputLabel } from '../../componentsWithLogic/InputLabel';

const StyledInput = styled.div`
	.bp4-form-group {
		margin-bottom: 0;
	}
`;

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
		<StyledInput style={{ display: 'flex', flexDirection: 'row' }} onContextMenu={showInspector}>
			<InputLabel />
			<NumericInput
				fill
				placeholder={placeholder}
				value={value}
				autoComplete="off"
				onValueChange={(valueAsNumber, valueAsString) => {
					if (!Number.isNaN(valueAsNumber) && !valueAsString.includes('.')) setValue(valueAsNumber);
				}}
			/>
		</StyledInput>
	);
}
