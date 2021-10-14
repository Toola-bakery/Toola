import { useMutation } from 'react-query';
import { Config } from '../../../Config';
import { useKy } from '../../../hooks/useKy';
import { useProjects } from '../../usersAndProjects/hooks/useProjects';

export function useMutateResource() {
	const ky = useKy();
	const { currentProjectId } = useProjects();
	return useMutation((database: any) => {
		return ky.post(`databases/post`, { json: { database, projectId: currentProjectId } }).json();
	});
}
