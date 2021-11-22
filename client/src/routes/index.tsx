import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CreateProjectRoute from './CreateProjectRoute';
import EditorRoute from './EditorRoute';
import { Landing } from './Landing';
import LoginRoute from './LoginRoute';
import { ResourcesRoute } from './Resources/ResourcesRoute';
import { SettingsAndMembersRoute } from './SettingsAndMembers/SettingsAndMembersRoute';
import { PrivateRoute } from './wrappers/PrivateRoute';
import { LeftDrawerWrapper } from '../features/drawer/components/LeftDrawerWrapper';

export function AppRouters() {
	return (
		<Router>
			<Switch>
				<Route path="/login">
					<LoginRoute />
				</Route>

				<PrivateRoute allowWithoutProject path="/createProject">
					<CreateProjectRoute />
				</PrivateRoute>

				<PrivateRoute path="/resources">
					<LeftDrawerWrapper>
						<ResourcesRoute />
					</LeftDrawerWrapper>
				</PrivateRoute>

				<PrivateRoute path="/settings">
					<LeftDrawerWrapper>
						<SettingsAndMembersRoute />
					</LeftDrawerWrapper>
				</PrivateRoute>

				<PrivateRoute path={['/:pageId']}>
					<EditorRoute />
				</PrivateRoute>
				<Route path="/landing">
					<Landing />
				</Route>
				<Route path="/">
					<Landing allowRedirect />
				</Route>
			</Switch>
		</Router>
	);
}
