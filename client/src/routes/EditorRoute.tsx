import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useRelocateToAnyPageByCondition } from '../features/drawer/hooks/useRelocateToAnyPageByCondition';
import { Page } from '../features/editor/components/Page/Page';
import { PageModalProvider } from '../features/pageModal/components/PageModalProvider';
import { WSProvider } from '../features/ws/components/WSProvider';

export default function EditorRoute() {
	const { pageId } = useParams<{ pageId: string }>();
	useRelocateToAnyPageByCondition(!pageId);
	const { state: pageParams } = useLocation();

	return (
		<WSProvider>
			<PageModalProvider>
				<Page pageId={pageId} pageParams={pageParams} />
			</PageModalProvider>
		</WSProvider>
	);
}
