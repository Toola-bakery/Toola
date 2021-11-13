import { Button, Tab, Tabs } from '@blueprintjs/core';
import styled from 'styled-components';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { useDrawer, useDrawerResizable } from '../../drawer/hooks/useDrawer';
import { DevtoolsStates, useIsDevtoolsOpen } from '../../editor/hooks/useIsDevtoolsOpen';
import { GlobalsTab } from './Globals/GlobalsTab';
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
	position: relative;

	border: 0 solid rgb(237, 237, 237);
	border-top-width: 1px;

	background-color: white;
	z-index: 9;

	.bp4-tab-panel {
		margin-top: 0;
		height: calc(100% - 31px);
		overflow-y: auto;
		min-height: unset !important;
	}

	.bp4-tabs {
		height: 100%;
	}

	.bp4-tab-list {
		padding: 0 8px;
		border: 0 solid rgb(237, 237, 237);
		border-bottom-width: 1px;
		align-items: center;
	}
`;

export function Devtools() {
	const { setDevtoolsOpen, isDevtoolsOpen } = useIsDevtoolsOpen();
	const { height } = useWindowSize({ height: 1000 });
	const { size, setSize } = useDrawer({ name: 'devtools', maxSize: Math.floor(height * 0.75), defaultSize: 300 });
	const { setOpen: setSchemaOpen, isOpen: isSchemaOpen } = useDrawer({ name: 'schemaDrawer' });

	const { isMovingRef, resizableRef } = useDrawerResizable({
		axis: 'y',
		reverse: true,
		setSize,
	});

	if (!isDevtoolsOpen) return null;

	return (
		<DevtoolsStyles className="DevtoolsStyles" style={{ height: size }}>
			<Tabs
				className="devtools-tabs"
				id="DevtoolsTabs"
				animate={false}
				onChange={(newTabId) => setDevtoolsOpen(newTabId as DevtoolsStates)}
				selectedTabId={isDevtoolsOpen}
			>
				<Tab style={{ marginTop: 0 }} id="queries" title="Queries" panel={<QueriesTab />} />
				<Tab id="blocks" title="Blocks" panel={<GlobalsTab />} />
				<Tabs.Expander />
				<div style={{ display: 'flex', alignContent: 'center' }}>
					<Button
						title="Open Resources Schema Panel"
						icon="panel-stats"
						active={isSchemaOpen}
						small
						minimal
						onClick={() => setSchemaOpen(!isSchemaOpen)}
					/>
					<Button icon="cross" small minimal onClick={() => setDevtoolsOpen(false)} />
				</div>
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
