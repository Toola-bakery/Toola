import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import EditorRoute from './EditorRoute';

export function AppRouters() {
	return (
		<Router>
			<div>
				<Switch>
					<Route path="/:pageId">
						<EditorRoute />
					</Route>
				</Switch>
			</div>
		</Router>
	);
}
