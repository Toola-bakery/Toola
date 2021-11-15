import { Menu, Divider, MenuItem, Position } from '@blueprintjs/core';
import { Popover2 } from '@blueprintjs/popover2';
import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useProjects } from '../../usersAndProjects/hooks/useProjects';
import { useUser } from '../../usersAndProjects/hooks/useUser';
import { DrawerMenuItem } from './DrawerMenuItem';
import { DrawerOmnibar } from './DrawerOmnibar';
import { ProjectAvatar } from './ProjectAvatar';

export function ProjectBar() {
	const { currentProject, projects, selectProject } = useProjects();
	const history = useHistory();
	const location = useLocation();
	const { logOut } = useUser();

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<Popover2
				minimal
				content={
					<Menu
						style={{
							boxShadow: '0 0 0 1px rgb(17 20 24 / 10%), 0 2px 4px rgb(17 20 24 / 20%), 0 8px 24px rgb(17 20 24 / 20%)',
							maxWidth: 250,
						}}
					>
						{projects?.map((project) => (
							<MenuItem
								key={project._id}
								text={project.name}
								onClick={() => {
									selectProject(project._id);
									history.push('/');
								}}
							/>
						))}
						<Divider />
						<MenuItem text="Log out" onClick={logOut} />
					</Menu>
				}
				position={Position.BOTTOM}
			>
				<DrawerMenuItem icon={<ProjectAvatar size={18} />} height={40}>
					{currentProject?.name}
				</DrawerMenuItem>
			</Popover2>
			<DrawerOmnibar>
				<DrawerMenuItem iconStyle={{ color: 'rgba(0, 0, 0, 0.3)' }} icon="search">
					Quick find
				</DrawerMenuItem>
			</DrawerOmnibar>
			<DrawerMenuItem
				active={location.pathname.startsWith('/resources')}
				onClick={() => history.push('/resources')}
				iconStyle={{ color: 'rgba(0, 0, 0, 0.3)' }}
				icon="database"
			>
				Resources
			</DrawerMenuItem>
			<DrawerMenuItem
				active={location.pathname.startsWith('/settings')}
				onClick={() => history.push('/settings/members')}
				iconStyle={{ color: 'rgba(0, 0, 0, 0.3)' }}
				icon="cog"
			>
				Settings & Members
			</DrawerMenuItem>
		</div>
	);
}
