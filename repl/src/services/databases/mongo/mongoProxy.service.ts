import { ServiceSchema } from 'moleculer';
import { MongoDatabaseSchema } from '../../../types/database.types';
import { MongoActions } from './actions.types';
import { getMongoClient } from './getMongoClient';

// listCollections
//  findOneAndUpdate
//  count
//  distinct
//  updateOne
//  updateMany

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
				sort: { type: 'object', optional: true },
				skip: { type: 'number', optional: true },
			},
			async handler(ctx) {
				const { id, collection, project, filter, skip, sort } = ctx.params;
				const database = await ctx.call<MongoDatabaseSchema, { id: string }>('databases.get', { id });
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
				filter: { type: 'object', optional: true, default: {} },
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
		deleteOne: {
			params: {
				id: { type: 'uuid', version: 4 },
				collection: 'string',
				filter: { type: 'object', optional: true, default: {} },
			},
			async handler(ctx) {
				const { id, collection, filter } = ctx.params;
				const database = await this.broker.call<MongoDatabaseSchema>('databases.get', { id });
				const [connection, db] = await getMongoClient(database);
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
				const { id, collection, filter } = ctx.params;
				const database = await this.broker.call<MongoDatabaseSchema>('databases.get', { id });
				const [connection, db] = await getMongoClient(database);
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
				const { id, collection, document } = ctx.params;
				const database = await this.broker.call<MongoDatabaseSchema>('databases.get', { id });
				const [connection, db] = await getMongoClient(database);
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
				const { id, collection, documents } = ctx.params;
				const database = await this.broker.call<MongoDatabaseSchema>('databases.get', { id });
				const [connection, db] = await getMongoClient(database);
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
				const { id, collection, pipeline } = ctx.params;
				const database = await this.broker.call<MongoDatabaseSchema>('databases.get', { id });
				const [connection, db] = await getMongoClient(database);
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
				const { id, collection, filter, update } = ctx.params;
				const database = await this.broker.call<MongoDatabaseSchema>('databases.get', { id });
				const [connection, db] = await getMongoClient(database);
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
				const { id, collection, filter, update } = ctx.params;
				const database = await this.broker.call<MongoDatabaseSchema>('databases.get', { id });
				const [connection, db] = await getMongoClient(database);
				const result = await db.collection(collection).insertOne(filter, update);
				connection.close();
				return result;
			},
		},
	},
	methods: {},
};

export default MongoProxyService;
