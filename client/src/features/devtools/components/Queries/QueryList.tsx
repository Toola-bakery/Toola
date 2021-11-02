import { Button, Icon, InputGroup, Menu, MenuItem, NonIdealState } from '@blueprintjs/core';
import { useCallback } from 'react';
import { DropTarget } from '../../../editor/components/Blocks/Layout/DropTarget';
import { PageBlockProps } from '../../../editor/components/Page/Page';
import { useBlockDrag } from '../../../editor/hooks/useBlockDrag';
import { useCurrent } from '../../../editor/hooks/useCurrent';
import { useEditor } from '../../../editor/hooks/useEditor';
import { usePageContext } from '../../../executor/hooks/useReferences';

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
		<>
			<div ref={dragRef}>
				<MenuItem
					style={{ opacity }}
					active={activeBlockId === blockId}
					onClick={() => setActiveBlock(blockId)}
					key={blockId}
					text={blockId}
				/>
			</div>
			<DropTarget
				key={`DropTarget:${blockId}`}
				dropIds={['Block:code', 'Block:query']}
				onDrop={(d) => onDrop(blockId, d)}
			/>
		</>
	);
}

export function QueryList({
	setActiveBlock,
	activeBlockId,
}: {
	setActiveBlock: (blockId: string) => void;
	activeBlockId: string | undefined;
}) {
	const { page } = usePageContext();
	const { updateParentId, immerBlockProps } = useEditor();

	const onDrop = useCallback(
		(afterBlockId: string | null, event: { id: string }) => {
			const blockId = event.id;
			updateParentId(blockId, 'queries');
			immerBlockProps<PageBlockProps>('page', (draft) => {
				if (!draft.queries) draft.queries = [];
				if (!afterBlockId) draft.queries = [blockId, ...draft.queries];
				else draft.queries.splice(draft.queries.indexOf(afterBlockId) + 1, 0, blockId);
			});
		},
		[immerBlockProps, updateParentId],
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
				<Button style={{ marginLeft: 3 }} icon="plus" minimal small />
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
