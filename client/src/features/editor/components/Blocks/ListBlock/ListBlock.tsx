import { Card } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useReferenceEvaluator } from '../../../../executor/hooks/useReferences';
import { BlockInspector } from '../../../../inspector/components/BlockInspector';
import { MenuItemProps } from '../../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../../hooks/blockInspector/useAppendBlockMenu';
import { useBlockInspectorState } from '../../../hooks/blockInspector/useBlockInspectorState';
import { useBlock } from '../../../hooks/useBlock';
import { useBlockProperty } from '../../../hooks/useBlockProperty';
import { BasicBlock } from '../../../types/basicBlock';
import { EditableText } from '../../componentsWithLogic/EditableText';
import { EmojiPicker } from '../../componentsWithLogic/EmojiPicker';
import { CurrentContextProvider } from '../../CurrentContext';
import { ColumnBlock, ColumnBlockType } from '../Layout/ColumnBlock';
import { TableBlockProps } from '../TableBlock/TableBlock';

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
	const { onContextMenu, inspectorProps } = useBlockInspectorState();

	if (hide || !block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				{data.map((item) => (
					<CurrentContextProvider current={item}>
						<Card style={{ padding: 8, paddingLeft: 0, marginBottom: 8 }}>
							<ColumnBlock fake block={block as BasicBlock & ColumnBlockType} />
						</Card>
					</CurrentContextProvider>
				))}
			</div>
		</>
	);
}
