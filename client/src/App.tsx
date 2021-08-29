import * as React from 'react';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
import { queryClient } from './api';
import { store } from './redux';
import { AppRouters } from './routes';
import { AppStyles } from './AppStyles';

export default function App(): JSX.Element {
	return (
		<Provider store={store}>
			{/*<PersistGate loading={null} persistor={persistor}>*/}
			<QueryClientProvider client={queryClient}>
				<AppStyles>
					<AppRouters />
				</AppStyles>
			</QueryClientProvider>
			{/*</PersistGate>*/}
		</Provider>
	);
}
