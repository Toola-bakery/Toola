import {} from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { editorReducer } from '../features/editor/redux/editor';

const rootReducer = combineReducers({
	editor: editorReducer,
});

const persistedReducer = persistReducer(
	{
		key: 'root',
		storage,
	},
	rootReducer,
);

export const store = configureStore({
	reducer: persistedReducer,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
