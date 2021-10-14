import { ServiceSchema } from 'moleculer';
import { MongoDatabaseSchema } from '../../../types/database.types';
import { getPostgresqlClient } from './getPostgresqlClient';
import { postgresqlQueryBuilder } from './postgresqlQueryBuilder';

export const PostgresqlManagerService: ServiceSchema<
	'postgresqlManager',
	{
		queryBuilder: {
			id: string;
		};
		// updateCollections: {
		// 	id: string;
		// };
	}
> = {
	name: 'postgresqlManager',
	settings: {},
	actions: {
		queryBuilder: {
			params: {
				id: { type: 'uuid', version: 4, optional: true },
			},
			handler(ctx) {
				return postgresqlQueryBuilder();
			},
		},
		// updateCollections: {
		// 	params: {
		// 		id: { type: 'uuid', version: 4 },
		// 	},
		// 	async handler(ctx) {
		// 		const { id } = ctx.params;
		// 		const database = await ctx.call<MongoDatabaseSchema, { id: string }>('databases.get', { id });
		//
		// 		const [client, db] = await getMongoClient(database);
		// 		const listCollections = await db.listCollections().toArray();
		// 	},
		// },
	},
	methods: {},
};

export default PostgresqlManagerService;
