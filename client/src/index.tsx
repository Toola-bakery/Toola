import * as React from 'react';
import ReactDOM from 'react-dom';
import { enablePatches } from 'immer';
import CssBaseline from '@material-ui/core/CssBaseline';
import App from './App';

enablePatches();
ReactDOM.render(
	<>
		{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
		<CssBaseline />
		<App />
	</>,
	document.getElementById('root'),
);
