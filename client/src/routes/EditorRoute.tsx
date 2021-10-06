import * as React from 'react';
import { useRelocateToAnyPageIfNoPageSelected } from '../features/drawer/hooks/useRelocateToAnyPageIfNoPageSelected';
import { Page } from '../features/editor/components/Page/Page';
import { WSProvider } from '../features/ws/components/WSProvider';

export default function EditorRoute() {
	useRelocateToAnyPageIfNoPageSelected();

	return (
		<WSProvider>
			<Page />
		</WSProvider>
	);
}
