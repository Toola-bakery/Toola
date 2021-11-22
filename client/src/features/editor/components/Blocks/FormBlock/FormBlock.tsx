import { Button, Card, NonIdealState } from '@blueprintjs/core';
import React, { useMemo, useState } from 'react';
import { LinkButton } from '../../../../../components/LinkButton';
import { usePageContext } from '../../../../executor/hooks/useReferences';
import { useBlock } from '../../../hooks/useBlock';
import { useBlockContext } from '../../../hooks/useBlockContext';
import { useBlockProperty } from '../../../hooks/useBlockProperty';
import { useDeclareBlockMethods } from '../../../hooks/useDeclareBlockMethods';
import { useDeepChildren } from '../../../hooks/useDeepChildren';
import { BasicBlock } from '../../../types/basicBlock';
import { EditableText } from '../../componentsWithLogic/EditableText';
import { EmojiPicker } from '../../componentsWithLogic/EmojiPicker';
import { ColumnBlock, ColumnBlockType } from '../Layout/ColumnBlock';
import { GenerateFormModal } from './GenerateFormModal';

export function FormBlock({ hide }: { hide: boolean }) {
	const block = useBlock();
	const { showInspector } = useBlockContext();
	const [blocks] = useBlockProperty<string[]>('blocks', []);
	const { editing } = usePageContext();
	const { cleanForm, submitForm } = useDeclareBlockMethods({ cleanForm: () => {}, submitForm: () => {} }, []);
	const children = useDeepChildren();

	const [isModalOpen, setModalOpen] = useState(false);

	if (hide || !block.show) return null;

	return (
		<>
			<div onContextMenu={showInspector}>
				<Card style={{ paddingLeft: 0, paddingRight: 20 }}>
					<div style={{ display: 'flex', alignItems: 'center', paddingLeft: 30 }}>
						<EmojiPicker useDefaultDocument={false} />
						<EditableText placeholder="Untitled" tagName="h4" className="bp4-heading" />
					</div>
					<ColumnBlock fake block={block as BasicBlock & ColumnBlockType} />
					{blocks.length || !editing ? null : (
						<NonIdealState
							description={
								<span>
									Create component or{' '}
									<LinkButton onClick={() => setModalOpen(true)}>generate from a resource</LinkButton>
								</span>
							}
						/>
					)}
					<div style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: 0, paddingRight: 5 }}>
						<Button onClick={() => submitForm()}>Submit</Button>
					</div>
				</Card>
			</div>
			<GenerateFormModal isOpen={isModalOpen} close={() => setModalOpen(false)} />
		</>
	);
}
