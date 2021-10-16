import * as React from 'react';
import styled from 'styled-components';
import { useDrawer, useDrawerResizable } from '../hooks/useDrawer';
import { ProjectBar } from './ProjectBar';
import { TopLevelPages } from './TopLevelPages';

const RESIZABLE_WIDTH = 2;
const DrawerResizable = styled.div`
	position: absolute;
	right: 0;
	width: ${RESIZABLE_WIDTH}px;
	height: 100%;
	cursor: col-resize;
	&:hover,
	&.move {
		background-color: rgba(0, 0, 0, 0.21);
	}
`;

export function ProjectDrawer() {
	const { size, setSize } = useDrawer({ name: 'leftDrawer' });
	const { resizableRef, isMovingRef } = useDrawerResizable({ setSize });

	return (
		<div style={{ width: size, height: '100%', position: 'relative' }}>
			<div
				style={{
					width: size,
					height: '100%',
					backgroundColor: 'rgb(240, 240, 240)',
					display: 'flex',
					flexDirection: 'row',
				}}
			>
				<div style={{ width: size, display: 'flex', flexDirection: 'column' }}>
					<ProjectBar />
					<div style={{ overflowY: 'auto', flexShrink: 1 }}>
						<TopLevelPages />
					</div>
				</div>
				<DrawerResizable
					ref={resizableRef}
					onMouseDown={() => {
						isMovingRef.current = true;
					}}
				/>
			</div>
		</div>
	);
}
