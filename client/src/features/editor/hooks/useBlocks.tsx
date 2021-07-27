import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../../redux/hooks';
import { selectBlocksStateWithProps } from '../redux/editor';
import { BasicBlock } from '../types/basicBlock';
import { Blocks } from '../types/blocks';

export type Methods = { [method: string]: (...args: any[]) => any };

export function useBlocks(pageId: string) {
	const blocksStateWithProps = useAppSelector((state) => selectBlocksStateWithProps(state, pageId));
	const [methodsState, setMethods] = useState<{ [blockId: string]: Methods }>({});

	useEffect(() => {
		setMethods({});
	}, [pageId]);

	const setBlockMethods = useCallback<(blockId: string, methods: Methods) => void>((blockId, methods) => {
		setMethods((state) => {
			return { ...state, [blockId]: methods };
		});
	}, []);

	const deleteBlockMethods = useCallback<(blockId: string) => void>((blockId) => {
		setMethods((state) => {
			const newState = { ...state };
			delete newState[blockId];
			return newState;
		});
	}, []);

	const blocks = useMemo(() => {
		const response: { [p: string]: BasicBlock & Blocks } = {};
		Object.keys(blocksStateWithProps).forEach((key) => {
			response[key] = { ...blocksStateWithProps[key], ...(methodsState[key] ? methodsState[key] : {}) };
		});
		return response;
	}, [blocksStateWithProps, methodsState]);

	return { deleteBlockMethods, setBlockMethods, blocks };
}
