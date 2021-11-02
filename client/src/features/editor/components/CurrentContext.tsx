import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { useMap } from '../../../hooks/useMap';
import { usePageContext } from '../../executor/hooks/useReferences';
import { useCurrent } from '../hooks/useCurrent';
import { BasicBlock } from '../types/basicBlock';
import { BlockMethods, BlockProps, Blocks, BlockStates } from '../types/blocks';

export const CurrentContext = createContext<{ current: any } & ReturnType<typeof useCurrentBlocks>>({
	current: undefined,
	blocks: {},
	deleteBlockMethods: () => {},
	setBlockMethods: () => {},
	setBlockState: () => {},
	blocksMethods: {},
	blocksState: {},
	blocksProps: {},
});

function useCurrentBlocks() {
	const { blocksState: parentBlocksState, setBlockState: parentSetBlockState } = useCurrent();
	const { pageId, blocksProps, editing, isDevtoolsOpen } = usePageContext();
	const blockParticles = useMap<string, [BlockProps, BlockStates | null, BlockMethods | null]>([pageId]);
	const joinedBlock = useMap<string, BasicBlock & Blocks>([pageId]);

	const [blocksState, setBlockState] = useState<{ [id: string]: BlockStates }>({});
	const [blocksMethods, setMethods] = useState<{ [blockId: string]: BlockMethods }>({});

	const mergedBlocksState = useMemo(
		() => ({ ...parentBlocksState, ...blocksState }),
		[blocksState, parentBlocksState],
	) as { [p: string]: BlockStates };

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
			const newState = mergedBlocksState[blockId] || null;
			const newMethods = blocksMethods[blockId] || null;

			const newShow = newProps.parentId === 'queries' ? !!isDevtoolsOpen : editing || !newProps.display?.hide;

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
	}, [blockParticles, blocksMethods, blocksProps, mergedBlocksState, editing, isDevtoolsOpen, joinedBlock]);

	return {
		blocks,
		deleteBlockMethods,
		setBlockMethods,
		blocksProps,
		blocksMethods,
		blocksState: mergedBlocksState,
		setBlockState,
	};
}

export function CurrentContextProvider({ current, children }: PropsWithChildren<{ current: any }>) {
	const context = useCurrentBlocks();
	return <CurrentContext.Provider value={{ current, ...context }}>{children}</CurrentContext.Provider>;
}
