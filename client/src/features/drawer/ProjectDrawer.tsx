import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DescriptionIcon from '@material-ui/icons/Description';
import Drawer from '@material-ui/core/Drawer';
import { Link } from 'react-router-dom';

import { useEffect, useState } from 'react';
import ky from 'ky';
import { Config } from '../../config';

function DrawerItem({ text }: { text: string }) {
	return (
		<Link to={`/${text}`}>
			<ListItem
				sx={{
					pt: { sm: 0.5 },
					pb: { sm: 0.5 },

					'& .MuiListItemText-primary': {
						fontSize: 14,
					},
				}}
				button
				key={text}
			>
				<ListItemIcon sx={{ minWidth: 20 }}>
					<DescriptionIcon style={{ fontSize: 16 }} />
				</ListItemIcon>

				<ListItemText primary={text} />
			</ListItem>
		</Link>
	);
}

export function ProjectDrawer({ drawerWidth }: { drawerWidth: number }): JSX.Element {
	const [pages, setPages] = useState<string[]>([]);

	useEffect(() => {
		ky.get(`${Config.domain}/pages`)
			.json<string[]>()
			.then((v) => setPages(v));
	}, []);
	const menu = (
		<div>
			<List subheader={<ListSubheader>Pages</ListSubheader>}>
				{pages.map((text) => (
					<DrawerItem key={text} text={text} />
				))}
			</List>

			<List subheader={<ListSubheader>Infra</ListSubheader>}>
				{['Gateway', 'Domains', 'Functions'].map((text) => (
					<DrawerItem text={text} />
				))}
			</List>
		</div>
	);

	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	return (
		<>
			<Drawer
				container={window.document.body}
				variant="temporary"
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true, // Better open performance on mobile.
				}}
				sx={{
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: drawerWidth,
					},
				}}
			>
				{menu}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: 'none', sm: 'block' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: drawerWidth,
					},
				}}
				open
			>
				{/*<Toolbar />*/}

				{menu}
			</Drawer>
		</>
	);
}
