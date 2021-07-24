import { FastifyInstance } from 'fastify';

type PageSchema = {
	value: any;
	pageId: string;
};

export function pagesRoute(fastify: FastifyInstance) {
	fastify.get<{ Querystring: { pageId: string } }>('/page', async (request, reply) => {
		reply.type('application/json').code(200);
		const { pageId } = request.query;
		const resp = await fastify.mongo.db.collection<PageSchema>('pages').findOne({ pageId });
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

		await fastify.mongo.db.collection<PageSchema>('pages').updateOne({ pageId }, { $set: { value } }, { upsert: true });

		return { ok: true };
	});

	fastify.get('/pages', async (request, reply) => {
		reply.type('application/json').code(200);
		const response = await fastify.mongo.db
			.collection<PageSchema>('pages')
			.aggregate<{ names: string[] }>([
				{
					$group: { _id: null, names: { $addToSet: '$pageId' } },
				},
			])
			.toArray();

		return response[0].names;
	});
}
