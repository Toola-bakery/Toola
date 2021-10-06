import debounce from 'just-debounce';
import ky from 'ky';
import { useEffect } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Config } from '../../../Config';
import { useAppDispatch } from '../../../redux/hooks';
import { useUser } from '../../user/hooks/useUser';
import { PageBlockProps, PageBlockType } from '../components/Page';
import { setPage } from '../redux/editor';
import { BasicBlock } from '../types/basicBlock';
import { BlockProps, Blocks } from '../types/blocks';

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

export function usePageBlockPropsMutation(pageId: string, blockProps: { [key: string]: BlockProps }) {
	const { authToken } = useUser();
	const { isSuccess } = usePage(pageId);
	useEffect(() => {
		if (authToken && isSuccess) putPage(pageId, blockProps, authToken);
	}, [authToken, blockProps, isSuccess, pageId]);
}
