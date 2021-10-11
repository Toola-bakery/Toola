import { Menu, MenuDivider, MenuItem } from '@blueprintjs/core';
import { useMemo } from 'react';
import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export function SettingsDrawer() {
	const location = useLocation();

	const history = useHistory();

	const projectItems = [
		{ text: 'Members', path: '/settings/members' },
		{ text: 'Settings', path: '/settings/project' },
	];

	const userItems = [
		{ text: 'Profile', path: '/settings/profile' }, //
	];

	return (
		<div style={{ height: '100%', backgroundColor: 'rgba(240, 240, 240, 0.7)' }}>
			<Menu style={{ width: 150, backgroundColor: 'rgba(240, 240, 240, 0.7)' }}>
				<MenuDivider title="Organization" />
				{projectItems.map((item) => (
					<MenuItem
						key={item.path}
						text={item.text}
						onClick={() => history.push(item.path)}
						active={location.pathname === item.path}
					/>
				))}
			</Menu>

			<Menu style={{ width: 150, backgroundColor: 'rgba(240, 240, 240, 0.7)' }}>
				<MenuDivider title="User" />
				{userItems.map((item) => (
					<MenuItem
						key={item.path}
						text={item.text}
						onClick={() => history.push(item.path)}
						active={location.pathname === item.path}
					/>
				))}
			</Menu>
		</div>
	);
}
