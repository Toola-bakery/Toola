import { Button, Icon } from '@blueprintjs/core';
import React from 'react';
import { ConnectDragSource } from 'react-dnd';
import { useBlock } from '../../hooks/useBlock';
import { useBlockContext } from '../../hooks/useBlockContext';

export function BlockBadge({ show, dragRef }: { show: boolean; dragRef: ConnectDragSource }) {
	const { id } = useBlock();
	const { onDragClick } = useBlockContext();
	return (
		<div
			ref={dragRef}
			onClick={onDragClick}
			className="block-badge"
			style={{
				position: 'absolute',
				bottom: 'calc(100%)',
				paddingBottom: 1,
				zIndex: 9999999999,
				left: 25,
				opacity: show ? 1 : 0,
				cursor: 'move',
			}}
		>
			<div
				style={{
					borderRadius: 2,
					backgroundColor: '#4287ea',
					padding: 2,
					paddingLeft: 2,
					paddingRight: 4,
					color: 'white',
					fontSize: 10,
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
				}}
			>
				<Icon
					icon="drag-handle-vertical"
					size={10}
					style={{
						color: 'white',
						cursor: 'move',
					}}
				/>
				{id}
			</div>
		</div>
	);
}
