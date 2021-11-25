import { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useImmerState } from '../../../redux/hooks';
import { Roles } from './useMembers';
import { useUser } from './useUser';

export type ProjectSchema = {
	_id: string;
	name: string;
	owner: string;
	createdBy: string;
	usersWithPermissions: { [_id: string]: { role: typeof Roles[keyof typeof Roles] } };
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
	const { authToken, userId } = useUser();
	const { data: { projects } = {}, ...rest } = useQuery<{ projects: ProjectSchema[] }>('/projects/get', {
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

	const currentRole = useMemo(() => {
		if (!userId) return null;
		return (
			projects?.find?.((project) => project._id === currentProjectId)?.usersWithPermissions?.[userId]?.role ||
			Roles.viewer
		);
	}, [userId, projects, currentProjectId]);

	return {
		currentRole,
		currentProjectId,
		currentProject,
		selectProject,
		projects,
		...rest,
	};
}
