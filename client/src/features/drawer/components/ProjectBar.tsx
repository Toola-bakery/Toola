import { Menu, Divider, Popover, MenuItem, Position } from '@blueprintjs/core';
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useProjects } from '../../usersAndProjects/hooks/useProjects';
import { useUser } from '../../usersAndProjects/hooks/useUser';
import { DrawerMenuItem } from './DrawerMenuItem';
import { DrawerOmnibar } from './DrawerOmnibar';
import { ProjectAvatar } from './ProjectAvatar';

export function ProjectBar() {
	const { currentProject, projects, selectProject } = useProjects();
	const history = useHistory();
	const { logOut } = useUser();

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<Popover
				minimal
				content={
					<Menu>
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
			</Popover>
			<DrawerOmnibar>
				<DrawerMenuItem iconStyle={{ color: 'rgba(0, 0, 0, 0.3)' }} icon="search">
					Quick find
				</DrawerMenuItem>
			</DrawerOmnibar>
			<DrawerMenuItem
				onClick={() => history.push('/resources')}
				iconStyle={{ color: 'rgba(0, 0, 0, 0.3)' }}
				icon="database"
			>
				Resources
			</DrawerMenuItem>
			<DrawerMenuItem
				onClick={() => history.push('/settings/members')}
				iconStyle={{ color: 'rgba(0, 0, 0, 0.3)' }}
				icon="cog"
			>
				Settings & Members
			</DrawerMenuItem>
		</div>
	);
}
