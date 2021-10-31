import { PropsWithChildren } from 'react';
import { isMobile } from 'react-device-detect';
import { ProjectDrawer } from './ProjectDrawer';
import { useDrawer } from '../hooks/useDrawer';
import { useWindowSize } from '../../../hooks/useWindowSize';

export function LeftDrawerWrapper({ children, hide = false }: PropsWithChildren<{ hide?: boolean }>) {
	const { width } = useWindowSize({ width: 1000 });
	const { size: drawerWidth } = useDrawer({ name: 'leftDrawer' });

	return (
		<div id="drawer-parent" style={{ display: 'flex', height: '100%' }}>
			{hide ? null : <ProjectDrawer />}
			<div id="drawer-child" style={{ height: '100%', width: hide || isMobile ? '100%' : width - drawerWidth }}>
				{children}
			</div>
		</div>
	);
}
