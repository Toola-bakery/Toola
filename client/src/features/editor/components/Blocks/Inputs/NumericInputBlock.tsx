import { NumericInput } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useOnMountedEffect } from '../../../../../hooks/useOnMounted';
import { useReferenceEvaluator } from '../../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../../hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../../hooks/useBlock';
import { useBlockProperty, useBlockState } from '../../../hooks/useBlockProperty';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { useBlockInspectorState } from '../../../hooks/blockInspector/useBlockInspectorState';
import { InputLabel } from '../../componentsWithLogic/InputLabel';

const StyledInput = styled.div`
	.bp4-form-group {
		margin-bottom: 0;
	}
`;

function parseIntSafe(value: string | number) {
	if (typeof value === 'number') return Number.isNaN(value) ? '' : value;
	const parsed = parseInt(value, 10);
	return Number.isNaN(parsed) ? '' : parsed;
}

export function NumericInputBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { evaluate } = useReferenceEvaluator();
	const [initialValue, setInitialValue] = useBlockProperty<string>('initialValue', '');
	const [value, setValue] = useBlockState<number | ''>('value', '');

	useOnMountedEffect(() => {
		if (initialValue) setValue(parseIntSafe(evaluate(initialValue)));
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

	useDeclareBlockMethods({ setValue: (newValue: string | number) => setValue(parseIntSafe(newValue)) }, [setValue]);

	const { onContextMenu, inspectorProps } = useBlockInspectorState();

	if (hide || !show) return <></>;

	// TODO "helperText" Helper text with details...
	return (
		<>
			<BlockInspector {...inspectorProps} />
			<StyledInput style={{ display: 'flex', flexDirection: 'row' }} onContextMenu={onContextMenu}>
				<InputLabel />
				<NumericInput
					fill
					value={value}
					autoComplete="off"
					onValueChange={(valueAsNumber, valueAsString) => {
						if (!Number.isNaN(valueAsNumber) && !valueAsString.includes('.')) setValue(valueAsNumber);
					}}
				/>
			</StyledInput>
		</>
	);
}
