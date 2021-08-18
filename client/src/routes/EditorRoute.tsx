import * as React from 'react';
import Box from '@material-ui/core/Box';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ProjectDrawer } from '../features/drawer/ProjectDrawer';
import { Page } from '../features/editor/components/Page';
import { WSProvider } from '../features/ws/components/WSProvider';

const drawerWidth = 240;

const queryClient = new QueryClient();

export default function EditorRoute(): JSX.Element {
	return (
		<QueryClientProvider client={queryClient}>
			<WSProvider>
				<Box sx={{ display: 'flex' }}>
					<Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
						<ProjectDrawer drawerWidth={drawerWidth} />
					</Box>
					<Box component="main" sx={{ flexGrow: 1 }}>
						<Page />
					</Box>
				</Box>
			</WSProvider>
		</QueryClientProvider>
	);
}
