import React from 'react';
import { useDrop } from 'react-dnd';
import { BlockTypes } from '../../../helpers/BlockCreators';
import { BasicBlock } from '../../../types/basicBlock';
import { Blocks } from '../../../types/blocks';

const DropIds = BlockTypes.map((type) => `Block:${type}`);

export function DropTarget({
	vertical = false,
	onDrop,
	dropIds = DropIds,
}: {
	vertical?: boolean;
	onDrop: (item: BasicBlock & Blocks) => void;
	dropIds?: string[];
}) {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: dropIds,
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
