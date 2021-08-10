import * as React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import styled from 'styled-components';
import { persistor, store } from './redux';
import { AppRouters } from './routes';

const Outline = styled.div`
	[contenteditable] {
		outline: 0 solid transparent;
	}
`;
export default function App(): JSX.Element {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Outline>
					<AppRouters />
				</Outline>
			</PersistGate>
		</Provider>
	);
}
