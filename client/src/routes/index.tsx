import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import CreateProjectRoute from './CreateProjectRoute';
import EditorRoute from './EditorRoute';
import LoginRoute from './LoginRoute';
import { ResourcesRoute } from './Resources/ResourcesRoute';
import { PrivateRoute } from './wrappers/PrivateRoute';
import { RouteWithDrawer } from './wrappers/RouteWithDrawer';

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
					<RouteWithDrawer>
						<ResourcesRoute />
					</RouteWithDrawer>
				</PrivateRoute>

				<PrivateRoute path={['/:pageId', '/']}>
					<RouteWithDrawer>
						<EditorRoute />
					</RouteWithDrawer>
				</PrivateRoute>
			</Switch>
		</Router>
	);
}
