import { Card } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useReferenceEvaluator } from '../../../../executor/hooks/useReferences';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../../hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../../hooks/useBlock';
import { useBlockContext } from '../../../hooks/useBlockContext';
import { useBlockProperty } from '../../../hooks/useBlockProperty';
import { BasicBlock } from '../../../types/basicBlock';
import { CurrentContextProvider } from '../../CurrentContext';
import { ColumnBlock, ColumnBlockType } from '../Layout/ColumnBlock';

export function ListBlock({ hide }: { hide: boolean }) {
	const block = useBlock();
	const [value, setValue] = useBlockProperty('value', '');
	const [blocks] = useBlockProperty<string[]>('blocks', []);

	const { evaluate, isLoading } = useReferenceEvaluator();

	const data = useMemo<any[]>(() => {
		const state = evaluate(value);
		return Array.isArray(state) ? state : [state];
	}, [evaluate, value]);

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				label: 'Data Source',
				type: 'input',
				onChange: (v) => setValue(v),
				value,
			},
		],
		[setValue, value],
	);
	useAppendBlockMenu(menu, 1);
	const { showInspector } = useBlockContext();

	if (hide || !block.show) return null;

	return (
		<div onContextMenu={showInspector}>
			{data.map((item) => (
				<CurrentContextProvider current={item}>
					<Card style={{ padding: 8, paddingLeft: 0, marginBottom: 8 }}>
						<ColumnBlock fake block={block as BasicBlock & ColumnBlockType} />
					</Card>
				</CurrentContextProvider>
			))}
		</div>
	);
}
