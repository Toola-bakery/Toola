import { Route, Switch } from 'react-router-dom';
import { AddMongoResource } from './AddMongoResource';
import { ResourcesListRoute } from './ResourcesListRoute';

export function ResourcesRoute() {
	return (
		<Switch>
			<Route path="/resources/mongodb">
				<AddMongoResource />
			</Route>
			<Route path="/resources">
				<ResourcesListRoute />
			</Route>
		</Switch>
	);
}
