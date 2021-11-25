import { useMutation, useQuery } from 'react-query';
import { useKy } from '../../../hooks/useKy';
import { UserSchema } from '../redux/user';
import { useProjects } from './useProjects';
import { useUser } from './useUser';

export const Roles = { admin: 100 as const, editor: 50 as const, viewer: 10 as const };
export type RoleIds = typeof Roles[keyof typeof Roles];
export const RoleNames: { [key in RoleIds]: string } = {
	100: 'Admin',
	50: 'Editor',
	10: 'Viewer',
};

export function useMembers() {
	const { authToken } = useUser();
	const { currentProjectId } = useProjects();
	const ky = useKy();
	const { data: { users = [] } = {}, ...rest } = useQuery<{
		users: { user: UserSchema; role: typeof Roles[keyof typeof Roles] }[];
	}>(['/projects/members', { projectId: currentProjectId, populate: true }], {
		enabled: !!authToken,
		retry: 1,
		refetchOnWindowFocus: false,
	});

	const updateRole = useMutation(
		({ userId, role }: { userId: string; role: RoleIds }) => {
			return ky
				.post(`projects/updateRole`, { json: { userId, role, projectId: currentProjectId } })
				.json<{ ok: boolean }>();
		},
		{ onSuccess: () => rest.refetch() },
	);

	return { data: users, ...rest, updateRole };
}
