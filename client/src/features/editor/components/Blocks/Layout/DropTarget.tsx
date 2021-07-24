import React from 'react';

import { useDrop } from 'react-dnd';
import { BasicBlock, Blocks } from '../../../types';

export function DropTarget({
	vertical = false,
	onDrop,
}: {
	vertical?: boolean;
	onDrop: (item: BasicBlock & Blocks) => void;
}) {
	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'Block',
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
