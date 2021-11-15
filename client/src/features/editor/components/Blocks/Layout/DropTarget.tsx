import React, { useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { BasicBlock } from '../../../types/basicBlock';
import { Blocks } from '../../../types/blocks';
import { installedBlocks } from '../../Block/BlockSelector';

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
				backgroundColor: isOver ? 'red' : 'transparent',
				...(vertical ? { width: 5 } : { height: 5 }),
			}}
			ref={drop}
		/>
	);
}
