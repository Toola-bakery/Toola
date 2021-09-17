import { Context, ServiceSchema } from 'moleculer';
import { MongoDatabaseSchema } from '../../../types/database.types';
import { MongoActions } from './actions.types';
import { getMongoClient } from './getMongoClient';

// listCollections
//  findOneAndUpdate
//  count
//  distinct

async function getDatabase(ctx: Context<{ id: string }>) {
	const { id } = ctx.params;
	const database = await ctx.call<MongoDatabaseSchema, { id: string }>('databases.get', { id }, ctx.meta);
	return getMongoClient(database);
}

export const MongoProxyService: ServiceSchema<'mongoProxy', MongoActions> = {
	name: 'mongoProxy',
	settings: {},
	actions: {
		findOne: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				filter: { type: 'object', optional: true, default: {} },
				project: { type: 'object', optional: true },
				sort: { type: 'object', convert: true, optional: true },
				skip: { type: 'number', convert: true, optional: true },
			},
			async handler(ctx) {
				const { collection, project, filter, skip, sort } = ctx.params;
				const [connection, db] = await getDatabase(ctx);
				const result = await db.collection(collection).findOne(filter, { projection: project, skip, sort });
				connection.close();
				return result;
			},
		},
		find: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: { type: 'string', min: 1 },
				filter: { type: 'object', optional: true, default: {} },
				project: { type: 'object', optional: true },
				sort: { type: 'object', optional: true },
				limit: { type: 'number', convert: true, optional: true, default: 100 },
				skip: { type: 'number', convert: true, optional: true },
			},
			async handler(ctx) {
				const { collection, project, filter, limit, skip, sort } = ctx.params;
				const [connection, db] = await getDatabase(ctx);
				const result = await db
					.collection(collection)
					.find(filter, { projection: project, limit, skip, sort })
					.toArray();
				connection.close();
				return result;
			},
		},
		deleteOne: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				filter: { type: 'object', optional: true, default: {} },
			},
			async handler(ctx) {
				const { collection, filter } = ctx.params;
				const [connection, db] = await getDatabase(ctx);
				const result = await db.collection(collection).deleteOne(filter);
				connection.close();
				return result;
			},
		},
		deleteMany: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				filter: { type: 'object', optional: true, default: {} },
			},
			async handler(ctx) {
				const { collection, filter } = ctx.params;
				const [connection, db] = await getDatabase(ctx);
				const result = await db.collection(collection).deleteMany(filter);
				connection.close();
				return result;
			},
		},
		insertOne: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				document: { type: 'object' },
			},
			async handler(ctx) {
				const { collection, document } = ctx.params;
				const [connection, db] = await getDatabase(ctx);
				const result = await db.collection(collection).insertOne(document);
				connection.close();
				return result;
			},
		},
		insertMany: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				documents: { type: 'array', items: { type: 'object' } },
			},
			async handler(ctx) {
				const { collection, documents } = ctx.params;
				const [connection, db] = await getDatabase(ctx);
				const result = await db.collection(collection).insertMany(documents);
				connection.close();
				return result;
			},
		},
		aggregate: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				pipeline: { type: 'array', items: { type: 'object' } },
			},
			async handler(ctx) {
				const { collection, pipeline } = ctx.params;
				const [connection, db] = await getDatabase(ctx);
				const result = await db.collection(collection).aggregate(pipeline).toArray();
				connection.close();
				return result;
			},
		},
		updateMany: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				filter: { type: 'object', optional: true, default: {} },
				update: { type: 'object', optional: true, default: {} },
			},
			async handler(ctx) {
				const { collection, filter, update } = ctx.params;
				const [connection, db] = await getDatabase(ctx);
				const result = await db.collection(collection).updateMany(filter, update);
				connection.close();
				return result;
			},
		},
		updateOne: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				filter: { type: 'object', optional: true, default: {} },
				update: { type: 'object', optional: true, default: {} },
			},
			async handler(ctx) {
				const { collection, filter, update } = ctx.params;
				const [connection, db] = await getDatabase(ctx);
				const result = await db.collection(collection).insertOne(filter, update);
				connection.close();
				return result;
			},
		},
	},
	methods: {},
};

export default MongoProxyService;
