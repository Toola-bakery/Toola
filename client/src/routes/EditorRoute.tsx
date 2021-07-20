import * as React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
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
