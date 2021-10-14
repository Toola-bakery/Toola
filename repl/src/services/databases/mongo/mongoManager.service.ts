import { ServiceSchema } from 'moleculer';
import { Document } from 'mongodb';
import { MongoDatabaseSchema } from '../../../types/database.types';
import { getMongoClient } from './getMongoClient';
import { mongoQueryBuilder } from './mongoQueryBuilder';

export const MongoManagerService: ServiceSchema<
	'mongoManager',
	{
		queryBuilder: {
			id: string;
		};
		schema: {
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
		schema: {
			params: {
				id: { type: 'uuid', version: 4 },
			},
			async handler(ctx) {
				const { id } = ctx.params;
				const database = await ctx.call<MongoDatabaseSchema, { id: string }>('databases.get', { id });

				const [client, db] = await getMongoClient(database);
				const listCollections = await db.listCollections({ type: 'collection', name: /^[^.]*$/ }).toArray();
				const promises = listCollections
					.filter(col => col.type === 'collection')
					.map<Promise<[string, Document]>>(async col => [
						col.name,
						(
							await db
								.collection(col.name)
								.aggregate([
									{ $sample: { size: 1000 } },
									{
										$replaceRoot: {
											newRoot: {
												data: {
													$map: {
														input: { $objectToArray: '$$ROOT' },
														in: ['$$this.k', { $type: '$$this.v' }],
													},
												},
											},
										},
									},
									{ $unwind: { path: '$data' } },
									{
										$group: {
											_id: { key: { $arrayElemAt: ['$data', 0] }, type: { $arrayElemAt: ['$data', 1] } },
											sum: { $sum: 1 },
										},
									},
									{
										$group: {
											_id: '$_id.key',
											types: { $push: { k: '$_id.type', v: '$sum' } },
											sum: { $sum: '$sum' },
										},
									},
									{
										$group: {
											_id: null,
											fields: {
												$push: { k: '$_id', v: { $arrayToObject: '$types' } },
											},
											sum: { $max: '$sum' },
										},
									},
									{
										$project: { types: { $arrayToObject: '$fields' }, sum: '$sum' },
									},
								])
								.toArray()
						)[0],
					]);

				const result = await Promise.all(promises);

				return Object.fromEntries(
					result.map(colData => {
						console.log({ colData });
						return [
							colData[0],
							Object.fromEntries(
								Object.entries(colData[1]?.types || []).map(([fieldName, types]) => [
									fieldName,
									{ data_type: Object.entries(types).sort((a, b) => (a[0] === 'null' ? 1 : b[1] - a[1])) },
								]),
							),
						];
					}),
				);
				// listCollections.map(v=>v.)
			},
		},
	},
	methods: {},
};

export default MongoManagerService;
