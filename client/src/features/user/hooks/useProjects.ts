import { useCallback, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useImmerState } from '../../../redux/hooks';
import { useUser } from './useUser';

export type ProjectSchema = {
	_id: string;
	name: string;
	owner: string;
	createdBy: string;
	users: string[];
};

export function useProjectsState() {
	const [data = {}, immer] = useImmerState<{
		currentProjectId?: string;
		projectsCache?: ProjectSchema[];
	}>('projects', {});
	const { currentProjectId, projectsCache } = data;
	return { currentProjectId, projectsCache, immer };
}

export function useProjects() {
	const { currentProjectId, projectsCache, immer } = useProjectsState();
	const { authToken } = useUser();
	const {
		isLoading,
		isFetched,
		data: { projects } = { projects: [] },
		refetch,
	} = useQuery<{ projects: ProjectSchema[] }>('/projects/get', {
		enabled: !!authToken,
		initialData: { projects: projectsCache },
		retry: 1,
	});

	useEffect(() => {
		if (projects)
			immer((draft) => {
				draft.projectsCache = projects;
			});
	}, [immer, projects]);

	const selectProject = useCallback(
		(projectId: string) => {
			immer((draft) => {
				draft.currentProjectId = projectId;
			});
		},
		[immer],
	);

	const currentProject = useMemo(() => {
		return projects?.find?.((project) => project._id === currentProjectId);
	}, [projects, currentProjectId]);

	return { currentProjectId, currentProject, selectProject, isLoading, isFetched, projects, refetch };
}
