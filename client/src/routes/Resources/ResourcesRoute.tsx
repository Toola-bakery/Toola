import { Route, Switch } from 'react-router-dom';
import { AddMongoResource } from './AddMongoResource';
import { AddPostgresqlResource } from './AddPostgresqlResource';
import { AddResource } from './AddResource';
import { ResourcesListRoute } from './ResourcesListRoute';

export function ResourcesRoute() {
	return (
		<Switch>
			<Route path="/resources/add">
				<AddResource />
			</Route>
			<Route path="/resources/mongo">
				<AddMongoResource />
			</Route>
			<Route path="/resources/postgresql">
				<AddPostgresqlResource />
			</Route>
			<Route path="/resources">
				<ResourcesListRoute />
			</Route>
		</Switch>
	);
}
