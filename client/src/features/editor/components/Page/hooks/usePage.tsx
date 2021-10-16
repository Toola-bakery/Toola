import { useQuery } from 'react-query';
import { useUser } from '../../../../usersAndProjects/hooks/useUser';
import { Page } from './usePages';

export function usePage(pageId: string) {
	const { authToken } = useUser();

	const { isError, ...rest } = useQuery<Page>(['/pages/get', { id: pageId }], {
		retry: false,
		refetchOnWindowFocus: false,
		enabled: !!authToken && !!pageId,
	});
	return { ...rest, isError: isError || !pageId };
}
