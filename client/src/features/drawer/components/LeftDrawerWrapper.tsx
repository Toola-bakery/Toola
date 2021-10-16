import { ReactNode } from 'react';
import * as React from 'react';
import { ProjectDrawer } from './ProjectDrawer';
import { useDrawer } from '../hooks/useDrawer';
import { useWindowSize } from '../../../hooks/useWindowSize';

export function LeftDrawerWrapper({ children }: { children: ReactNode }) {
	const { width } = useWindowSize({ width: 1000 });
	const { size: drawerWidth } = useDrawer({ name: 'leftDrawer' });

	return (
		<div style={{ display: 'flex', height: '100%' }}>
			<ProjectDrawer />
			<div style={{ height: '100%', width: width - drawerWidth }}>{children}</div>
		</div>
	);
}
