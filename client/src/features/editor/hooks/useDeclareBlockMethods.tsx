import { DependencyList, useEffect, useMemo } from 'react';
import { BlockMethods } from '../types/blocks';
import { usePageContext } from './useReferences';

export function useDeclareBlockMethods<T extends BlockMethods = BlockMethods>(
	blockId: string,
	methods: T,
	deps: DependencyList,
) {
	const { deleteBlockMethods, setBlockMethods } = usePageContext();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const memMethods = useMemo(() => methods, deps);

	useEffect(() => {
		setBlockMethods(blockId, memMethods);
		return () => deleteBlockMethods(blockId);
	}, [blockId, deleteBlockMethods, memMethods, setBlockMethods]);
}
