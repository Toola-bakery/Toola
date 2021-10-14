import { Route, Switch } from 'react-router-dom';
import { SettingsDrawer } from '../../features/settingsAndMembers/components/SettingsDrawer';
import { MembersListRoute } from './MembersListRoute';
import { ProjectSettingsRoute } from './ProjectSettingsRoute';

export function SettingsAndMembersRoute() {
	return (
		<div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
			<SettingsDrawer />
			<Switch>
				<Route path="/settings/members">
					<MembersListRoute />
				</Route>
				<Route path="/settings/project">
					<ProjectSettingsRoute />
				</Route>
			</Switch>
		</div>
	);
}
