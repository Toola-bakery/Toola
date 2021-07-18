import { useCallback } from 'react';
import { useEvents } from './useEvents';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
	addBlock as addBlockAction,
	updateBlock as updateBlockAction,
	deleteBlock as deleteBlockAction,
	selectBlocks,
} from '../redux/editor';
import { Blocks, PageBlock } from '../types';

type UseEditorResponse = {
	addBlockAfter: (putAfterId: string, block: Blocks) => void;
	addBlockIn: (parentId: string, block: Blocks) => void;
	deleteBlock: (blockId: string) => void;
	updateBlock: (block: Parameters<typeof updateBlockAction>[0], focus?: boolean) => void;
};

export function useEditor(): UseEditorResponse {
	const { send } = useEvents();
	const dispatch = useAppDispatch();

	const blocks = useAppSelector(selectBlocks);

	const addBlockAfter = useCallback<UseEditorResponse['addBlockAfter']>(
		(putAfterId, block) => {
			const { parentId } = blocks[putAfterId];
			if (!parentId || !blocks[parentId]) return;
			const parent = blocks[parentId] as PageBlock;

			const newParentBlocks = [...parent.blocks];
			newParentBlocks.splice(parent.blocks.indexOf(putAfterId) + 1, 0, block.id);

			dispatch(addBlockAction(block));
			dispatch(updateBlockAction({ id: parentId, blocks: newParentBlocks }));
			send(block.id, { eventName: 'focus', waitListener: true });
		},
		[blocks, dispatch, send],
	);

	const addBlockIn = useCallback<UseEditorResponse['addBlockIn']>(
		(parentId, block) => {
			if (!parentId || !blocks[parentId]) return;
			const parent = blocks[parentId] as PageBlock;

			const newParentBlocks = [...parent.blocks];
			newParentBlocks.push(block.id);

			dispatch(addBlockAction(block));
			dispatch(updateBlockAction({ id: parentId, blocks: newParentBlocks }));
			send(block.id, { eventName: 'focus', waitListener: true });
		},
		[blocks, dispatch, send],
	);
	const deleteBlock = useCallback<UseEditorResponse['deleteBlock']>(
		(blockId) => {
			const { parentId } = blocks[blockId];
			if (!parentId || !blocks[parentId]) return;
			const parent = blocks[parentId] as PageBlock;

			const newParentBlocks = parent.blocks.filter((id) => id !== blockId);

			dispatch(deleteBlockAction({ id: blockId }));
			dispatch(updateBlockAction({ id: parentId, blocks: newParentBlocks }));
		},
		[blocks, dispatch],
	);
	const updateBlock = useCallback<UseEditorResponse['updateBlock']>(
		(block, focus = false) => {
			dispatch(updateBlockAction(block));
			if (focus) send(block.id, { eventName: 'focus', waitListener: true });
		},
		[dispatch, send],
	);

	return { addBlockAfter, deleteBlock, addBlockIn, updateBlock };
}
