import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer, createTransform } from 'redux-persist';
import { stringify, parse } from 'flatted';
// import storage from 'redux-persist/lib/storage';

import { editorReducer } from '../features/editor/redux/editor';

const rootReducer = combineReducers({
	editor: editorReducer,
});

// export const transformCircular = createTransform(
// 	(inboundState, key) => stringify(inboundState),
// 	(outboundState, key) => parse(outboundState),
// );

// const persistedReducer = persistReducer(
// 	{
// 		key: 'root',
// 		storage,
// 		blacklist: ['editor'],
// 	},
// 	rootReducer,
// );

export const store = configureStore({
	reducer: rootReducer,
});

// export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
