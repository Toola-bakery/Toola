import { Menu, Popover, MenuItem, Position } from '@blueprintjs/core';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useProjects } from '../../user/hooks/useProjects';
import { useUser } from '../../user/hooks/useUser';
import { DrawerMenuItem } from './DrawerMenuItem';
import { ProjectAvatar } from './ProjectAvatar';

export function ProjectBar() {
	const { currentProject } = useProjects();
	const history = useHistory();
	const { logOut } = useUser();

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<Popover
				minimal
				content={
					<Menu>
						<MenuItem text="Log out" onClick={logOut} />
					</Menu>
				}
				position={Position.BOTTOM}
			>
				<DrawerMenuItem icon={<ProjectAvatar size={18} />} height={40}>
					{currentProject?.name}
				</DrawerMenuItem>
			</Popover>
			<DrawerMenuItem
				onClick={() => history.push('/resources')}
				iconStyle={{ color: 'rgba(0, 0, 0, 0.3)' }}
				icon="database"
			>
				Resources
			</DrawerMenuItem>
			<DrawerMenuItem iconStyle={{ color: 'rgba(0, 0, 0, 0.3)' }} icon="cog">
				Settings & Members
			</DrawerMenuItem>
		</div>
	);
}
