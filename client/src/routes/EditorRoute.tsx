import * as React from 'react';
import { ProjectDrawer } from '../features/drawer/ProjectDrawer';
import { Page } from '../features/editor/components/Page';
import { WSProvider } from '../features/ws/components/WSProvider';

const drawerWidth = 240;

export default function EditorRoute(): JSX.Element {
	return (
		<WSProvider>
			<div style={{ display: 'flex', height: '100%' }}>
				<div style={{ width: drawerWidth, flexShrink: 0 }}>
					<ProjectDrawer drawerWidth={drawerWidth} />
				</div>
				<div style={{ flexGrow: 1, height: '100%' }}>
					<Page />
				</div>
			</div>
		</WSProvider>
	);
}
