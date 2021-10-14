import { DatabaseSchema } from '../../../types/database.types';
import { PostgresqlActions } from './actions.types';

type Actions = keyof PostgresqlActions;
type Query = {
	[K in Actions]: { [A in Exclude<keyof PostgresqlActions[K], 'id'>]: { type: string; label: string } };
};

export function postgresqlQueryBuilder(database?: DatabaseSchema): Query {
	return {
		querySQL: {
			query: { type: 'pgSQL', label: 'Query' },
		},
	};
}
