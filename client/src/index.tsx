import * as React from 'react';
import ReactDOM from 'react-dom';
import { enablePatches } from 'immer';
import App from './App';

enablePatches();
ReactDOM.render(<App />, document.getElementById('root'));
