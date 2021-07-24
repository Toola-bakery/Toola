import React, { useCallback, useMemo } from 'react';
import { Block } from '../../Block';
import { BasicBlock, Blocks, ColumnBlockType, RowBlockType } from '../../../types';
import { usePageContext } from '../../../hooks/useReferences';
import { DropTarget } from './DropTarget';
import { useEditor } from '../../../hooks/useEditor';
import { ColumnBlock } from './ColumnBlock';

export type RowBlockProps = {
	block: BasicBlock & RowBlockType;
	fake?: boolean;
};

function addAfterEachElement<T, R>(array: T[], get: (perviousEl: T) => R) {
	const newArray: (T | R)[] = [];

	array.forEach((el) => {
		newArray.push(el);
		newArray.push(get(el));
	});

	return newArray;
}

export function RowBlock({ block, fake = false }: RowBlockProps) {
	const { blocks, pageId } = usePageContext();

	const { addBlocks, addChildInsteadOf, addChildAfterId, addChild } = useEditor();

	const addColumnAfterAndPutItem = useCallback(
		(item: Pick<BasicBlock & Blocks, 'id'>, putAfterColumnId: string | null) => {
			const [{ id: columnId }] = addBlocks([{ type: 'column', pageId, parentId: block.id, blocks: [] }]);
			addChild(columnId, item.id, 0);
			if (putAfterColumnId) addChildAfterId(putAfterColumnId, columnId);
			else addChild(block.id, columnId, 0);
		},
		[addBlocks, addChild, addChildAfterId, block.id, pageId],
	);

	// used for fake rows
	const createRowAndColumns = useCallback(
		(item: BasicBlock & Blocks, isLeft: boolean) => {
			const [{ id: rowId }, ...columns] = addBlocks([
				{ type: 'row', pageId, parentId: null, blocks: [] },
				{ type: 'column', pageId, parentId: null, blocks: [] },
				{ type: 'column', pageId, parentId: null, blocks: [] },
			]);

			const addColumns = isLeft ? columns.reverse() : columns;
			addChildInsteadOf(block.blocks[0], rowId);
			addChild(columns[isLeft ? 1 : 0].id, block.blocks[0]);
			addChild(columns[isLeft ? 0 : 1].id, item.id);
			addChild(
				rowId,
				addColumns.map((v) => v.id),
			);
		},
		[addBlocks, addChild, block.blocks, pageId, addChildInsteadOf],
	);

	const elements = useMemo(() => {
		return addAfterEachElement(block.blocks, (e) => e).map((blockKey, i) => {
			const columnBlock = blocks[blockKey];
			if (!columnBlock) return null;
			if (columnBlock.type === 'column' && columnBlock.blocks.length === 0) return null;

			if (i % 2 === 0)
				return (
					<div key={`rowItem${blockKey}`} style={{ flex: 1 }}>
						{columnBlock.type === 'column' ? (
							<ColumnBlock block={columnBlock as BasicBlock & ColumnBlockType} />
						) : (
							<Block key={blockKey} block={columnBlock} />
						)}
					</div>
				);

			return fake ? (
				<DropTarget key={`dropTarget${blockKey}`} vertical onDrop={(item) => createRowAndColumns(item, false)} />
			) : (
				<DropTarget
					key={`dropTarget${blockKey}`}
					vertical
					onDrop={(item) => addColumnAfterAndPutItem(item, blockKey)}
				/>
			);
		});
	}, [addColumnAfterAndPutItem, block.blocks, blocks, createRowAndColumns, fake]);

	return (
		<div style={{ display: 'flex', flexDirection: 'row' }}>
			{fake ? (
				<DropTarget vertical onDrop={(item) => createRowAndColumns(item, true)} />
			) : (
				<DropTarget vertical onDrop={(item) => addColumnAfterAndPutItem(item, null)} />
			)}
			{elements}
		</div>
	);
}
