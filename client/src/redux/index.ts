import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { editorReducer } from '../features/editor/redux/editor';
import { userSlice } from '../features/user/redux/user';
import { immerSlice } from './immerSlice';

const rootReducer = combineReducers({
	editor: editorReducer,
	user: userSlice.reducer,
	immer: immerSlice.reducer,
});

const persistedReducer = persistReducer(
	{
		key: 'root',
		storage,
		blacklist: ['editor'],
	},
	rootReducer,
);

export const store = configureStore({
	reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
