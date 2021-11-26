import { Button, Card } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { MenuItemProps } from '../../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../hooks/blockInspector/useAppendBlockMenu';
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
	const [backgroundColor, setBackgroundColor] = useBlockProperty<string>('backgroundColor');
	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				type: 'input',
				value: backgroundColor || '',
				onChange: setBackgroundColor,
				label: 'Background color',
			},
		],
		[backgroundColor, setBackgroundColor],
	);
	useAppendBlockMenu(menu, 0);
	if (hide || !block.show) return null;

	return (
		<div onContextMenu={showInspector}>
			<Card
				style={{
					paddingTop: 20,
					paddingRight: 20,
					paddingBottom: 20,
					paddingLeft: 0,
					backgroundColor: backgroundColor || 'white',
				}}
			>
				<div style={{ display: 'flex', alignItems: 'center', paddingLeft: 25 }}>
					<EmojiPicker hideIfEmpty useDefaultDocument={false} />
					<EditableText placeholder="Untitled" tagName="h4" className="bp4-heading" />
				</div>
				<ColumnBlock fake block={block as BasicBlock & ColumnBlockType} />
			</Card>
		</div>
	);
}
