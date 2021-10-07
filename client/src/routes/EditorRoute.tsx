import * as React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useRelocateToAnyPageIfNoPageSelected } from '../features/drawer/hooks/useRelocateToAnyPageIfNoPageSelected';
import { Page } from '../features/editor/components/Page/Page';
import { PageModalProvider } from '../features/pageModal/components/PageModalProvider';
import { WSProvider } from '../features/ws/components/WSProvider';

export default function EditorRoute() {
	useRelocateToAnyPageIfNoPageSelected();

	const { pageId } = useParams<{ pageId: string }>();
	const { state: pageParams } = useLocation();

	return (
		<WSProvider>
			<PageModalProvider>
				<Page pageId={pageId} pageParams={pageParams} />
			</PageModalProvider>
		</WSProvider>
	);
}
