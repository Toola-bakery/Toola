import { Button, Card } from '@blueprintjs/core';
import React, { useMemo } from 'react';
import { useBlock } from '../../hooks/useBlock';
import { useBlockProperty } from '../../hooks/useBlockProperty';
import { BlockInspector } from '../../../inspector/components/BlockInspector';
import { useBlockInspectorState } from '../../../inspector/hooks/useBlockInspectorState';
import { useDeclareBlockMethods } from '../../hooks/useDeclareBlockMethods';
import { useDeepChildren } from '../../hooks/useDeepChildren';
import { BasicBlock } from '../../types/basicBlock';
import { EditableText } from '../componentsWithLogic/EditableText';
import { EmojiPicker } from '../componentsWithLogic/EmojiPicker';
import { ColumnBlock, ColumnBlockType } from './Layout/ColumnBlock';

export function FormBlock({ hide }: { hide: boolean }) {
	const block = useBlock();
	const [blocks] = useBlockProperty<string[]>('blocks', []);

	const { cleanForm, submitForm } = useDeclareBlockMethods({ cleanForm: () => {}, submitForm: () => {} }, []);
	const children = useDeepChildren();
	const { onContextMenu, inspectorProps } = useBlockInspectorState([]);

	if (hide || !block.show) return null;

	return (
		<>
			<BlockInspector {...inspectorProps} />
			<div onContextMenu={onContextMenu}>
				<Card style={{ paddingLeft: 0, paddingRight: 20 }}>
					<div style={{ display: 'flex', alignItems: 'center', paddingLeft: 30 }}>
						<EmojiPicker useDefaultDocument={false} />
						<EditableText placeholder="Untitled" tagName="h4" className="bp4-heading" />
					</div>
					<ColumnBlock fake block={block as BasicBlock & ColumnBlockType} />
					<div style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: 0, paddingRight: 5 }}>
						<Button onClick={() => submitForm()}>Submit</Button>
					</div>
				</Card>
			</div>
		</>
	);
}
