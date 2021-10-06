import ky from 'ky';
import { useCallback } from 'react';
import { v4 } from 'uuid';
import { Config } from '../../../../../Config';
import { usePageNavigator } from '../../../../../hooks/usePageNavigator';
import { useTopLevelPages } from '../../../../drawer/hooks/useTopLevelPages';
import { useProjects } from '../../../../user/hooks/useProjects';
import { useUser } from '../../../../user/hooks/useUser';
import { PageBlockProps } from '../Page';
import { BasicBlock } from '../../../types/basicBlock';

export function usePagesMutations() {
	const { authToken } = useUser();
	const { currentProjectId } = useProjects();
	const { navigate } = usePageNavigator();
	const { refetch, appendPage } = useTopLevelPages();

	const createPage = useCallback(() => {
		const id = v4();
		ky.post(`${Config.domain}/pages/create`, {
			json: { id, projectId: currentProjectId },
			headers: { 'auth-token': authToken },
		}).json<{
			value: { page: BasicBlock & PageBlockProps };
		}>();
		appendPage({ title: 'Untitled', id });
		navigate(id);
	}, [appendPage, authToken, currentProjectId, navigate]);

	const deletePage = useCallback(
		async (pageId: string) => {
			await ky
				.post(`${Config.domain}/pages/delete`, {
					json: { id: pageId, projectId: currentProjectId },
					headers: { 'auth-token': authToken },
				})
				.json<{
					value: { page: BasicBlock & PageBlockProps };
				}>();
			refetch();
		},
		[authToken, currentProjectId, refetch],
	);

	return { createPage, deletePage };
}
