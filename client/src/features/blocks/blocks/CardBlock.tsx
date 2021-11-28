import { Card } from '@blueprintjs/core';
import React from 'react';
import { useBlock } from '../../editor/hooks/useBlock';
import { useBlockContext } from '../../editor/hooks/useBlockContext';
import { useBlockProperty } from '../../editor/hooks/useBlockProperty';
import { BasicBlock } from '../../editor/types/basicBlock';
import { EditableText } from '../components/EditableText';
import { EmojiPicker } from '../components/EmojiPicker';
import { useCardStyle } from '../hooks/useCardStyle';
import { ColumnBlock, ColumnBlockType } from './Layout/ColumnBlock';

export function CardBlock({ hide }: { hide: boolean }) {
	const block = useBlock();
	const { showInspector } = useBlockContext();
	useBlockProperty<string[]>('blocks', []);

	const { borderColor, borderRadiusCalculated, backgroundColor } = useCardStyle();

	if (hide || !block.show) return null;

	return (
		<div onContextMenu={showInspector}>
			<Card
				style={{
					borderColor: borderColor || '#dcdcdd',
					borderStyle: 'solid',
					borderWidth: 1,
					paddingTop: 20,
					paddingRight: 20,
					paddingBottom: 20,
					paddingLeft: 0,
					backgroundColor: backgroundColor || 'white',
					borderRadius: borderRadiusCalculated,
					boxShadow: 'none',
				}}
				elevation={0}
			>
				<div style={{ display: 'flex', alignItems: 'center', paddingLeft: 30 }}>
					<EmojiPicker hideIfEmpty useDefaultDocument={false} />
					<EditableText placeholder="Untitled" tagName="h4" className="bp4-heading" />
				</div>
				<ColumnBlock fake block={block as BasicBlock & ColumnBlockType} />
			</Card>
		</div>
	);
}
