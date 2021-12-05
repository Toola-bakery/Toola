import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { usePagesMutations } from '../../editor/components/Page/hooks/usePagesMutations';
import { useProjects } from '../../usersAndProjects/hooks/useProjects';
import { useTopLevelPages } from './useTopLevelPages';

export function useRelocateToAnyPageByCondition(needRelocate: boolean) {
	const { pages, isFetched } = useTopLevelPages();
	const { currentProjectId, projects, isSuccess, selectProject } = useProjects();
	const { navigate } = usePageNavigator();
	const { createPage } = usePagesMutations();
	const history = useHistory();

	useEffect(() => {
		if (needRelocate) {
			if (pages[0]) return navigate(pages[0].id);
			if (currentProjectId && isFetched) return createPage();
			if (!projects?.length && isSuccess) return history.replace('/createProject');
			if (projects?.length && !currentProjectId) selectProject(projects[0]._id);
		}
	}, [
		pages,
		navigate,
		needRelocate,
		createPage,
		currentProjectId,
		isFetched,
		projects,
		isSuccess,
		history,
		selectProject,
	]);
}
