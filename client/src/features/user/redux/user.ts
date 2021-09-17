import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserSchema = {
	_id: string;
	displayName?: string;
	profileSrc?: string;
	email: string;

	password?: string;

	createdAt: Date;
};

export type UserState = {
	authToken?: string;
	userId?: string;
	currentUser?: UserSchema;
};

const initialState: UserState = {};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setAuthValues(
			state,
			action: PayloadAction<{
				authToken?: string;
				userId?: string;
				currentUser?: UserSchema;
			}>,
		) {
			const { currentUser, userId, authToken } = action.payload;
			if (typeof authToken !== 'undefined') state.authToken = authToken;
			if (typeof userId !== 'undefined') state.userId = userId;
			if (typeof currentUser !== 'undefined') state.currentUser = currentUser;
		},
	},
});

export const { setAuthValues } = userSlice.actions;
