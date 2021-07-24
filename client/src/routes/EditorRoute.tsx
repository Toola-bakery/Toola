import * as React from 'react';
import Box from '@material-ui/core/Box';
import { ProjectDrawer } from '../features/drawer/ProjectDrawer';
import { Page } from '../features/editor/components/Page';
import { BlockMenuProvider } from '../features/editor/providers/BlockMenuProvider';
import { ExecutorProvider } from '../features/executor/components/ExecutorProvider';

const drawerWidth = 240;

export default function EditorRoute(): JSX.Element {
	return (
		<ExecutorProvider>
			<BlockMenuProvider>
				<Box sx={{ display: 'flex' }}>
					<Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
						<ProjectDrawer drawerWidth={drawerWidth} />
					</Box>
					<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
						<Page />
					</Box>
				</Box>
			</BlockMenuProvider>
		</ExecutorProvider>
	);
}
