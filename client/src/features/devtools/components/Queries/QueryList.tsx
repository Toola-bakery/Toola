import { Menu, MenuItem } from '@blueprintjs/core';
import { useCallback, useEffect } from 'react';
import { DropTarget } from '../../../editor/components/Blocks/Layout/DropTarget';
import { PageBlockProps } from '../../../editor/components/Page/Page';
import { useEditor } from '../../../editor/hooks/useEditor';
import { usePageContext } from '../../../executor/hooks/useReferences';

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
		<Menu>
			<DropTarget onDrop={(d) => onDrop(null, d)} dropIds={['Block:code', 'Block:query']} />
			{page.queries?.map((blockId) => (
				<>
					<MenuItem
						active={activeBlockId === blockId}
						onClick={() => setActiveBlock(blockId)}
						key={blockId}
						text={blockId}
					/>
					<DropTarget onDrop={(d) => onDrop(blockId, d)} />
				</>
			))}
		</Menu>
	);
}
