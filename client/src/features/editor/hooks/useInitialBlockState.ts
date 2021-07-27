import { useOnMountedEffect } from '../../../hooks/useOnMounted';
import { useAppSelector } from '../../../redux/hooks';
import { selectBlockState } from '../redux/editor';
import { useEditor } from './useEditor';
import { usePageContext } from './useReferences';

export function useInitialBlockState<T>(
	initialState: (() => Partial<T>) | Partial<T>,
	blockId: string,
	_pageId?: string,
) {
	const { pageId: pageIdContext } = usePageContext();
	const pageId = _pageId || pageIdContext;
	const { updateBlockState } = useEditor();
	const blockState = useAppSelector((state) => selectBlockState(state, pageId, blockId)) as unknown as Partial<T>;
	useOnMountedEffect(() => {
		if (blockState) return;
		const newState = typeof initialState === 'function' ? initialState() : initialState;
		updateBlockState({ pageId, id: blockId, ...newState });
	});
}
