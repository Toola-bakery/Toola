import { PropsWithChildren, useEffect } from 'react';
import { Route, RouteProps, useHistory } from 'react-router-dom';
import { useProjects } from '../../features/usersAndProjects/hooks/useProjects';
import { useUser } from '../../features/usersAndProjects/hooks/useUser';

export function PrivateRoute({
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
