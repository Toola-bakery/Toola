import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createCachedSelector from 're-reselect';
import { RootState } from '../../../redux';
import { Blocks, PageBlock } from '../types';

interface EditorState {
	blocks: { [id: string]: Blocks };
}

const initialState: EditorState = {
	blocks: {
		rand: { id: 'rand', type: 'page', blocks: ['test3'], parentId: null },
		test: {
			id: 'test',
			type: 'code',
			source: 'test',
			parentId: 'rand',
			language: 'javascript',
		},
		test3: {
			id: 'test3',
			type: 'text',
			html: 'test',
			parentId: 'rand',
		},
	},
};

export const editorSlice = createSlice({
	name: 'editor',
	initialState,
	reducers: {
		addBlock: (state, action: PayloadAction<Blocks>) => {
			state.blocks[action.payload.id] = action.payload;
		},
		updateBlock: (state, action: PayloadAction<Partial<Blocks> & Pick<Blocks, 'id'>>) => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			state.blocks[action.payload.id] = {
				...state.blocks[action.payload.id],
				...action.payload,
			};
		},
		deleteBlock: (state, action: PayloadAction<Partial<Blocks> & Pick<Blocks, 'id'>>) => {
			delete state.blocks[action.payload.id];
		},
		setBlocks: (state, action: PayloadAction<{ [id: string]: Blocks }>) => {
			state.blocks = action.payload;
		},
	},
});

export const { setBlocks, updateBlock, addBlock, deleteBlock } = editorSlice.actions;

export const selectBlocks = (state: RootState) => state.editor.blocks;
export const selectBlock = (state: RootState, blockId: string) => state.editor.blocks[blockId];

export const selectBlockParent = (state: RootState, blockId: string) => {
	const parent = selectBlock(state, blockId)?.parentId;
	if (parent) return selectBlock(state, parent) as PageBlock;
};

export const selectBlockNeighbors = createCachedSelector(
	(state) => state,
	selectBlock,
	selectBlockParent,
	(state, block, parent) => {
		if (!parent) return {};
		const myIndex = parent.blocks.indexOf(block.id);
		return {
			previous: myIndex >= 1 ? selectBlock(state, parent.blocks[myIndex - 1]) : null,
			next: myIndex + 1 < parent.blocks.length ? selectBlock(state, parent.blocks[myIndex + 1]) : null,
		};
	},
)((_, blockId) => blockId);

export const editorReducer = editorSlice.reducer;
