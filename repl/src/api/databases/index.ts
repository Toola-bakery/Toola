import { v4, version } from 'uuid';
import { FastifyInstance } from 'fastify';

type DatabaseSchema = {
	_id: string;
	type: 'mongodb';
	name: string;
	host: string;
	connectionFormat: 'dns' | 'standard';
	dbName: string;
	username: string;
	password: string;
	ssl: boolean;
	CA?: string;
	clientKeyAndCert?: string;
};

// fastify.get<{ Querystring: { pageId: string } }>('/page', async (request, reply) => {
// 	reply.type('application/json').code(200);
// 	const { pageId } = request.query;
// 	const resp = await fastify.mongo.db.collection<PageSchema>('pages').findOne({ pageId });
// 	if (!resp || !resp.value || !resp.value[request.query.pageId])
// 		return {
// 			value: {
// 				[pageId]: { id: pageId, type: 'page', blocks: [], parentId: null, pageId },
// 			},
// 		};
// 	return resp;
// });

export function databasesRoute(fastify: FastifyInstance) {
	fastify.post<{ Body: DatabaseSchema }>('/databases', async (request, reply) => {
		reply.type('application/json').code(200);
		const database = request.body;

		if (database._id && version(database._id) !== 4) throw new Error('bad _id');

		const newId = database._id || v4();

		await fastify.mongo.db
			.collection<DatabaseSchema>('databases')
			.updateOne({ _id: newId }, { $setOnInsert: { _id: newId }, $set: database }, { upsert: true });

		return { ok: true };
	});

	fastify.get('/databases', async (request, reply) => {
		reply.type('application/json').code(200);
		return fastify.mongo.db.collection<DatabaseSchema>('databases').find().toArray();
	});
}
