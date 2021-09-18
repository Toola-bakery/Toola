import * as React from 'react';
import { ProjectDrawer } from '../features/drawer/components/ProjectDrawer';
import { useRelocateToAnyPageIfNoPageSelected } from '../features/drawer/hooks/useRelocateToAnyPageIfNoPageSelected';
import { Page } from '../features/editor/components/Page';
import { WSProvider } from '../features/ws/components/WSProvider';

export default function EditorRoute() {
	useRelocateToAnyPageIfNoPageSelected();

	return (
		<WSProvider>
			<div style={{ display: 'flex', height: '100%' }}>
				<ProjectDrawer />
				<Page />
			</div>
		</WSProvider>
	);
}
