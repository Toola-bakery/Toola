import { useEffect } from 'react';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { usePagesMutations } from '../../editor/components/Page/hooks/usePagesMutations';
import { useTopLevelPages } from './useTopLevelPages';

export function useRelocateToAnyPageByCondition(needRelocate: boolean) {
	const { pages } = useTopLevelPages();
	const { navigate } = usePageNavigator();
	const { createPage } = usePagesMutations();

	useEffect(() => {
		if (needRelocate) {
			if (pages[0]) navigate(pages[0].id);
			else createPage();
		}
	}, [pages, navigate, needRelocate, createPage]);
}
