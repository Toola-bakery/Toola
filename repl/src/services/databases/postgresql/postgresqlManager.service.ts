import { ServiceSchema } from 'moleculer';
import { MongoDatabaseSchema, PostgresqlDatabaseSchema } from '../../../types/database.types';
import { getPostgresqlClient } from './getPostgresqlClient';
import { postgresqlQueryBuilder } from './postgresqlQueryBuilder';

export const PostgresqlManagerService: ServiceSchema<
	'postgresqlManager',
	{
		queryBuilder: {
			id: string;
		};
		schema: {
			id: string;
		};
	}
> = {
	name: 'postgresqlManager',
	settings: {},
	actions: {
		queryBuilder: {
			visibility: 'public',
			params: {
				id: { type: 'uuid', version: 4, optional: true },
			},
			handler(ctx) {
				return postgresqlQueryBuilder();
			},
		},
		schema: {
			visibility: 'public',
			params: {
				id: { type: 'uuid', version: 4 },
			},
			async handler(ctx) {
				const { id } = ctx.params;
				const database = await ctx.call<PostgresqlDatabaseSchema, { id: string }>('databases.get', { id });

				const client = await getPostgresqlClient(database);

				const resp = await client.query<{
					table_name: string;
					udt_name: string;
					column_name: string;
					data_type: string;
				}>(
					"SELECT udt_name, table_name, column_name, data_type  FROM information_schema.columns WHERE table_schema = 'public';",
				);

				const tables = {};

				resp.rows.forEach(e => {
					if (!tables[e.table_name]) tables[e.table_name] = {};
					tables[e.table_name][e.column_name] = { data_type: e.data_type };
				});

				return tables;
			},
		},
	},
	methods: {},
};

export default PostgresqlManagerService;
