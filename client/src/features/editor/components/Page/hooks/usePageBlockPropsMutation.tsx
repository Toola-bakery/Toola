import debounce from 'just-debounce';
import ky from 'ky';
import { useEffect } from 'react';
import { Config } from '../../../../../Config';
import { useUser } from '../../../../user/hooks/useUser';
import { BlockProps } from '../../../types/blocks';
import { usePage } from './usePage';

const putPage = debounce((pageId: string, blocksProps: { [key: string]: BlockProps }, authToken: string) => {
	return ky
		.post(`${Config.domain}/pages/post`, {
			json: { id: pageId, value: blocksProps },
			headers: { 'auth-token': authToken },
		})
		.json<any>();
}, 300);

export function usePageBlockPropsMutation(pageId: string, blockProps: { [key: string]: BlockProps }) {
	const { authToken } = useUser();
	const { isSuccess } = usePage(pageId);
	useEffect(() => {
		if (authToken && isSuccess) putPage(pageId, blockProps, authToken);
	}, [authToken, blockProps, isSuccess, pageId]);
}
