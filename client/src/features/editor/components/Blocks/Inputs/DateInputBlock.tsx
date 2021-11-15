import { DateInput } from '@blueprintjs/datetime';
import React, { useMemo } from 'react';
import styled from 'styled-components';
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

function parseDate(value: any) {
	console.log('parseDate', value);
	return value instanceof Date ? value.toISOString() : '';
}

export function DateInputBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { evaluate } = useReferenceEvaluator();
	const [initialValue, setInitialValue] = useBlockProperty<string>('initialValue', '');
	const [value, setValue] = useBlockState<string>('value', () => parseDate(evaluate(initialValue)));

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

	useDeclareBlockMethods({ setValue: (newValue: string | number) => setValue(parseDate(newValue)) }, [setValue]);

	const { onContextMenu, inspectorProps } = useBlockInspectorState();

	if (hide || !show) return <></>;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<StyledInput style={{ display: 'flex', flexDirection: 'row' }} onContextMenu={onContextMenu}>
				<InputLabel />
				<DateInput
					formatDate={(date) => date.toLocaleString().split(',')[0]}
					parseDate={(str) => new Date(str)}
					fill
					value={value ? new Date(value) : null}
					onChange={(selectedDate) => {
						console.log(selectedDate.toISOString(), 'selectedDate.toISOString()');
						setValue(selectedDate.toISOString());
					}}
				/>
			</StyledInput>
		</>
	);
}
