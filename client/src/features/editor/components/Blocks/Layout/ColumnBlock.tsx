import React, { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { Block } from '../../Block';
import { BasicBlock, Blocks, ColumnBlockType } from '../../../types';
import { usePageContext } from '../../../hooks/useReferences';
import { useEditor } from '../../../hooks/useEditor';

export type ColumnBlockProps = {
	block: BasicBlock & ColumnBlockType;
};

function DropTarget({ afterId }: { afterId: string }) {
	const { replaceBlockAfterId } = useEditor();
	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'Block',
		drop: (item: BasicBlock & Blocks, monitor) => {
			replaceBlockAfterId(item.id, afterId);
		},
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}));

	return <div style={{ backgroundColor: isOver ? 'red' : 'transparent', height: 5 }} ref={drop} />;
}

export function ColumnBlock({ block }: ColumnBlockProps) {
	const { blocks } = usePageContext();
	const elements = useMemo(() => {
		return block.blocks.map((blockKey) => {
			return (
				<div key={`${blocks[blockKey].id}`}>
					<Block block={blocks[blockKey]} />
					<DropTarget afterId={blocks[blockKey].id} />
				</div>
			);
		});
	}, [block, blocks]);

	return <>{elements}</>;
}
