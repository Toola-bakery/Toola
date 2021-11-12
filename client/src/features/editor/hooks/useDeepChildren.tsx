import { useAppSelector } from '../../../redux/hooks';
import { usePageContext } from '../../executor/hooks/useReferences';
import { selectAllChildren } from '../redux/editor';
import { useBlock } from './useBlock';

export function useDeepChildren() {
	const { id } = useBlock();
	const { pageId } = usePageContext();
	return useAppSelector((state) => selectAllChildren(state, pageId, id));
}
