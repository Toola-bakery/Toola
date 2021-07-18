import * as React from 'react';
import { Provider } from 'react-redux';
import Box from '@material-ui/core/Box';
import { PersistGate } from 'redux-persist/integration/react';
import { Page } from './features/editor/components/Page';
import { persistor, store } from './redux';
import { BlockMenuProvider } from './features/editor/components/BlockMenuProvider';
import { ExecutorProvider } from './features/executor/components/ExecutorProvider';

export default function App(): JSX.Element {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ExecutorProvider>
					<BlockMenuProvider>
						<Box sx={{ display: 'flex' }}>
							<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
								<Page />
							</Box>
						</Box>
					</BlockMenuProvider>
				</ExecutorProvider>
			</PersistGate>
		</Provider>
	);
}
