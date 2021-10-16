import { Button, Tab, Tabs } from '@blueprintjs/core';
import { useState } from 'react';
import styled from 'styled-components';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { useDrawer, useDrawerResizable } from '../../drawer/hooks/useDrawer';
import { GlobalsTab } from './GlobalsTab';
import { QueriesTab } from './Queries/QueriesTab';

const RESIZABLE_WIDTH = 2;
const DevtoolsResizable = styled.div`
	position: absolute;
	top: 0;
	width: 100%;
	height: ${RESIZABLE_WIDTH}px;
	cursor: row-resize;
	&:hover,
	&.move {
		background-color: rgba(0, 0, 0, 0.21);
	}
`;

const DevtoolsStyles = styled.div`
	width: 100%;
	overflow-y: scroll;
	position: relative;

	.bp4-tab-panel {
		margin-top: 0;
		height: calc(100% - 32px);
	}

	.bp4-tabs {
		height: 100%;
	}

	.bp4-tab-list {
		padding: 0 8px;
		border: 0 solid rgb(237, 237, 237);
		border-bottom-width: 1px;
		border-top-width: 1px;
	}
`;

export function Devtools() {
	const { height } = useWindowSize({ height: 1000 });
	const { size, setSize } = useDrawer({ name: 'devtools', maxSize: Math.floor(height * 0.75), defaultSize: 300 });

	const { isMovingRef, resizableRef } = useDrawerResizable({
		axis: 'y',
		reverse: true,
		setSize,
	});

	const [selectedTab, setSelectedTab] = useState('queries');

	return (
		<DevtoolsStyles style={{ height: size }}>
			<Tabs
				id="DevtoolsTabs"
				animate={false}
				onChange={(newTabId) => setSelectedTab(newTabId as string)}
				selectedTabId={selectedTab}
			>
				<Tab style={{ marginTop: 0 }} id="queries" title="Queries" panel={<QueriesTab />} />
				<Tab id="globals" title="Globals" panel={<GlobalsTab />} />
				<Tabs.Expander />
				<Button icon="cross" small minimal />
			</Tabs>
			<DevtoolsResizable
				ref={resizableRef}
				onMouseDown={() => {
					isMovingRef.current = true;
				}}
			/>
		</DevtoolsStyles>
	);
}
