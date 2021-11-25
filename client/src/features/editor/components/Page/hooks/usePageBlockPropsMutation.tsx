import debounce from 'just-debounce';
import ky from 'ky';
import { useEffect } from 'react';
import { Config } from '../../../../../Config';
import { usePrevious } from '../../../../../hooks/usePrevious';
import { useUser } from '../../../../usersAndProjects/hooks/useUser';
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

export function usePageBlockPropsMutation(
	pageId: string,
	blockProps: { [key: string]: BlockProps },
	isEditing: boolean,
) {
	const { authToken } = useUser();
	const { isSuccess } = usePage(pageId);
	const previousBlockProps = usePrevious(blockProps);
	useEffect(() => {
		if (isEditing && authToken && isSuccess && blockProps !== previousBlockProps)
			putPage(pageId, blockProps, authToken); // TODO CALL AFTER REAL UPDATE;
	}, [authToken, blockProps, isSuccess, pageId, previousBlockProps, isEditing]);
}
