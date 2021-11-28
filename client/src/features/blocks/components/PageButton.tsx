import { Button } from '@blueprintjs/core';
import * as React from 'react';
import { usePageNavigator } from '../../../hooks/usePageNavigator';
import { usePage } from '../../editor/components/Page/hooks/usePage';
import { EmojiIcon } from './EmojiPicker';

export function PageButton({ pageId, params }: { pageId: string; params?: (() => unknown) | unknown }) {
	const { navigate } = usePageNavigator();
	const { data: { value: { page = null } = {} } = {}, isSuccess, isError } = usePage(pageId || '');

	const errorText = isError ? 'Not found' : 'Loading';
	return (
		<Button
			onClick={() => {
				if (page && isSuccess) navigate(pageId, typeof params === 'function' ? params() : params);
			}}
			icon={<EmojiIcon emoji={page?.emoji} />}
			minimal
			text={isSuccess ? page?.title || 'Untitled' : errorText}
		/>
	);
}
