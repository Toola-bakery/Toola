import * as React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux';
import EditorRoute from './routes/EditorRoute';

export default function App(): JSX.Element {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<EditorRoute />
			</PersistGate>
		</Provider>
	);
}
