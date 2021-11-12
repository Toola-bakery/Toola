import { DependencyList, useEffect, useMemo } from 'react';
import { BlockMethods } from '../types/blocks';
import { useBlock } from './useBlock';
import { useCurrent } from './useCurrent';

export function useDeclareBlockMethods<T extends BlockMethods>(methods: T, deps: DependencyList) {
	const { id } = useBlock();
	const { deleteBlockMethods, setBlockMethods } = useCurrent();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const memMethods = useMemo(() => methods, deps);

	useEffect(() => {
		setBlockMethods(id, memMethods);
		return () => deleteBlockMethods(id);
	}, [id, deleteBlockMethods, memMethods, setBlockMethods]);

	return memMethods;
}
