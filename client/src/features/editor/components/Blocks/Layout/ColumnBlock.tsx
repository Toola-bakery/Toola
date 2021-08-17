import React, { useMemo } from 'react';
import { Block } from '../../Block';
import { BasicBlock } from '../../../types/basicBlock';
import { usePageContext } from '../../../hooks/useReferences';
import { useEditor } from '../../../hooks/useEditor';
import { RowBlock, RowBlockType } from './RowBlock';
import { DropTarget } from './DropTarget';
import { Blocks } from '../../../types/blocks';

export type ColumnBlockType = ColumnBlockProps;
export type ColumnBlockProps = { type: 'column'; blocks: string[] };

export function ColumnBlock({ block, fake }: { block: BasicBlock & ColumnBlockType; fake?: boolean }) {
	const { blocks, pageId } = usePageContext();
	const { moveBlockAfterId, addChild } = useEditor();

	const elements = useMemo(() => {
		return block.blocks.map((blockKey) => {
			return (
				<div key={`${blocks[blockKey].id}`}>
					{(() => {
						if (blocks[blockKey].type === 'row')
							return <RowBlock block={blocks[blockKey] as BasicBlock & RowBlockType} />;
						if (!blocks[blockKey].show) return null;

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

	if (!block.show) return <></>;

	return (
		<>
			<DropTarget onDrop={(item: BasicBlock & Blocks) => addChild(block.id, item.id, 0)} />
			{elements}
		</>
	);
}
