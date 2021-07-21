import { useCallback } from 'react';
import update from 'immutability-helper';
import { useEvents } from './useEvents';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
	addBlock as addBlockAction,
	updateBlockProps as updateBlockPropsAction,
	updateBlockState as updateBlockStateAction,
	deleteBlock as deleteBlockAction,
	selectBlocksProps,
} from '../redux/editor';
import { Blocks, PageBlockType } from '../types';
import { usePageContext } from './useReferences';

type UseEditorResponse = {
	addBlockAfter: (putAfterId: string, block: Blocks) => void;
	addBlockIn: (parentId: string, block: Blocks) => void;
	deleteBlock: (blockId: string) => void;
	updateBlockProps: (block: Parameters<typeof updateBlockPropsAction>[0], focus?: boolean) => void;
	updateBlockType: (blockId: string, type: Blocks['type']) => void;
	updateBlockState: (block: Parameters<typeof updateBlockStateAction>[0], focus?: boolean) => void;
	getNextId: (name: Blocks['type']) => string;
};

export function useEditor(): UseEditorResponse {
	const { send } = useEvents();
	const {
		globals: { pageId },
		page,
	} = usePageContext();
	const dispatch = useAppDispatch();

	const blocks = useAppSelector((state) => selectBlocksProps(state, pageId));

	const updateBlockState = useCallback<UseEditorResponse['updateBlockProps']>(
		(block, focus = false) => {
			dispatch(updateBlockStateAction(block));
			if (focus) send(block.id, { eventName: 'focus', waitListener: true });
		},
		[dispatch, send],
	);

	const getNextId = useCallback<UseEditorResponse['getNextId']>(
		(name) => {
			let nextIndex = (page.itemIterator?.[name] || 0) + 1;
			while (blocks[`${name}${nextIndex}`]) {
				nextIndex += 1;
			}
			const itemIterator = update(page.itemIterator || {}, {
				$merge: { [name]: nextIndex },
			});
			updateBlockState({ id: page.id, pageId: page.id, itemIterator });
			return `${name}${itemIterator[name]}`;
		},
		[blocks, page, updateBlockState],
	);

	const addBlockAfter = useCallback<UseEditorResponse['addBlockAfter']>(
		(putAfterId, block) => {
			const { parentId } = blocks[putAfterId];
			if (!parentId || !blocks[parentId]) return;
			const parent = blocks[parentId] as PageBlockType;

			const newParentBlocks = [...parent.blocks];
			const id = getNextId(block.type);

			newParentBlocks.splice(parent.blocks.indexOf(putAfterId) + 1, 0, id);
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			dispatch(addBlockAction({ ...block, id, pageId, parentId }));
			dispatch(updateBlockPropsAction({ id: parentId, pageId, blocks: newParentBlocks }));
			send(id, { eventName: 'focus', waitListener: true });
		},
		[blocks, dispatch, getNextId, pageId, send],
	);

	const addBlockIn = useCallback<UseEditorResponse['addBlockIn']>(
		(parentId, block) => {
			if (!parentId || !blocks[parentId]) return;
			const parent = blocks[parentId] as PageBlockType;

			const newParentBlocks = [...parent.blocks];

			const id = getNextId(block.type);
			newParentBlocks.push(id);

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			dispatch(addBlockAction({ ...block, id, pageId, parentId }));
			dispatch(updateBlockPropsAction({ id: parentId, pageId, blocks: newParentBlocks }));
			send(id, { eventName: 'focus', waitListener: true });
		},
		[blocks, dispatch, getNextId, pageId, send],
	);

	const deleteBlock = useCallback<UseEditorResponse['deleteBlock']>(
		(blockId) => {
			const { parentId } = blocks[blockId];
			if (!parentId || !blocks[parentId]) return;
			const parent = blocks[parentId] as PageBlockType;

			const newParentBlocks = parent.blocks.filter((id) => id !== blockId);

			dispatch(deleteBlockAction({ id: blockId, pageId }));
			dispatch(updateBlockPropsAction({ id: parentId, pageId, blocks: newParentBlocks }));
		},
		[blocks, dispatch, pageId],
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
			const newId = getNextId(type);
			const block = blocks[blockId];
			const { parentId } = block;

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			dispatch(addBlockAction({ ...block, id: newId, pageId, parentId, language: 'javascript', type }));
			if (parentId) {
				const newBlocks = (blocks[parentId] as PageBlockType).blocks.map((id) => (id === blockId ? newId : id));
				dispatch(updateBlockPropsAction({ id: parentId, pageId, blocks: newBlocks }));
			}
			dispatch(deleteBlockAction({ id: blockId, pageId }));
		},
		[blocks, dispatch, getNextId, pageId],
	);

	return { addBlockAfter, updateBlockType, getNextId, deleteBlock, addBlockIn, updateBlockProps, updateBlockState };
}
