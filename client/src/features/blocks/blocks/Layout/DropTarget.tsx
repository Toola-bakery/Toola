import React, { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { BasicBlock } from '../../../editor/types/basicBlock';
import { Blocks } from '../../../editor/types/blocks';
import { installedBlocks } from '../../../editor/components/Block/BlockSelector';

export function DropTarget({
	vertical = false,
	onDrop,
	dropIds,
}: {
	vertical?: boolean;
	onDrop: (item: BasicBlock & Blocks) => void;
	dropIds?: string[];
}) {
	const defaultDropIds = useMemo(() => Object.keys(installedBlocks).map((type) => `Block:${type}`), []);

	const [{ isOver }, drop] = useDrop(() => ({
		accept: dropIds || defaultDropIds,
		drop: onDrop,
		collect: (monitor) => ({
			isOver: monitor.isOver(),
		}),
	}));

	return (
		<div
			style={{
				backgroundColor: isOver ? '#adceeb' : 'transparent',
				...(vertical ? { width: 5 } : { height: 5 }),
			}}
			ref={drop}
		/>
	);
}
