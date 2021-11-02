import { Button, Card } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useBlock } from '../../hooks/useBlock';
import { useBlockProperty } from '../../hooks/useBlockProperty';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useReferenceEvaluator, useReferences } from '../../../executor/hooks/useReferences';
import { useBlockInspectorState } from '../../../inspector/hooks/useBlockInspectorState';
import { BasicBlock } from '../../types/basicBlock';
import { EditableText } from '../componentsWithLogic/EditableText';
import { EmojiPicker } from '../componentsWithLogic/EmojiPicker';
import { ColumnBlock, ColumnBlockType } from './Layout/ColumnBlock';

export function CardBlock({ hide }: { hide: boolean }) {
	const block = useBlock();
	const [blocks] = useBlockProperty<string[]>('blocks', []);

	const { onContextMenu, inspectorProps } = useBlockInspectorState([]);
	if (hide || !block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<Card>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<EmojiPicker useDefaultDocument={false} />
						<EditableText tagName="h4" className="bp4-heading" />
					</div>
					<ColumnBlock fake block={block as BasicBlock & ColumnBlockType} />
				</Card>
			</div>
		</>
	);
}
