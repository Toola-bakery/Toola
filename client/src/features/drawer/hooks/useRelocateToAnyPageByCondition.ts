import { useEffect } from 'react';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { useTopLevelPages } from './useTopLevelPages';

export function useRelocateToAnyPageByCondition(needRelocate: boolean) {
	const { pages } = useTopLevelPages();
	const { navigate } = usePageNavigator();

	useEffect(() => {
		if (pages[0] && needRelocate) navigate(pages[0].id);
	}, [pages, navigate, needRelocate]);
}
