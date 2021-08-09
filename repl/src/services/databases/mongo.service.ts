import { Context, ServiceSchema } from 'moleculer';
import { MongoClient } from 'mongodb';
import { MongoDatabaseSchema } from '../../types/database.types';

async function getMongoClient(mongoProps: MongoDatabaseSchema) {
	const { host, clientKeyAndCert, CA, connectionFormat, port, dbName, ssl, username, password } = mongoProps;

	const url = `${connectionFormat === 'dns' ? 'mongodb+srv' : 'mongodb'}://${host}${
		connectionFormat !== 'dns' ? `:${port}` : ''
	}`;
	const mongoConnection = await MongoClient.connect(url, {
		auth: { username, password },
		ssl: !!ssl,
		ca: CA,
	});

	const db = mongoConnection.db(dbName);
	return [mongoConnection, db] as const;
}

export const MongoService: ServiceSchema<
	'mongo',
	{
		findOne: {
			id: string;
			collection: string;
			filter: any;
			project?: any;
			sort?: any;
			skip?: number;
		};
		find: {
			id: string;
			collection: string;
			filter: any;
			project?: any;
			sort?: any;
			limit?: number;
			skip?: number;
		};
	}
> = {
	name: 'mongo',
	settings: {},
	actions: {
		findOne: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				filter: { type: 'object', default: {} },
				project: { type: 'object', optional: true },
				sort: { type: 'object', optional: true },
				skip: { type: 'number', optional: true },
			},
			async handler(ctx) {
				const { id, collection, project, filter, skip, sort } = ctx.params;
				const database = await this.broker.call<MongoDatabaseSchema>('databases.get', { id });
				const [connection, db] = await getMongoClient(database);
				const result = await db.collection(collection).findOne(filter, { projection: project, skip, sort });
				connection.close();
				return result;
			},
		},
		find: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				filter: { type: 'object', default: {} },
				project: { type: 'object', optional: true },
				sort: { type: 'object', optional: true },
				limit: { type: 'number', optional: true, default: 100 },
				skip: { type: 'number', optional: true },
			},
			async handler(ctx) {
				const { id, collection, project, filter, limit, skip, sort } = ctx.params;
				const database = await this.broker.call<MongoDatabaseSchema>('databases.get', { id });
				const [connection, db] = await getMongoClient(database);
				const result = await db
					.collection(collection)
					.find(filter, { projection: project, limit, skip, sort })
					.toArray();
				connection.close();
				return result;
			},
		},
	},
	methods: {},
};

export default MongoService;
