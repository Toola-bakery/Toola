import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { applyPatches, Patch } from 'immer';

const initialState: { [key: string]: any } = {};
export const immerSlice = createSlice({
	name: 'immer',
	initialState,
	reducers: {
		immerPatch: (state, action: PayloadAction<{ patches: Patch[]; key: string }>) => {
			state[action.payload.key] = applyPatches(state[action.payload.key] || {}, action.payload.patches);
		},
	},
});

export const { immerPatch } = immerSlice.actions;
