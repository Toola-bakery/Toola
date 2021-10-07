import { useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { useProjects } from '../../user/hooks/useProjects';

type TopLevelPageItem = { title: string; id: string };

export function useTopLevelPages() {
	const { currentProjectId } = useProjects();
	const queryClient = useQueryClient();

	const { data = [], refetch } = useQuery<TopLevelPageItem[]>(
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

	const appendPage = useCallback(
		({ title, id }: { title: string; id: string }) => {
			queryClient.setQueryData<TopLevelPageItem[]>(
				['/pages/topLevelPages', { projectId: currentProjectId || '' }],
				[...data, { title, id }],
			);
		},
		[currentProjectId, data, queryClient],
	);

	const renamePage = useCallback(
		({ title, id }: { title: string; id: string }) => {
			const items = data.map((item) => (item.id !== id ? item : { title, id }));
			queryClient.setQueryData<TopLevelPageItem[]>(
				['/pages/topLevelPages', { projectId: currentProjectId || '' }],
				items,
			);
		},
		[currentProjectId, data, queryClient],
	);

	const deletePage = useCallback(
		(id: string) => {
			const items = data.filter((item) => item.id !== id);
			queryClient.setQueryData<TopLevelPageItem[]>(
				['/pages/topLevelPages', { projectId: currentProjectId || '' }],
				items,
			);
		},
		[currentProjectId, data, queryClient],
	);

	return { pages: sortedList, refetch, appendPage, renamePage, deletePage };
}
