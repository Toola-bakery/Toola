import React, { useCallback, useEffect } from 'react';
import update from 'immutability-helper';
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
} from '../redux/editor';
import { BasicBlock, Blocks } from '../types';
import { usePageContext } from './useReferences';

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
	updateBlockProps: (block: Parameters<typeof updateBlockPropsAction>[0], focus?: boolean) => void;
	updateBlockType: (blockId: string, type: Blocks['type']) => void;
	updateBlockState: (block: Parameters<typeof updateBlockStateAction>[0], focus?: boolean) => void;
	getNextId: (name: Blocks['type']) => string;
};

const cache: { [pageId: string]: { [key: string]: number } } = {};

export function useEditor(): UseEditorResponse {
	const { send } = useEvents();
	const {
		globals: { pageId },
	} = usePageContext();
	const dispatch = useAppDispatch();

	const blocks = useAppSelector((state) => selectBlocksProps(state, pageId));

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
			dispatch(updateBlockStateAction(block));
			if (focus) send(block.id, { eventName: 'focus', waitListener: true });
		},
		[dispatch, send],
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

			while (blocks[`${name}${cache[pageId][name]}`]) cache[pageId][name] += 1;

			return `${name}${cache[pageId][name]}`;
		},
		[blocks, pageId],
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
			const { parentId } = blocks[putAfterId];

			const payload = addBlocks([{ ...block, pageId, parentId }]);

			addChildAfterId(putAfterId, payload[0].id);

			send(payload[0].id, { eventName: 'focus', waitListener: true });
		},
		[addBlocks, addChildAfterId, blocks, pageId, send],
	);

	const addBlockIn = useCallback<UseEditorResponse['addBlockIn']>(
		(parentId, block) => {
			const payload = addBlocks([{ ...block, pageId, parentId }]);
			addChild(parentId, payload[0].id);
			send(payload[0].id, { eventName: 'focus', waitListener: true });
		},
		[addBlocks, addChild, pageId, send],
	);

	const deleteBlock = useCallback<UseEditorResponse['deleteBlock']>(
		(blockId) => dispatch(deleteBlockAction({ id: blockId, pageId })),
		[dispatch, pageId],
	);

	const updateBlockProps = useCallback<UseEditorResponse['updateBlockProps']>(
		(block, focus = false) => {
			dispatch(updateBlockPropsAction(block));
			if (focus) send(block.id, { eventName: 'focus', waitListener: true });
		},
		[dispatch, send],
	);

	const updateBlockType = useCallback<UseEditorResponse['updateBlockType']>(
		(blockId, type) => {
			const block = blocks[blockId];
			const { parentId } = block;

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			const [{ id: newId }] = addBlocks([{ ...block, id: undefined, pageId, parentId, language: 'javascript', type }]);

			if (parentId) addChildInsteadOf(blockId, newId);

			dispatch(deleteBlockAction({ id: blockId, pageId }));
		},
		[addBlocks, blocks, dispatch, pageId, addChildInsteadOf],
	);

	return {
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
