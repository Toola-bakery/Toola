import { useEffect, useState } from 'react';
import { useEditor } from './useEditor';
import { usePageContext } from '../../executor/hooks/useReferences';

export function useBlockStateDefault<T>(
	initialState: (() => Partial<T>) | Partial<T>,
	blockId: string,
	_pageId?: string,
) {
	const { pageId: pageIdContext, blocksState } = usePageContext();
	const pageId = _pageId || pageIdContext;
	const [previousPageId, setPreviousPageId] = useState<string | null>(null);

	const { updateBlockState } = useEditor();

	const blockState = blocksState[blockId] as unknown as Partial<T>;

	useEffect(() => {
		if (blockState || previousPageId === pageId) return;
		setPreviousPageId(pageId);

		const newState = typeof initialState === 'function' ? initialState() : initialState;
		updateBlockState({ pageId, id: blockId, ...newState });
	}, [blockId, blockState, initialState, pageId, previousPageId, updateBlockState]);
}
