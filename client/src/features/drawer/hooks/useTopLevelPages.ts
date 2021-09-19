import { useMemo } from 'react';
import { useQuery } from 'react-query';
import { useProjects } from '../../user/hooks/useProjects';

export function useTopLevelPages() {
	const { currentProjectId } = useProjects();

	const { data = [], refetch } = useQuery<{ title: string; id: string }[]>(
		['/pages/topLevelPages', { projectId: currentProjectId || '' }],
		{ enabled: !!currentProjectId },
	);

	const sortedList = useMemo(
		() =>
			data.sort((a, b) => {
				if (a.title?.toLowerCase() < b.title?.toLowerCase()) return -1;
				if (a.title?.toLowerCase() > b.title?.toLowerCase()) return 1;
				return 0;
			}) as { title: string; id: string }[],
		[data],
	);

	return { pages: sortedList, refetch };
}
