import { produceWithPatches } from 'immer';
import { Draft } from 'immer/dist/types/types-external';
import { useCallback } from 'react';
import { store } from '../../../redux';
import { useEvents } from './useEvents';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
	addBlocks as addBlocksAction,
	updateBlockProps as updateBlockPropsAction,
	updateBlockState as updateBlockStateAction,
	deleteBlock as deleteBlockAction,
	addChildInsteadOf as addChildInsteadOfAction,
	deleteChildFromParent as deleteChildFromParentAction,
	addChildAtIndex as addChildAtIndexAction,
	addChildAfterId as addChildAfterIdAction,
	updateParentId as updateParentIdAction,
	selectBlocksProps,
	patchBlockPropsAction,
} from '../redux/editor';
import { BasicBlock } from '../types/basicBlock';
import { usePageContext } from './useReferences';
import { BlockCreators } from '../helpers/BlockCreators';
import { BlockProps, Blocks } from '../types/blocks';

type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

type UseEditorResponse = {
	addChild: (parentId: string, blockId: string | string[], index?: number) => void;
	addChildAfterId: (putAfterId: string, blockId: string | string[]) => void;
	addBlocks: (blocks: (Optional<BasicBlock, 'id'> & Blocks)[]) => (BasicBlock & Blocks)[];
	addBlockAfter: (putAfterId: string, block: Blocks) => void;
	// TODO rename method
	addChildInsteadOf: (blockId: string, replaceWithId: string) => void;
	moveBlockAfterId: (blockId: string, putAfterId: string) => void;
	addBlockIn: (parentId: string, block: Blocks) => void;
	deleteBlock: (blockId: string) => void;
	deleteFromParent: (blockId: string) => void;
	updateParentId: (blockId: string, parentId: string) => void;
	updateBlockType: (blockId: string, type: Blocks['type'] | ({ type: Blocks['type'] } & BlockProps)) => void;
	updateBlockProps: (block: Partial<BlockProps> & Pick<BasicBlock, 'id'>, focus?: boolean) => void;
	immerBlockProps: <Block extends BlockProps = BlockProps, D = Draft<Block & BasicBlock>>(
		blockId: string,
		recipe: (draft: D) => undefined | void,
	) => void;
	updateBlockState: (block: Partial<Blocks> & Pick<BasicBlock, 'id'>, focus?: boolean) => void;
	getNextId: (name: Blocks['type']) => string;
};

const cache: { [pageId: string]: { [key: string]: number } } = {};

const getBlocks = (pageId: string) => selectBlocksProps(store.getState(), pageId);

