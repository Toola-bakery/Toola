import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMap } from '../../../hooks/useMap';
import { useAppSelector } from '../../../redux/hooks';
import { selectBlocksProps, selectBlocksState } from '../redux/editor';
import { BasicBlock } from '../types/basicBlock';
import { BlockMethods, BlockProps, Blocks, BlockStates } from '../types/blocks';

export function useBlocks(pageId: string) {
	const blockParticles = useMap<string, [BlockProps, BlockStates | null, BlockMethods | null]>([pageId]);
	const joinedBlock = useMap<string, BasicBlock & Blocks>([pageId]);

	const blocksState = useAppSelector((state) => selectBlocksState(state, pageId));
	const blocksProps = useAppSelector((state) => selectBlocksProps(state, pageId));

	const [blocksMethods, setMethods] = useState<{ [blockId: string]: BlockMethods }>({});

	useEffect(() => {
		setMethods({});
	}, [pageId]);

	const setBlockMethods = useCallback<(blockId: string, methods: BlockMethods) => void>((blockId, methods) => {
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
		Object.keys(blocksProps).forEach((blockId) => {
			const particles = blockParticles.get(blockId);
			const newProps = blocksProps[blockId];
			const newState = blocksState[blockId] || null;
			const newMethods = blocksMethods[blockId] || null;

			if (particles) {
				const [oldProps, oldState, oldMethods] = particles;
				if (oldProps === newProps && oldState === newState && newMethods === oldMethods) {
					const oldJoinedBlock = joinedBlock.get(blockId);
					if (oldJoinedBlock) {
						response[blockId] = oldJoinedBlock;
						return;
					}
				}
			}
			response[blockId] = { ...newProps, ...(newState || {}), ...(newMethods || {}) } as BasicBlock & Blocks;
			joinedBlock.set(blockId, response[blockId]);
			blockParticles.set(blockId, [newProps, newState, newMethods]);
		});
		return response;
	}, [blockParticles, blocksMethods, blocksProps, blocksState, joinedBlock]);

	return { deleteBlockMethods, setBlockMethods, blocks, blocksMethods };
}
