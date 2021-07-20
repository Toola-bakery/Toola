import { useCallback } from 'react';
import { useEvents } from './useEvents';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
	addBlock as addBlockAction,
	updateBlockProps as updateBlockPropsAction,
	updateBlockState as updateBlockStateAction,
	deleteBlock as deleteBlockAction,
	selectBlocksProps,
} from '../redux/editor';
import { Blocks, PageBlock } from '../types';

type UseEditorResponse = {
	addBlockAfter: (putAfterId: string, block: Blocks) => void;
	addBlockIn: (parentId: string, block: Blocks) => void;
	deleteBlock: (blockId: string) => void;
	updateBlockProps: (block: Parameters<typeof updateBlockPropsAction>[0], focus?: boolean) => void;
	updateBlockState: (block: Parameters<typeof updateBlockStateAction>[0], focus?: boolean) => void;
};

export function useEditor(): UseEditorResponse {
	const { send } = useEvents();
	const dispatch = useAppDispatch();

	const blocks = useAppSelector(selectBlocksProps);

	const addBlockAfter = useCallback<UseEditorResponse['addBlockAfter']>(
		(putAfterId, block) => {
			const { parentId } = blocks[putAfterId];
			if (!parentId || !blocks[parentId]) return;
			const parent = blocks[parentId] as PageBlock;

			const newParentBlocks = [...parent.blocks];
			newParentBlocks.splice(parent.blocks.indexOf(putAfterId) + 1, 0, block.id);

			dispatch(addBlockAction(block));
			dispatch(updateBlockPropsAction({ id: parentId, blocks: newParentBlocks }));
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
			dispatch(updateBlockPropsAction({ id: parentId, blocks: newParentBlocks }));
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
			dispatch(updateBlockPropsAction({ id: parentId, blocks: newParentBlocks }));
		},
		[blocks, dispatch],
	);
	const updateBlockProps = useCallback<UseEditorResponse['updateBlockProps']>(
		(block, focus = false) => {
			dispatch(updateBlockPropsAction(block));
			if (focus) send(block.id, { eventName: 'focus', waitListener: true });
		},
		[dispatch, send],
	);
	const updateBlockState = useCallback<UseEditorResponse['updateBlockProps']>(
		(block, focus = false) => {
			dispatch(updateBlockStateAction(block));
			if (focus) send(block.id, { eventName: 'focus', waitListener: true });
		},
		[dispatch, send],
	);

	return { addBlockAfter, deleteBlock, addBlockIn, updateBlockProps, updateBlockState };
}
