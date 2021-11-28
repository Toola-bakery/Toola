import { Button, Card } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useReferences } from '../../executor/hooks/useReferences';
import { MenuItemProps } from '../../inspector/components/InspectorItem';
import { useAppendBlockMenu } from '../../editor/hooks/blockInspector/useAppendBlockMenu';
import { useBlock } from '../../editor/hooks/useBlock';
import { useBlockContext } from '../../editor/hooks/useBlockContext';
import { useBlockProperty } from '../../editor/hooks/useBlockProperty';
import { BasicBlock } from '../../editor/types/basicBlock';
import { EditableText } from '../components/EditableText';
import { EmojiPicker } from '../components/EmojiPicker';
import { ColumnBlock, ColumnBlockType } from './Layout/ColumnBlock';

export function CardBlock({ hide }: { hide: boolean }) {
	const block = useBlock();
	const { showInspector } = useBlockContext();
	const [blocks] = useBlockProperty<string[]>('blocks', []);
	const [backgroundColor, setBackgroundColor] = useBlockProperty<string>('backgroundColor');

	// eslint-disable-next-line no-template-curly-in-string
	const [borderRadius, setBorderRadius] = useBlockProperty<string>('borderRadius', '3px');
	const borderRadiusCalculated = useReferences(borderRadius);

	// eslint-disable-next-line no-template-curly-in-string
	const [borderColor, setBorderColor] = useBlockProperty<string>('borderColor', '#dcdcdd');
	// const borderRadiusCalculated = useReferences(borderRadius);

	const menu = useMemo<MenuItemProps[]>(
		() => [
			{
				type: 'nested',
				label: 'Style',
				icon: 'style',
				next: [
					{
						type: 'input',
						value: backgroundColor || '',
						onChange: setBackgroundColor,
						label: 'Background color',
					},
					{
						type: 'input',
						value: borderRadius || '',
						onChange: setBorderRadius,
						label: 'Border radius',
					},
					{
						type: 'input',
						value: borderColor || '',
						onChange: setBorderColor,
						label: 'Border color',
					},
				],
			},
		],
		[backgroundColor, borderColor, borderRadius, setBackgroundColor, setBorderColor, setBorderRadius],
	);
	useAppendBlockMenu(menu, 0);
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
