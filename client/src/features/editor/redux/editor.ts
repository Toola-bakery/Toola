import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createCachedSelector from 're-reselect';
import update from 'immutability-helper';
import { RootState } from '../../../redux';
import { BasicBlock, Blocks, LayoutBlocks, PageBlockType } from '../types';

interface EditorState {
	pages: {
		[pageId: string]: {
			blocksProperties: { [id: string]: BasicBlock & Blocks };
			blocksState: { [id: string]: BasicBlock & Blocks };
		};
	};
}

const initialState: EditorState = {
	pages: {
		rand: {
			blocksProperties: {
				rand: { id: 'rand', type: 'page', blocks: ['test3'], parentId: null, pageId: 'rand', itemIterator: {} },
				test: {
					id: 'test',
					type: 'code',
					value: 'test',
					parentId: 'rand',
					pageId: 'rand',
					language: 'javascript',
				},
				test3: {
					id: 'test3',
					type: 'text',
					value: 'test',
					parentId: 'rand',
					pageId: 'rand',
				},
			},
			blocksState: {},
		},
	},
};

export const editorSlice = createSlice({
	name: 'editor',
	initialState,
	reducers: {
		addBlock: (state, action: PayloadAction<BasicBlock & Blocks>) => {
			state.pages[action.payload.pageId].blocksProperties[action.payload.id] = action.payload;
		},
		updateBlockProps: (state, action: PayloadAction<Partial<Blocks> & Pick<BasicBlock, 'id' | 'pageId'>>) => {
			const { blocksProperties } = state.pages[action.payload.pageId];
			blocksProperties[action.payload.id] = update(blocksProperties[action.payload.id], {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				$merge: action.payload,
			});
		},

		deleteChildFromParent: (state, action: PayloadAction<{ pageId: string; blockId: string }>) => {
			const { pageId, blockId } = action.payload;
			const { blocksProperties } = state.pages[pageId];
			const block = blocksProperties[blockId] as BasicBlock;
			if (!block.parentId) return;
			const parent = blocksProperties[block.parentId] as LayoutBlocks;
			parent.blocks = parent.blocks.filter((id) => id !== blockId);
		},
		addChildAtIndex: (
			state,
			action: PayloadAction<{ pageId: string; parentId: string; blockId: string; index?: number }>,
		) => {
			const { pageId, blockId, index, parentId } = action.payload;
			const { blocksProperties } = state.pages[pageId];
			const parent = blocksProperties[parentId] as LayoutBlocks;
			if (typeof index !== 'undefined') parent.blocks.splice(index, 0, blockId);
			else parent.blocks.push(blockId);
		},
		addChildAfterId: (state, action: PayloadAction<{ pageId: string; putAfterId: string; blockId: string }>) => {
			const { pageId, blockId, putAfterId } = action.payload;
			const { blocksProperties } = state.pages[pageId];
			const { parentId, id: neighborId } = blocksProperties[putAfterId] as BasicBlock;
			if (!parentId) return;
			const parent = blocksProperties[parentId] as LayoutBlocks;
			parent.blocks.splice(parent.blocks.indexOf(neighborId) + 1, 0, blockId);
		},

		updateBlockState: (state, action: PayloadAction<Partial<Blocks> & Pick<BasicBlock, 'id' | 'pageId'>>) => {
			const { blocksState } = state.pages[action.payload.pageId];

			blocksState[action.payload.id] = update(blocksState[action.payload.id] || {}, {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				$merge: action.payload,
			});
		},
		deleteBlock: (state, action: PayloadAction<Partial<Blocks> & Pick<BasicBlock, 'id' | 'pageId'>>) => {
			delete state.pages[action.payload.pageId].blocksProperties[action.payload.id];
			delete state.pages[action.payload.pageId].blocksState[action.payload.id];
		},
		setPage: (state, action: PayloadAction<{ blocks: { [id: string]: BasicBlock & Blocks }; pageId: string }>) => {
			if (!state.pages[action.payload.pageId])
				state.pages[action.payload.pageId] = { blocksState: {}, blocksProperties: {} };
			state.pages[action.payload.pageId].blocksProperties = action.payload.blocks;
		},
	},
});

export const {
	addChildAtIndex,
	addChildAfterId,
	deleteChildFromParent,
	updateBlockProps,
	setPage,
	updateBlockState,
	addBlock,
	deleteBlock,
} = editorSlice.actions;

export const selectBlocksProps = (state: RootState, pageId: string) =>
	state.editor.pages?.[pageId]?.blocksProperties || {};
export const selectBlocksState = (state: RootState, pageId: string) => state.editor.pages?.[pageId]?.blocksState || {};

export const selectBlockProps = (state: RootState, pageId: string, blockId: string) =>
	selectBlocksProps(state, pageId)[blockId];
export const selectBlockState = (state: RootState, pageId: string, blockId: string) =>
	selectBlocksState(state, pageId)[blockId];

export const selectBlockParentProps = (state: RootState, pageId: string, blockId: string) => {
	const parent = selectBlockProps(state, pageId, blockId)?.parentId;
	if (parent) return selectBlockProps(state, pageId, parent) as PageBlockType;
};

export const selectBlocksStateWithProps = createCachedSelector(
	selectBlocksProps,
	selectBlocksState,
	(blocksProps, blocksState) => {
		const response: { [p: string]: BasicBlock & Blocks } = {};
		Object.keys(blocksProps).forEach((key) => {
			response[key] = { ...blocksProps[key], ...(blocksState[key] ? blocksState[key] : {}) };
		});

		return response;
	},
)(() => 1);

export const selectBlockStateWithProps = createCachedSelector(
	(state) => state,
	selectBlockProps,
	selectBlockState,
	(state, blockProps, blockState) => {
		return {
			...blockProps,
			...blockState,
		};
	},
)((_, blockId) => blockId);

export const selectBlockNeighborsProps = createCachedSelector(
	(state) => state,
	(_, pageId: string) => pageId,
	selectBlockProps,
	selectBlockParentProps,
	(state, pageId, block, parent) => {
		if (!parent) return {};
		const myIndex = parent.blocks.indexOf(block.id);
		return {
			previous: myIndex >= 1 ? selectBlockProps(state, pageId, parent.blocks[myIndex - 1]) : null,
			next: myIndex + 1 < parent.blocks.length ? selectBlockProps(state, pageId, parent.blocks[myIndex + 1]) : null,
		};
	},
)((_, blockId) => blockId);

export const editorReducer = editorSlice.reducer;
