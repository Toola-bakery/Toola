import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { applyPatches, Patch } from 'immer';

const initialState: { [key: string]: any } = {};
export const sessionImmerSlice = createSlice({
	name: 'sessionImmer',
	initialState,
	reducers: {
		immerPatch: (state, action: PayloadAction<{ patches: Patch[]; key: string }>) => {
			if (!state[action.payload.key]) state[action.payload.key] = {};
			applyPatches(state[action.payload.key], action.payload.patches);
		},
	},
});

export const { immerPatch } = sessionImmerSlice.actions;
