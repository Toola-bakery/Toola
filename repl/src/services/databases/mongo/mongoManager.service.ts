import { ServiceSchema } from 'moleculer';
import { MongoDatabaseSchema } from '../../../types/database.types';
import { getMongoClient } from './getMongoClient';
import { mongoQueryBuilder } from './mongoQueryBuilder';

export const MongoManagerService: ServiceSchema<
	'mongoManager',
	{
		queryBuilder: {
			id: string;
		};
		updateCollections: {
			id: string;
		};
	}
> = {
	name: 'mongoManager',
	settings: {},
	actions: {
		queryBuilder: {
			params: {
				id: { type: 'uuid', version: 4, optional: true },
			},
			handler(ctx) {
				return mongoQueryBuilder();
			},
		},
		updateCollections: {
			params: {
				id: { type: 'uuid', version: 4 },
			},
			async handler(ctx) {
				const { id } = ctx.params;
				const database = await ctx.call<MongoDatabaseSchema, { id: string }>('databases.get', { id });

				const [client, db] = await getMongoClient(database);
				const listCollections = await db.listCollections().toArray();
			},
		},
	},
	methods: {},
};

export default MongoManagerService;
