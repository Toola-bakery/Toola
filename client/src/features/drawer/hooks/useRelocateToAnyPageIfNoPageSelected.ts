import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { useTopLevelPages } from './useTopLevelPages';

export function useRelocateToAnyPageIfNoPageSelected() {
	const { pageId } = useParams<{ pageId?: string }>();
	const { pages } = useTopLevelPages();
	const { navigate } = usePageNavigator();

	useEffect(() => {
		if (!pageId && pages[0]) navigate(pages[0].id);
	}, [pages, navigate, pageId]);
}
