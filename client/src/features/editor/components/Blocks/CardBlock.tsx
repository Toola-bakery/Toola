import { Button, Card } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useBlock } from '../../hooks/useBlock';
import { useBlockContext } from '../../hooks/useBlockContext';
import { useBlockProperty } from '../../hooks/useBlockProperty';
import { BasicBlock } from '../../types/basicBlock';
import { EditableText } from '../componentsWithLogic/EditableText';
import { EmojiPicker } from '../componentsWithLogic/EmojiPicker';
import { ColumnBlock, ColumnBlockType } from './Layout/ColumnBlock';

export function CardBlock({ hide }: { hide: boolean }) {
	const block = useBlock();
	const { showInspector } = useBlockContext();
	const [blocks] = useBlockProperty<string[]>('blocks', []);

	if (hide || !block.show) return null;

	return (
		<div onContextMenu={showInspector}>
			<Card>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<EmojiPicker useDefaultDocument={false} />
					<EditableText placeholder="Untitled" tagName="h4" className="bp4-heading" />
				</div>
				<ColumnBlock fake block={block as BasicBlock & ColumnBlockType} />
			</Card>
		</div>
	);
}
