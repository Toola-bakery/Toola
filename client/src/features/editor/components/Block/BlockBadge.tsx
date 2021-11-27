import { Button, Icon } from '@blueprintjs/core';
import React, { useEffect, useState } from 'react';
import { ConnectDragSource } from 'react-dnd';
import { useBlock } from '../../hooks/useBlock';
import { useBlockContext } from '../../hooks/useBlockContext';

export function BlockBadge({ show, dragRef }: { show: boolean; dragRef: ConnectDragSource }) {
	const { id } = useBlock();
	const { showInspector } = useBlockContext();
	const [forceDisplay, setForceDisplay] = useState<typeof show>(show);

	useEffect(() => {
		if (show) return setForceDisplay(true);
		const timer = setTimeout(() => setForceDisplay(false), 20);
		return () => clearTimeout(timer);
	}, [show]);

	return (
		<div
			ref={dragRef}
			onClick={showInspector}
			className="block-badge"
			style={{
				position: 'absolute',
				bottom: 'calc(100%)',
				paddingBottom: 1,
				zIndex: 9999999999,
				left: 25,
				display: show || forceDisplay ? 'block' : 'none',
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
