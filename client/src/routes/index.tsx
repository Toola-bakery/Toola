import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import EditorRoute from './EditorRoute';

export function AppRouters() {
	return (
		<Router>
			<Switch>
				<Route path="/:pageId">
					<EditorRoute />
				</Route>
			</Switch>
		</Router>
	);
}
