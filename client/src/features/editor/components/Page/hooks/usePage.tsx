import debounce from 'just-debounce';
import ky from 'ky';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Config } from '../../../../../Config';
import { useUser } from '../../../../user/hooks/useUser';
import { PageBlockProps } from '../Page';
import { BasicBlock } from '../../../types/basicBlock';
import { BlockProps, Blocks } from '../../../types/blocks';
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
