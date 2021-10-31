import { isMobile } from 'react-device-detect';
import * as React from 'react';
import { push as BurgerMenu } from 'react-burger-menu';
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
	const { size, setSize, isOpen, setOpen } = useDrawer({ name: 'leftDrawer' });
	const { resizableRef, isMovingRef } = useDrawerResizable({ setSize });

	if (isMobile)
		return (
			<BurgerMenu
				isOpen={isOpen}
				onStateChange={(nextState) => setOpen(nextState.isOpen)}
				outerContainerId="drawer-parent"
				pageWrapId="drawer-child"
				customBurgerIcon={false}
			>
				<div style={{ backgroundColor: 'rgb(240, 240, 240)', height: '100%' }}>
					<ProjectBar />
					<TopLevelPages />
				</div>
			</BurgerMenu>
		);

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
