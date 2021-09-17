import debounce from 'just-debounce';
import ky from 'ky';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Config } from '../../../config';
import { useAppDispatch } from '../../../redux/hooks';
import { useUser } from '../../user/hooks/useUser';
import { setPage } from '../redux/editor';
import { BasicBlock } from '../types/basicBlock';
import { BlockProps, Blocks } from '../types/blocks';

const putPage = debounce((pageId: string, blocksProps: { [key: string]: BlockProps }, authToken: string) => {
	return ky.post(`${Config.domain}/pages/post`, {
		json: { id: pageId, value: blocksProps },
		headers: { 'auth-token': authToken },
	});
}, 300);

export function useBlocksSync(pageId: string, blocksProps: { [key: string]: BlockProps }) {
	const dispatch = useAppDispatch();
	const { authToken } = useUser();

	const { data, error, isLoading, isError, isSuccess, refetch } = useQuery<{
		value: { [key: string]: BasicBlock & Blocks };
	}>(['/pages/get', { id: pageId }], {
		retry: false,
		refetchOnWindowFocus: false,
		enabled: !!authToken,
	});

	useEffect(() => {
		if (isSuccess && data) dispatch(setPage({ blocks: data.value, pageId }));
	}, [data, dispatch, isSuccess, pageId]);

	useEffect(() => {
		if (isSuccess && authToken) putPage(pageId, blocksProps, authToken);
	}, [isSuccess, blocksProps, pageId, authToken]);

	return { data, isLoading, isError, error, isSuccess, refetch };
}
