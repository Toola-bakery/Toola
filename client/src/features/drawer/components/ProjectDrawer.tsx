import { useEffect, useRef } from 'react';
import * as React from 'react';
import styled from 'styled-components';
import { useDrawer } from '../hooks/useDrawer';
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
	const { width, setWidth } = useDrawer();

	const isMoving = useRef(false);
	const resizableRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleCursor(event: MouseEvent) {
			if (!isMoving.current) return;
			resizableRef.current?.classList.add('move');
			setWidth(event.pageX + 1);
			event.preventDefault();
		}
		function handleMouseUp() {
			resizableRef.current?.classList.remove('move');
			isMoving.current = false;
		}

		document.addEventListener('mousemove', handleCursor);
		document.addEventListener('mouseup', handleMouseUp);

		return () => {
			document.removeEventListener('mousemove', handleCursor);
			document.removeEventListener('mouseup', handleMouseUp);
		};
	});

	return (
		<div style={{ width, height: '100%', position: 'relative' }}>
			<div
				style={{
					width,
					height: '100%',
					backgroundColor: 'rgb(240, 240, 240)',
					display: 'flex',
					flexDirection: 'row',
					position: 'fixed',
				}}
			>
				<div style={{ width, display: 'flex', flexDirection: 'column' }}>
					<ProjectBar />
					<div style={{ overflowY: 'auto', flexShrink: 1 }}>
						<TopLevelPages />
					</div>
				</div>
				<DrawerResizable
					ref={resizableRef}
					onMouseDown={() => {
						isMoving.current = true;
					}}
				/>
			</div>
		</div>
	);
}
