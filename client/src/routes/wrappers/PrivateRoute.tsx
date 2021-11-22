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
	const { currentProjectId, projects, isSuccess, selectProject } = useProjects();
	const history = useHistory();

	useEffect(() => {
		if (!userId) return history.replace('/');
		if (allowWithoutProject) return;
		if (!projects?.length && isSuccess) return history.replace('/createProject');
		if (projects?.length && !currentProjectId) selectProject(projects[0]._id);
	}, [allowWithoutProject, isSuccess, currentProjectId, history, userId, projects, selectProject]);

	return <Route {...rest} render={() => (userId && (currentProjectId || allowWithoutProject) ? children : null)} />;
}
