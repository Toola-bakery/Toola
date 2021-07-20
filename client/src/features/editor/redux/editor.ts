import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import createCachedSelector from 're-reselect';
import update from 'immutability-helper';
import { RootState } from '../../../redux';
import { Blocks, PageBlock } from '../types';

interface EditorState {
	blocksProperties: { [id: string]: Blocks };
	blocksState: { [id: string]: Blocks };
}

const initialState: EditorState = {
	blocksProperties: {
		rand: { id: 'rand', type: 'page', blocks: ['test3'], parentId: null },
		test: {
			id: 'test',
			type: 'code',
			value: 'test',
			parentId: 'rand',
			language: 'javascript',
		},
		test3: {
			id: 'test3',
			type: 'text',
			value: 'test',
			parentId: 'rand',
		},
	},
	blocksState: {},
};

export const editorSlice = createSlice({
	name: 'editor',
	initialState,
	reducers: {
		addBlock: (state, action: PayloadAction<Blocks>) => {
			state.blocksProperties[action.payload.id] = action.payload;
		},
		updateBlockProps: (state, action: PayloadAction<Partial<Blocks> & Pick<Blocks, 'id'>>) => {
			state.blocksProperties[action.payload.id] = update(state.blocksProperties[action.payload.id], {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				$merge: action.payload,
			});
		},

		updateBlockState: (state, action: PayloadAction<Partial<Blocks> & Pick<Blocks, 'id'>>) => {
			state.blocksState[action.payload.id] = update(state.blocksState[action.payload.id] || {}, {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				$merge: action.payload,
			});
		},
		deleteBlock: (state, action: PayloadAction<Partial<Blocks> & Pick<Blocks, 'id'>>) => {
			delete state.blocksProperties[action.payload.id];
			delete state.blocksState[action.payload.id];
		},
	},
});

export const { updateBlockProps, updateBlockState, addBlock, deleteBlock } = editorSlice.actions;

export const selectBlocksProps = (state: RootState) => state.editor.blocksProperties;
export const selectBlocksState = (state: RootState) => state.editor.blocksState;

export const selectBlockProps = (state: RootState, blockId: string) => selectBlocksProps(state)[blockId];
export const selectBlockState = (state: RootState, blockId: string) => selectBlocksState(state)[blockId];

export const selectBlockParentProps = (state: RootState, blockId: string) => {
	const parent = selectBlockProps(state, blockId)?.parentId;
	if (parent) return selectBlockProps(state, parent) as PageBlock;
};

export const selectBlocksStateWithProps = createCachedSelector(
	selectBlocksProps,
	selectBlocksState,
	(blocksProps, blocksState) => {
		const response: { [p: string]: Blocks } = {};
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
	selectBlockProps,
	selectBlockParentProps,
	(state, block, parent) => {
		if (!parent) return {};
		const myIndex = parent.blocks.indexOf(block.id);
		return {
			previous: myIndex >= 1 ? selectBlockProps(state, parent.blocks[myIndex - 1]) : null,
			next: myIndex + 1 < parent.blocks.length ? selectBlockProps(state, parent.blocks[myIndex + 1]) : null,
		};
	},
)((_, blockId) => blockId);

export const editorReducer = editorSlice.reducer;
