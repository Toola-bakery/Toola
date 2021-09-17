import { PropsWithChildren, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, RouteProps, Redirect, useHistory } from 'react-router-dom';
import { useProjects } from '../features/user/hooks/useProjects';
import { useUser } from '../features/user/hooks/useUser';
import CreateProject from './CreateProject';
import EditorRoute from './EditorRoute';
import LoginRoute from './LoginRoute';

function PrivateRoute({
	children,
	allowWithoutProject = false,
	...rest
}: PropsWithChildren<{ allowWithoutProject?: boolean } & RouteProps>) {
	const { userId } = useUser();
	const { currentProjectId, projects, isFetched, selectProject } = useProjects();
	const history = useHistory();

	useEffect(() => {
		if (!userId) return history.replace('/login');
		if (allowWithoutProject) return;
		if (!projects?.length && isFetched) return history.replace('/createProject');
		if (projects?.length && !currentProjectId) selectProject(projects[0]._id);
	}, [allowWithoutProject, isFetched, currentProjectId, history, userId, projects, selectProject]);

	return <Route {...rest} render={() => (userId && (currentProjectId || allowWithoutProject) ? children : null)} />;
}

export function AppRouters() {
	return (
		<Router>
			<Switch>
				<Route path="/login">
					<LoginRoute />
				</Route>

				<PrivateRoute allowWithoutProject path="/createProject">
					<CreateProject />
				</PrivateRoute>

				<PrivateRoute path="/:pageId">
					<EditorRoute />
				</PrivateRoute>
				<PrivateRoute path="/">
					<EditorRoute />
				</PrivateRoute>
			</Switch>
		</Router>
	);
}
