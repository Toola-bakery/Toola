import { useQuery } from 'react-query';
import { UserSchema } from '../redux/user';
import { useProjects } from './useProjects';
import { useUser } from './useUser';

export function useMembers() {
	const { authToken } = useUser();
	const { currentProjectId } = useProjects();
	const { data: { users = [] } = {}, ...rest } = useQuery<{ users: UserSchema[] }>(
		['/projects/members', { projectId: currentProjectId, populate: true }],
		{
			enabled: !!authToken,
			retry: 1,
			refetchOnWindowFocus: false,
		},
	);

	return { data: users, ...rest };
}
