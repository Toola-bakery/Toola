import { ReactNode } from 'react';
import * as React from 'react';
import { ProjectDrawer } from '../../features/drawer/components/ProjectDrawer';
import { useDrawer } from '../../features/drawer/hooks/useDrawer';
import { useWindowSize } from '../../hooks/useWindowSize';

export function RouteWithDrawer({ children }: { children: ReactNode }) {
	const { width } = useWindowSize({ width: 1000 });
	const { width: drawerWidth } = useDrawer();

	return (
		<div style={{ display: 'flex', height: '100%' }}>
			<ProjectDrawer />
			<div style={{ height: '100%', width: width - drawerWidth }}>{children}</div>
		</div>
	);
}
