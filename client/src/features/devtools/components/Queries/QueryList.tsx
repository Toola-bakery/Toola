import { Button, Icon, InputGroup, Menu, MenuItem, NonIdealState, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { PropsWithChildren, ReactNode, useCallback } from 'react';
import { DropTarget } from '../../../blocks/blocks/Layout/DropTarget';
import { BlockContextProvider } from '../../../editor/components/Block/Block';
import { PageBlockProps } from '../../../editor/components/Page/Page';
import { BlockCreators } from '../../../blocks/helpers/BlockCreators';
import { useBlockContext } from '../../../editor/hooks/useBlockContext';
import { useBlockDrag } from '../../../editor/hooks/useBlockDrag';
import { useCurrent } from '../../../editor/hooks/useCurrent';
import { useEditor } from '../../../editor/hooks/useEditor';
import { usePageContext } from '../../../executor/hooks/useReferences';

function BlockContextMenu({
	children,
	...restDivProps
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { children?: ReactNode }) {
	const { showInspector } = useBlockContext();

	return (
		<div
			{...restDivProps}
			onContextMenu={(e) => {
				showInspector(e);
			}}
		>
			{children}
		</div>
	);
}

function QueryMenuItem({
	blockId,
	activeBlockId,
	setActiveBlock,
	onDrop,
}: {
	blockId: string;
	activeBlockId: string | undefined;
	setActiveBlock: (blockId: string) => void;
	onDrop: (afterBlockId: string | null, event: { id: string }) => void;
}) {
	const { blocks } = useCurrent();
	const [{ opacity }, dragRef] = useBlockDrag(blocks[blockId]);
	return (
		<BlockContextProvider block={blocks[blockId]}>
			<BlockContextMenu>
				<div ref={dragRef}>
					<MenuItem
						style={{ opacity }}
						active={activeBlockId === blockId}
						onClick={() => setActiveBlock(blockId)}
						key={blockId}
						text={blockId}
					/>
				</div>
			</BlockContextMenu>
			<DropTarget
				key={`DropTarget:${blockId}`}
				dropIds={['Block:code', 'Block:query']}
				onDrop={(d) => onDrop(blockId, d)}
			/>
		</BlockContextProvider>
	);
}

export function QueryList({
	setActiveBlock,
	activeBlockId,
}: {
	setActiveBlock: (blockId: string) => void;
	activeBlockId: string | undefined;
}) {
	const { page, pageId } = usePageContext();
	const { updateParentId, immerBlockProps, addBlocks } = useEditor();
	const addToQueries = useCallback(
		(blockId: string, afterBlockId?: string | null) => {
			immerBlockProps<PageBlockProps>('page', (draft) => {
				if (!draft.queries) draft.queries = [];
				if (!afterBlockId) draft.queries = [blockId, ...draft.queries];
				else draft.queries.splice(draft.queries.indexOf(afterBlockId) + 1, 0, blockId);
			});
		},
		[immerBlockProps],
	);
	const onDrop = useCallback(
		(afterBlockId: string | null, event: { id: string }) => {
			const blockId = event.id;
			updateParentId(blockId, 'queries');
			addToQueries(event.id, afterBlockId);
		},
		[addToQueries, updateParentId],
	);

	const createQuery = useCallback(
		(type: 'code' | 'query') => {
			const [{ id }] = addBlocks([{ ...BlockCreators[type](), pageId, parentId: 'queries' }]);
			setActiveBlock(id);
			addToQueries(id);
		},
		[addBlocks, addToQueries, pageId, setActiveBlock],
	);

	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					padding: 3,
					borderBottomWidth: 1,
					borderBottomColor: 'rgb(237, 237, 237)',
					borderBottomStyle: 'solid',
				}}
			>
				<InputGroup fill small placeholder="Search..." />
				<Popover2
					minimal
					content={
						<Menu
							style={{
								boxShadow:
									'0 0 0 1px rgb(17 20 24 / 10%), 0 2px 4px rgb(17 20 24 / 20%), 0 8px 24px rgb(17 20 24 / 20%)',
							}}
						>
							<MenuItem icon="form" text="Add Query block" onClick={() => createQuery('query')} />
							<MenuItem icon="code" text="Add Node.JS block" onClick={() => createQuery('code')} />
						</Menu>
					}
					position={Position.BOTTOM}
				>
					<Button style={{ marginLeft: 3 }} icon="plus" minimal small />
				</Popover2>
			</div>
			<Menu>
				<DropTarget onDrop={(d) => onDrop(null, d)} dropIds={['Block:code', 'Block:query']} />
				{page.queries?.length ? (
					page.queries?.map((blockId) => (
						<QueryMenuItem
							key={`QueryMenuItem:${blockId}`}
							blockId={blockId}
							activeBlockId={activeBlockId}
							setActiveBlock={setActiveBlock}
							onDrop={onDrop}
						/>
					))
				) : (
					<NonIdealState icon={<Icon icon="folder-open" size={40} />} description="You don't have any queries yet" />
				)}
			</Menu>
		</>
	);
}
