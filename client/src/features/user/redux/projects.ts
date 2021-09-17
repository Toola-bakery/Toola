import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ProjectSchema = {
	_id: string;
	name: string;
	owner: string;
	createdBy: string;
	users: string[];
};

export type ProjectsState = {
	currentProjectId?: string;
	projectsCache?: ProjectSchema[];
};

const initialState: ProjectsState = {};

export const projectsSlice = createSlice({
	name: 'projects',
	initialState,
	reducers: {
		setProjectsCache(state, action: PayloadAction<ProjectSchema[]>) {
			state.projectsCache = action.payload;
		},
		setProjectId(state, action: PayloadAction<string>) {
			state.currentProjectId = action.payload;
		},
	},
});

export const { setProjectsCache, setProjectId } = projectsSlice.actions;
