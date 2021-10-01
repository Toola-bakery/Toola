import { ReactNode } from 'react';
import * as React from 'react';
import { ProjectDrawer } from '../../features/drawer/components/ProjectDrawer';

export function RouteWithDrawer({ children }: { children: ReactNode }) {
	return (
		<div style={{ display: 'flex', height: '100%' }}>
			<ProjectDrawer />
			{children}
		</div>
	);
}
