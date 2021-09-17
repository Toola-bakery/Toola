import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMap } from '../../../hooks/useMap';
import { useAppSelector } from '../../../redux/hooks';
import { selectBlocksProps } from '../redux/editor';
import { BasicBlock } from '../types/basicBlock';
import { BlockMethods, BlockProps, Blocks, BlockStates } from '../types/blocks';

declare global {
	interface Window {
		blocks: { [p: string]: BasicBlock & Blocks };
	}
}

export function useBlocks(pageId: string, editing: boolean) {
	const blockParticles = useMap<string, [BlockProps, BlockStates | null, BlockMethods | null]>([pageId]);
	const joinedBlock = useMap<string, BasicBlock & Blocks>([pageId]);

	const [blocksState, setBlockState] = useState<{ [id: string]: BlockStates }>({});
	const blocksProps = useAppSelector((state) => selectBlocksProps(state, pageId));

	const [blocksMethods, setMethods] = useState<{ [blockId: string]: BlockMethods }>({});

	useEffect(() => {
		return () => {
			setBlockState({});
			setMethods({});
		};
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
			const newShow = editing || !newProps.display?.hide;

			if (particles) {
				const [oldProps, oldState, oldMethods] = particles;
				if (oldProps === newProps && oldState === newState && newMethods === oldMethods && newShow === newProps.show) {
					const oldJoinedBlock = joinedBlock.get(blockId);
					if (oldJoinedBlock) {
						response[blockId] = oldJoinedBlock;
						return;
					}
				}
			}
			response[blockId] = {
				...newProps,
				...(newState || {}),
				...(newMethods || {}),
				show: newShow,
			} as BasicBlock & Blocks;
			joinedBlock.set(blockId, response[blockId]);
			blockParticles.set(blockId, [newProps, newState, newMethods]);
		});
		return response;
	}, [blockParticles, blocksMethods, blocksProps, blocksState, editing, joinedBlock]);

	useEffect(() => {
		window.blocks = blocks;
	}, [blocks]);

	return { deleteBlockMethods, setBlockMethods, blocks, blocksMethods, blocksState, setBlockState, blocksProps };
}
