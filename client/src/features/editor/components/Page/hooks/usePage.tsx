import debounce from 'just-debounce';
import ky from 'ky';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Config } from '../../../../../Config';
import { useUser } from '../../../../user/hooks/useUser';
import { PageBlockProps } from '../Page';
import { BasicBlock } from '../../../types/basicBlock';
import { BlockProps, Blocks } from '../../../types/blocks';

const putPage = debounce((pageId: string, blocksProps: { [key: string]: BlockProps }, authToken: string) => {
	return ky
		.post(`${Config.domain}/pages/post`, {
			json: { id: pageId, value: blocksProps },
			headers: { 'auth-token': authToken },
		})
		.json<any>();
}, 300);

export function usePage(pageId: string) {
	const { authToken } = useUser();

	const { isError, ...rest } = useQuery<{
		value: { page: BasicBlock & PageBlockProps } & { [key: string]: BasicBlock & Blocks };
	}>(['/pages/get', { id: pageId }], {
		retry: false,
		refetchOnWindowFocus: false,
		enabled: !!authToken && !!pageId,
	});
	return { ...rest, isError: isError || !pageId };
}
