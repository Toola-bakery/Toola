import * as React from 'react';
import AddIcon from '@material-ui/icons/Add';
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
import { v4 } from 'uuid';
import { Config } from '../../config';
import { PageBlockProps } from '../editor/components/Page';
import { BasicBlock } from '../editor/types/basicBlock';

function DrawerItem({ page }: { page: { title: string; id: string } }) {
	return (
		<Link to={`/${page.id}`}>
			<ListItem
				sx={{
					pt: { sm: 0.5 },
					pb: { sm: 0.5 },

					'& .MuiListItemText-primary': {
						fontSize: 14,
					},
				}}
				button
			>
				<ListItemIcon sx={{ minWidth: 20 }}>
					<DescriptionIcon style={{ fontSize: 16 }} />
				</ListItemIcon>

				<ListItemText primary={page.title} />
			</ListItem>
		</Link>
	);
}

export function ProjectDrawer({ drawerWidth }: { drawerWidth: number }): JSX.Element {
	const [pages, setPages] = useState<{ title: string; id: string }[]>([]);

	useEffect(() => {
		ky.get(`${Config.domain}/pages/topLevelPages`)
			.json<{ title: string; id: string }[]>()
			.then((v) =>
				setPages(
					v.sort((a, b) => {
						if (a.title?.toLowerCase() < b.title?.toLowerCase()) return -1;
						if (a.title?.toLowerCase() > b.title?.toLowerCase()) return 1;
						return 0;
					}),
				),
			);
	}, []);

	const menu = (
		<div>
			<List
				subheader={
					<ListSubheader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
						Pages
						<AddIcon
							onClick={() => {
								ky.get(`${Config.domain}/pages/create`, { searchParams: { id: v4() } }).json<{
									value: { page: BasicBlock & PageBlockProps };
								}>();
							}}
						/>
					</ListSubheader>
				}
			>
				{pages.map((page) => (
					<DrawerItem key={page.id} page={page} />
				))}
			</List>

			<List subheader={<ListSubheader>Infra</ListSubheader>}>
				{/*{['Databases'].map((text) => (*/}
				{/*	<DrawerItem key={text} text={text} />*/}
				{/*))}*/}
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
