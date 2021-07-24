import React, { useMemo } from 'react';
import { Block } from '../../Block';
import { BasicBlock, Blocks, ColumnBlockType, RowBlockType } from '../../../types';
import { usePageContext } from '../../../hooks/useReferences';
import { useEditor } from '../../../hooks/useEditor';
import { RowBlock } from './RowBlock';
import { DropTarget } from './DropTarget';

export type ColumnBlockProps = {
	block: BasicBlock & ColumnBlockType;
	fake?: boolean;
};

export function ColumnBlock({ block, fake }: ColumnBlockProps) {
	const { blocks, pageId } = usePageContext();
	const { moveBlockAfterId } = useEditor();

	const elements = useMemo(() => {
		return block.blocks.map((blockKey) => {
			return (
				<div key={`${blocks[blockKey].id}`}>
					{(() => {
						if (blocks[blockKey].type === 'row')
							return <RowBlock block={blocks[blockKey] as BasicBlock & RowBlockType} />;
						if (!fake) return <Block block={blocks[blockKey]} />;
						return (
							<RowBlock
								fake
								block={{ blocks: [blockKey], id: `fakeRow${blockKey}`, parentId: block.id, type: 'row', pageId }}
							/>
						);
					})()}

					<DropTarget onDrop={(item: BasicBlock & Blocks) => moveBlockAfterId(item.id, blockKey)} />
				</div>
			);
		});
	}, [block.blocks, block.id, blocks, fake, moveBlockAfterId, pageId]);

	return <>{elements}</>;
}
