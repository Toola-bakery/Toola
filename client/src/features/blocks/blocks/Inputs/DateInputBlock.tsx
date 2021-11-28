import { DateInput } from '@blueprintjs/datetime';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useReferenceEvaluator } from '../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../../editor/hooks/useBlock';
import { useBlockContext } from '../../../editor/hooks/useBlockContext';
import { useBlockProperty, useBlockState } from '../../../editor/hooks/useBlockProperty';
import { useDeclareBlockMethods } from '../../../editor/hooks/useDeclareBlockMethods';
import { InputLabel } from '../../components/InputLabel';

function parseDate(value: any) {
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
	const { showInspector } = useBlockContext();

	if (hide || !show) return null;

	return (
		<div onContextMenu={showInspector}>
			<InputLabel>
				<DateInput
					formatDate={(date) => date.toLocaleString().split(',')[0]}
					parseDate={(str) => new Date(str)}
					fill
					value={value ? new Date(value) : null}
					onChange={(selectedDate) => {
						setValue(selectedDate.toISOString());
					}}
				/>
			</InputLabel>
		</div>
	);
}
