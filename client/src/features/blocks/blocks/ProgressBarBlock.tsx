import { ProgressBar } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { MenuItemProps } from '../../inspector/components/InspectorItem';
import { parseIntSafe } from '../helpers/parsers';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../editor/hooks/useBlock';
import { useBlockContext } from '../../editor/hooks/useBlockContext';
import { useBlockProperty, useBlockState } from '../../editor/hooks/useBlockProperty';
import { useDeclareBlockMethods } from '../../editor/hooks/useDeclareBlockMethods';
import { useReferenceEvaluator } from '../../executor/hooks/useReferences';
import { InputLabel } from '../components/InputLabel';

export type ProgressBarBlockType = ProgressBarBlockProps;
export type ProgressBarBlockProps = {
	type: 'progressBar';
	initialValue?: string;
};
export type ProgressBarBlockState = {
	value?: number;
};

export function ProgressBarBlock({ hide }: { hide: boolean }) {
	const { show } = useBlock();
	const { evaluate } = useReferenceEvaluator();
	const [initialValue, setInitialValue] = useBlockProperty('initialValue', '');
	const [value, setValue] = useBlockState<number | string>('value', () => parseIntSafe(evaluate(initialValue)));

	useDeclareBlockMethods(
		{
			setValue(v: unknown) {
				setValue(parseIntSafe(v));
			},
		},
		[setValue],
	);

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
	useAppendBlockMenu(menu, 1);
	const { showInspector } = useBlockContext();

	if (hide || !show) return null;

	return (
		<div onContextMenu={showInspector}>
			<InputLabel>
				<ProgressBar value={typeof value === 'number' ? value : 0} />
			</InputLabel>
		</div>
	);
}
