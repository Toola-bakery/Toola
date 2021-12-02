import React, { useCallback, useMemo } from 'react';
import { isMobile } from 'react-device-detect';
import { useCurrent } from '../../../editor/hooks/useCurrent';
import { Block } from '../../../editor/components/Block/Block';
import { BasicBlock } from '../../../editor/types/basicBlock';
import { usePageContext } from '../../../executor/hooks/useReferences';
import { DropTarget } from './DropTarget';
import { useEditor } from '../../../editor/hooks/useEditor';
import { ColumnBlock, ColumnBlockType } from './ColumnBlock';
import { Blocks } from '../../../editor/types/blocks';

export type RowBlockType = RowBlockProps;
export type RowBlockProps = { type: 'row'; blocks: string[]; widths?: number[] };

function addAfterEachElement<T, R>(array: T[], get: (perviousEl: T) => R) {
	const newArray: (T | R)[] = [];

	array.forEach((el) => {
		newArray.push(el);
		newArray.push(get(el));
	});

	return newArray;
}

export function RowBlock({ block, fake = false }: { block: BasicBlock & RowBlockType; fake?: boolean }) {
	const { pageId } = usePageContext();
	const { blocks } = useCurrent();
	const { addBlocks, addChildInsteadOf, addChildAfterId, addChild } = useEditor();
	const brakeRow = isMobile && block.parentId === 'page';

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
			// if (!columnBlock.show) return null;

			if (i % 2 === 0)
				return (
					<div
						key={`rowItem${pageId}${blockKey}`}
						style={{
							width: brakeRow
								? '100%'
								: `calc(100% * ${(1 / block.blocks.length).toFixed(3)} - 5px - 5px / ${block.blocks.length})`,
						}}
					>
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
	}, [addColumnAfterAndPutItem, block.blocks, blocks, brakeRow, createRowAndColumns, fake, pageId]);

	if (!block.show && !fake) return <></>;

	return (
		<div style={{ display: 'flex', flexDirection: brakeRow ? 'column' : 'row', width: '100%' }}>
			{fake ? (
				<DropTarget vertical onDrop={(item) => createRowAndColumns(item, true)} />
			) : (
				<DropTarget vertical onDrop={(item) => addColumnAfterAndPutItem(item, null)} />
			)}
			{elements}
		</div>
	);
}
