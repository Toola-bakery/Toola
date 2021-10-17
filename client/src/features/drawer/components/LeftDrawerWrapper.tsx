import { PropsWithChildren, ReactNode } from 'react';
import * as React from 'react';
import { ProjectDrawer } from './ProjectDrawer';
import { useDrawer } from '../hooks/useDrawer';
import { useWindowSize } from '../../../hooks/useWindowSize';

export function LeftDrawerWrapper({ children, hide = false }: PropsWithChildren<{ hide?: boolean }>) {
	const { width } = useWindowSize({ width: 1000 });
	const { size: drawerWidth } = useDrawer({ name: 'leftDrawer' });

	return (
		<div style={{ display: 'flex', height: '100%' }}>
			{hide ? null : <ProjectDrawer />}
			<div style={{ height: '100%', width: hide ? '100%' : width - drawerWidth }}>{children}</div>
		</div>
	);
}
