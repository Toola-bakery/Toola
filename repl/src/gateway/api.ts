import createFastify from 'fastify';
import JSONdb from 'simple-json-db';
import fastifyCors from 'fastify-cors';

const db = new JSONdb('./database.json');

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
	const resp = db.get(pageId) as any;
	if (!resp || !resp.value || !resp.value[request.query.pageId])
		return {
			value: {
				[pageId]: { id: pageId, type: 'page', blocks: [], parentId: null, pageId },
			},
		};
	return resp;
});

fastify.get('/pages', async (request, reply) => {
	reply.type('application/json').code(200);
	return Object.keys(db.JSON());
});

fastify.post<{ Body: { pageId: string; value: unknown } }>('/page', async (request, reply) => {
	reply.type('application/json').code(200);
	db.set(request.body.pageId, { value: request.body.value });
	return { ok: true };
});

fastify.listen(3001, (err, address) => {
	if (err) throw err;
	console.log(`Server is now listening on ${address}`);
});
