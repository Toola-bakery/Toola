import { Context, ServiceSchema } from 'moleculer';
import { PostgresqlDatabaseSchema } from '../../../types/database.types';
import { PostgresqlActions } from './actions.types';
import { getPostgresqlClient } from './getPostgresqlClient';

async function getDatabase(ctx: Context<{ id: string }>) {
	const { id } = ctx.params;
	const database = await ctx.call<PostgresqlDatabaseSchema, { id: string }>('databases.get', { id }, ctx.meta);
	return getPostgresqlClient(database);
}

export const PostgresqlProxyService: ServiceSchema<'postgresqlProxy', PostgresqlActions> = {
	name: 'postgresqlProxy',
	settings: {},
	actions: {
		querySQL: {
			params: {
				id: { type: 'uuid', version: 4 },
				query: { type: 'string' },
			},
			async handler(ctx) {
				const { query } = ctx.params;
				const connection = await getDatabase(ctx);
				const result = await connection.query(query);
				connection.end();
				return result.rows;
			},
		},
	},
	methods: {},
};

export default PostgresqlProxyService;
