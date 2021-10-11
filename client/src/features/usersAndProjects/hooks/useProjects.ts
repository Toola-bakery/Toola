import { useCallback, useMemo } from 'react';
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
	const [data, immer] = useImmerState<{
		currentProjectId?: string;
	}>('projects');

	const { currentProjectId } = data || {};
	return { currentProjectId, immer };
}

export function useProjects() {
	const { currentProjectId, immer } = useProjectsState();
	const { authToken } = useUser();
	const {
		isLoading,
		isFetched,
		data: { projects } = {},
		refetch,
		remove,
	} = useQuery<{ projects: ProjectSchema[] }>('/projects/get', {
		enabled: !!authToken,
		retry: 1,
		refetchOnWindowFocus: false,
	});

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

	return {
		currentProjectId,
		currentProject,
		selectProject,
		remove,
		isLoading,
		isFetched,
		projects,
		refetch,
	};
}
