import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { editorReducer } from '../features/editor/redux/editor';
import { userSlice } from '../features/user/redux/user';
import { immerSlice } from './immerSlice';

const appReducer = combineReducers({
	editor: editorReducer,
	user: userSlice.reducer,
	immer: immerSlice.reducer,
});

const PERSIST_KEY = 'root';

const rootReducer: typeof appReducer = (state, action) => {
	if (action.type === 'USER_LOGOUT') {
		localStorage.removeItem(`persist:${PERSIST_KEY}`);
		return appReducer(undefined, action);
	}

	return appReducer(state, action);
};
const persistedReducer = persistReducer(
	{
		key: PERSIST_KEY,
		storage,
		blacklist: ['editor', 'immer'],
	},
	rootReducer,
);

export const store = configureStore({
	reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
