import createFastify from 'fastify';
import JSONdb from 'simple-json-db';
import fastifyCors from 'fastify-cors';

import { startWS } from './websocketServer';
import { getMongo } from '../utils/mongo';

type PageSchema = {
	value: any;
	pageId: string;
};

const fastify = createFastify({
	logger: false,
});

fastify.register(fastifyCors, {
	origin: '*',
});

fastify.get('/', async (request, reply) => {
	reply.type('application/json').code(200);
	return { hello: 'world' };
});

fastify.get<{ Querystring: { pageId: string } }>('/page', async (request, reply) => {
	reply.type('application/json').code(200);
	const { pageId } = request.query;
	const mongo = await getMongo();
	const resp = await mongo.collection<PageSchema>('pages').findOne({ pageId });
	if (!resp || !resp.value || !resp.value[request.query.pageId])
		return {
			value: {
				[pageId]: { id: pageId, type: 'page', blocks: [], parentId: null, pageId },
			},
		};
	return resp;
});

fastify.post<{ Body: { pageId: string; value: unknown } }>('/page', async (request, reply) => {
	reply.type('application/json').code(200);
	const { pageId, value } = request.body;

	const mongo = await getMongo();
	await mongo.collection<PageSchema>('pages').updateOne({ pageId }, { $set: { value } }, { upsert: true });

	return { ok: true };
});

fastify.get('/pages', async (request, reply) => {
	reply.type('application/json').code(200);
	const mongo = await getMongo();

	const response = await mongo
		.collection<PageSchema>('pages')
		.aggregate<{ names: string[] }>([
			{
				$group: { _id: null, names: { $addToSet: '$pageId' } },
			},
		])
		.toArray();

	return response[0].names;
});

fastify.listen(process.env.PORT || 8080, '0.0.0.0', (err, address) => {
	if (err) throw err;
	console.log(`Server is now listening on ${address}`);
});

startWS(fastify.server);
