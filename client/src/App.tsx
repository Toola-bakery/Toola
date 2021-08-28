import * as React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './redux';
import { AppRouters } from './routes';
import { AppStyles } from './AppStyles';

export default function App(): JSX.Element {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<AppStyles>
					<AppRouters />
				</AppStyles>
			</PersistGate>
		</Provider>
	);
}
