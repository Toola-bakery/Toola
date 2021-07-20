import * as React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import DescriptionIcon from '@material-ui/icons/Description';
import Drawer from '@material-ui/core/Drawer';
import { ListSubheader } from '@material-ui/core';

export function ProjectDrawer({ drawerWidth }: { drawerWidth: number }): JSX.Element {
	const menu = (
		<div>
			<List subheader={<ListSubheader>Pages</ListSubheader>}>
				{['App Dashboard', 'Notes', 'App Admin', 'Drafts'].map((text, index) => (
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
				))}
			</List>

			<List subheader={<ListSubheader>Databases</ListSubheader>}>
				{['All mail', 'Trash', 'Spam'].map((text, index) => (
					<ListItem button key={text}>
						<ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
						<ListItemText primary={text} />
					</ListItem>
				))}
			</List>
		</div>
	);

	const [mobileOpen, setMobileOpen] = React.useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const container = window.document.body;

	return (
		<>
			<Drawer
				container={container}
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
				{menu}
			</Drawer>
		</>
	);
}
