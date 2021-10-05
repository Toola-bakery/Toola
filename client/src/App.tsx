import * as React from 'react';
import { Helmet } from 'react-helmet';
import { Provider } from 'react-redux';
import { FocusStyleManager, HotkeysProvider } from '@blueprintjs/core';
import { PersistGate } from 'redux-persist/integration/react';
import { QueryProvider } from './components/QueryProvider';
import { persistor, store } from './redux';
import { AppRouters } from './routes';
import { AppStyles } from './AppStyles';
import './libs/firebase';

FocusStyleManager.onlyShowFocusOnTabs();

export default function App(): JSX.Element {
	return (
		<>
			<Helmet>
				<title>internal tool app</title>
			</Helmet>
			<Provider store={store}>
				<PersistGate loading={null} persistor={persistor}>
					<QueryProvider>
						<AppStyles>
							<HotkeysProvider>
								<AppRouters />
							</HotkeysProvider>
						</AppStyles>
					</QueryProvider>
				</PersistGate>
			</Provider>
		</>
	);
}
