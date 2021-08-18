import { DependencyList, useCallback } from 'react';
import { useBlock } from './useBlock';
import { useEventListener } from './useEvents';

export type DeleteBlockEvent = {
	blockId: string;
	pageId: string;
};

export function useDeleteBlockHook(hook: () => Promise<void> | void, deps: DependencyList) {
	const { pageId, id } = useBlock();

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const memHook = useCallback(hook, deps);

	useEventListener<DeleteBlockEvent>(
		`deleteBlock`,
		(event) => {
			if (event.blockId === id && event.pageId === pageId) return memHook();
		},
		[pageId, id, memHook],
	);
}
