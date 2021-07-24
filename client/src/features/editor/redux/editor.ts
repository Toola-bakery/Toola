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
				rand: { id: 'rand', type: 'page', blocks: ['test3'], parentId: null, pageId: 'rand' },
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

function getParentHelper(state: EditorState, pageId: string, blockId: string): (BasicBlock & LayoutBlocks) | null {
	const { blocksProperties } = state.pages[pageId];
	const { parentId } = blocksProperties[blockId] as BasicBlock;
	console.log('getParentHelper', { block: blocksProperties[blockId] });
	if (!parentId || !blocksProperties[parentId]) return null;
	return blocksProperties[parentId] as BasicBlock & LayoutBlocks;
}
function getBlockHelper(state: EditorState, pageId: string, blockId: string): BasicBlock & Blocks {
	const { blocksProperties } = state.pages[pageId];
	return blocksProperties[blockId] as BasicBlock & Blocks;
}

function deleteBlockHelper(state: EditorState, pageId: string, blockId: string) {
	// allow recursive function
	// eslint-disable-next-line @typescript-eslint/no-use-before-define
	deleteChildFromParentHelper(state, pageId, blockId);

	delete state.pages[pageId].blocksProperties[blockId];
	delete state.pages[pageId].blocksState[blockId];
}

function deleteChildFromParentHelper(state: EditorState, pageId: string, blockId: string) {
	const parent = getParentHelper(state, pageId, blockId);
	console.log('deleteChildFromParentHelper', { pageId, blockId, parent, nP: !parent });
	if (!parent) return;
	parent.blocks = parent.blocks.filter((id) => id !== blockId);

	if ((parent.type === 'column' || parent.type === 'row') && parent.blocks.length === 0)
		deleteBlockHelper(state, pageId, parent.id);
}

function updateParentIdHelper(state: EditorState, pageId: string, blockId: string, newParentId: null | string) {
	const { blocksProperties } = state.pages[pageId];
	const block = blocksProperties[blockId] as BasicBlock;
	if (!block) return;
	block.parentId = newParentId;
}

export const editorSlice = createSlice({
	name: 'editor',
	initialState,
	reducers: {
		addBlocks: (state, action: PayloadAction<(BasicBlock & Blocks)[]>) => {
			action.payload.forEach((block) => {
				state.pages[block.pageId].blocksProperties[block.id] = block;
			});
		},
		updateParentId(state, action: PayloadAction<{ blockId: string; parentId: string; pageId: string }>) {
			const { pageId, blockId, parentId } = action.payload;
			deleteChildFromParentHelper(state, pageId, blockId);
			updateParentIdHelper(state, pageId, blockId, parentId);
		},
		updateBlockProps: (state, action: PayloadAction<Partial<Blocks> & Pick<BasicBlock, 'id' | 'pageId'>>) => {
			const { blocksProperties } = state.pages[action.payload.pageId];
			blocksProperties[action.payload.id] = update(blocksProperties[action.payload.id], {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				$merge: action.payload,
			});
		},

		addChildInsteadOf: (state, action: PayloadAction<{ pageId: string; blockId: string; replaceWithId: string }>) => {
			const { pageId, blockId, replaceWithId } = action.payload;
			const parent = getParentHelper(state, pageId, blockId);
			if (!parent) return;
			parent.blocks = parent.blocks.map((id) => (id !== blockId ? id : replaceWithId));
			updateParentIdHelper(state, pageId, replaceWithId, parent.id);
			updateParentIdHelper(state, pageId, blockId, null);
		},
		addChildAtIndex: (
			state,
			action: PayloadAction<{ pageId: string; parentId: string; blocksId: string | string[]; index?: number }>,
		) => {
			const { pageId, blocksId, index, parentId } = action.payload;
			const parent = getBlockHelper(state, pageId, parentId) as LayoutBlocks;
			if (!parent) return;

			(Array.isArray(blocksId) ? blocksId : [blocksId]).forEach((blockId, i) => {
				deleteChildFromParentHelper(state, pageId, blockId);
				updateParentIdHelper(state, pageId, blockId, parentId);

				if (typeof index !== 'undefined') parent.blocks.splice(index, i, blockId);
				else parent.blocks.push(blockId);
			});
		},
		addChildAfterId(state, action: PayloadAction<{ pageId: string; putAfterId: string; blocksId: string | string[] }>) {
			const { pageId, blocksId, putAfterId } = action.payload;
			const { blocksProperties } = state.pages[pageId];
			const { id: neighborId } = blocksProperties[putAfterId] as BasicBlock;

			const parent = getParentHelper(state, pageId, putAfterId);
			if (!parent) return;

			(Array.isArray(blocksId) ? blocksId : [blocksId]).forEach((blockId, i) => {
				deleteChildFromParentHelper(state, pageId, blockId);
				updateParentIdHelper(state, pageId, blockId, parent.id);
				parent.blocks.splice(parent.blocks.indexOf(neighborId) + 1 + i, 0, blockId);
			});
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
			const { id: blockId, pageId } = action.payload;
			deleteBlockHelper(state, pageId, blockId);
		},
		deleteChildFromParent: (state, action: PayloadAction<{ pageId: string; blockId: string }>) => {
			const { pageId, blockId } = action.payload;
			deleteChildFromParentHelper(state, pageId, blockId);
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
	addChildInsteadOf,
	addBlocks,
	deleteBlock,
	updateParentId,
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