export function useEditor(): UseEditorResponse {
	const { send } = useEvents();
	const {
		globals: { pageId },
	} = usePageContext();
	const dispatch = useAppDispatch();

	const addChild = useCallback<UseEditorResponse['addChild']>(
		(parentId, blocksId, index) => {
			dispatch(addChildAtIndexAction({ pageId, parentId, blocksId, index }));
		},
		[dispatch, pageId],
	);

	const addChildAfterId = useCallback<UseEditorResponse['addChildAfterId']>(
		(putAfterId, blocksId) => {
			dispatch(addChildAfterIdAction({ pageId, blocksId, putAfterId }));
		},
		[dispatch, pageId],
	);

	const deleteFromParent = useCallback<UseEditorResponse['deleteBlock']>(
		(blockId) => {
			dispatch(deleteChildFromParentAction({ pageId, blockId }));
		},
		[dispatch, pageId],
	);

	const addChildInsteadOf = useCallback<UseEditorResponse['addChildInsteadOf']>(
		(blockId, replaceWithId) => {
			dispatch(addChildInsteadOfAction({ pageId, blockId, replaceWithId }));
		},
		[dispatch, pageId],
	);

	const moveBlockAfterId = useCallback<UseEditorResponse['moveBlockAfterId']>(
		(blockId, putAfterId) => addChildAfterId(putAfterId, blockId),
		[addChildAfterId],
	);

	const updateBlockState = useCallback<UseEditorResponse['updateBlockProps']>(
		(block, focus = false) => {
			dispatch(updateBlockStateAction({ pageId, ...block }));
			if (focus) send(block.id, { action: 'focus', waitListener: true });
		},
		[dispatch, pageId, send],
	);

	const updateParentId = useCallback<UseEditorResponse['updateParentId']>(
		(blockId, parentId) => {
			dispatch(updateParentIdAction({ blockId, parentId, pageId }));
		},
		[dispatch, pageId],
	);

	const getNextId = useCallback<UseEditorResponse['getNextId']>(
		(name) => {
			if (!cache[pageId]) cache[pageId] = {};
			if (!cache[pageId]?.[name]) cache[pageId][name] = 0;
			cache[pageId][name] += 1;
			const blocks = getBlocks(pageId);

			while (blocks[`${name}${cache[pageId][name]}`]) cache[pageId][name] += 1;

			return `${name}${cache[pageId][name]}`;
		},
		[pageId],
	);

	const addBlocks = useCallback<UseEditorResponse['addBlocks']>(
		(blocksToAdd) => {
			const payload = blocksToAdd.map((block) => ({
				...block,
				id: block.id || getNextId(block.type),
			}));
			dispatch(addBlocksAction(payload));
			return payload;
		},
		[dispatch, getNextId],
	);

	const addBlockAfter = useCallback<UseEditorResponse['addBlockAfter']>(
		(putAfterId, block) => {
			const blocks = getBlocks(pageId);
			const { parentId } = blocks[putAfterId];

			const payload = addBlocks([{ ...block, pageId, parentId }]);

			addChildAfterId(putAfterId, payload[0].id);

			send(payload[0].id, { action: 'focus', waitListener: true });
		},
		[addBlocks, addChildAfterId, pageId, send],
	);

	const addBlockIn = useCallback<UseEditorResponse['addBlockIn']>(
		(parentId, block) => {
			const payload = addBlocks([{ ...block, pageId, parentId }]);
			addChild(parentId, payload[0].id);
			send(payload[0].id, { action: 'focus', waitListener: true });
		},
		[addBlocks, addChild, pageId, send],
	);

	const deleteBlock = useCallback<UseEditorResponse['deleteBlock']>(
		(blockId) => dispatch(deleteBlockAction({ id: blockId, pageId })),
		[dispatch, pageId],
	);

	const updateBlockProps = useCallback<UseEditorResponse['updateBlockProps']>(
		(block, focus = false) => {
			dispatch(updateBlockPropsAction({ pageId, ...block }));
			if (focus) send(block.id, { action: 'focus', waitListener: true });
		},
		[dispatch, pageId, send],
	);
	const immerBlockProps = useCallback<UseEditorResponse['immerBlockProps']>(
		(blockId, recipe) => {
			const blocks = getBlocks(pageId);
			const [ns, patches] = produceWithPatches(blocks[blockId], recipe);
			dispatch(patchBlockPropsAction({ blockId, pageId, patches }));
		},
		[dispatch, pageId],
	);

	const updateBlockType = useCallback<UseEditorResponse['updateBlockType']>(
		(blockId, typeOrBlock) => {
			const type = typeof typeOrBlock === 'string' ? typeOrBlock : typeOrBlock.type;
			const blocks = getBlocks(pageId);
			const block = blocks[blockId];
			const { parentId } = block;

			const newBlock = BlockCreators[type](block);

			const [{ id: newId }] = addBlocks([
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				{ ...newBlock, ...(typeOrBlock === 'string' ? {} : typeOrBlock), pageId, parentId, type },
			]);

			if (parentId) addChildInsteadOf(blockId, newId);
			deleteBlock(blockId);
		},
		[addBlocks, pageId, addChildInsteadOf, deleteBlock],
	);

	return {
		immerBlockProps,
		addChild,
		addChildAfterId,
		deleteFromParent,
		addBlockAfter,
		updateBlockType,
		getNextId,
		deleteBlock,
		addBlockIn,
		updateParentId,
		updateBlockProps,
		updateBlockState,
		moveBlockAfterId,
		addChildInsteadOf,
		addBlocks,
	};
}
